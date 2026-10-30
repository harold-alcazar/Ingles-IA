import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { AuthService } from './auth.service';
import { supabase, DatabaseUserProgress } from '../../../lib/supabase';
import { CEFRLevel } from '../models/course.model';
import { SavedVocabularyItem, UserProgressState } from '../models/user.model';

const STORAGE_KEY = 'devlingo_user_progress_v1';

const DEFAULT_STATE: UserProgressState = {
  userId: null,
  isAuthenticated: false,
  userEmail: null,
  xp: 0,
  streak: 1,
  currentLevel: 'A1',
  completedMissionIds: [],
  savedVocabulary: [],
  lastActivityDate: new Date().toISOString().split('T')[0],
  isSyncing: false
};

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private readonly auth = inject(AuthService);

  // Core reactive signal
  public readonly state = signal<UserProgressState>(this.loadFromLocalStorage());

  // Derived computed signals
  public readonly xp = computed(() => this.state().xp);
  public readonly streak = computed(() => this.state().streak);
  public readonly currentLevel = computed(() => this.state().currentLevel);
  public readonly completedMissions = computed(() => this.state().completedMissionIds);
  public readonly savedVocabulary = computed(() => this.state().savedVocabulary);
  public readonly isSyncing = computed(() => this.state().isSyncing);

  constructor() {
    // Automatically persist to localStorage whenever state changes
    effect(() => {
      const currentState = this.state();
      this.saveToLocalStorage(currentState);
    });

    // Reactive listener to auth changes: triggers cloud sync
    effect(() => {
      const user = this.auth.currentUser();
      if (user) {
        this.syncWithSupabase(user.id, user.email ?? null);
      } else {
        this.state.update(s => ({
          ...s,
          userId: null,
          isAuthenticated: false,
          userEmail: null
        }));
      }
    });
  }

  private loadFromLocalStorage(): UserProgressState {
    if (typeof localStorage === 'undefined') return DEFAULT_STATE;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_STATE;
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_STATE,
        ...parsed,
        isSyncing: false
      };
    } catch {
      return DEFAULT_STATE;
    }
  }

  private saveToLocalStorage(state: UserProgressState): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error('Failed to write progress to localStorage', err);
    }
  }

  /**
   * Offline-first sync with Supabase:
   * 1. Pull remote state from public.user_progress
   * 2. Merge local and remote (union completed missions, max XP)
   * 3. Upsert back to Supabase and update local signal
   */
  public async syncWithSupabase(userId: string, email: string | null): Promise<void> {
    this.state.update(s => ({ ...s, isSyncing: true, userId, userEmail: email, isAuthenticated: true }));

    try {
      const { data: remoteData, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Could not query Supabase user_progress (offline mode active):', error.message);
        this.state.update(s => ({ ...s, isSyncing: false }));
        return;
      }

      const local = this.state();

      // Merge strategy: Union completed missions, take max XP, merge vocab
      const mergedMissions = Array.from(new Set([
        ...local.completedMissionIds,
        ...(remoteData?.completed_mission_ids || [])
      ]));

      const mergedXP = Math.max(local.xp, remoteData?.xp || 0);
      const mergedStreak = Math.max(local.streak, remoteData?.streak || 1);

      // Upsert merged record
      const payload: DatabaseUserProgress = {
        user_id: userId,
        xp: mergedXP,
        streak: mergedStreak,
        current_level: remoteData?.current_level || local.currentLevel,
        completed_mission_ids: mergedMissions,
        saved_vocabulary: local.savedVocabulary,
        last_activity_date: new Date().toISOString().split('T')[0]
      };

      const { error: upsertError } = await supabase
        .from('user_progress')
        .upsert(payload, { onConflict: 'user_id' });

      if (upsertError) {
        console.error('Error upserting progress to Supabase:', upsertError.message);
      }

      // Update local state with merged truth
      this.state.update(s => ({
        ...s,
        xp: mergedXP,
        streak: mergedStreak,
        completedMissionIds: mergedMissions,
        isSyncing: false
      }));

    } catch (err) {
      console.warn('Network error during Supabase sync; offline cache retained.', err);
      this.state.update(s => ({ ...s, isSyncing: false }));
    }
  }

  public completeMission(missionId: string, xpGain: number): void {
    const current = this.state();
    if (current.completedMissionIds.includes(missionId)) return;

    const newMissions = [...current.completedMissionIds, missionId];
    const newXP = current.xp + xpGain;

    this.state.update(s => ({
      ...s,
      xp: newXP,
      completedMissionIds: newMissions
    }));

    // If authenticated, push background update to Supabase
    if (current.userId) {
      supabase
        .from('user_progress')
        .update({
          xp: newXP,
          completed_mission_ids: newMissions,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', current.userId)
        .then(({ error }) => {
          if (error) console.warn('Background sync deferred (offline):', error.message);
        });
    }
  }

  public saveVocabulary(term: string, translation: string, techContext: string): void {
    const current = this.state();
    const exists = current.savedVocabulary.some(item => item.term.toLowerCase() === term.toLowerCase());
    if (exists) return;

    const newItem: SavedVocabularyItem = {
      term,
      translation,
      techContext,
      savedAt: new Date().toISOString()
    };

    const updatedVocab = [newItem, ...current.savedVocabulary];
    this.state.update(s => ({
      ...s,
      savedVocabulary: updatedVocab
    }));

    if (current.userId) {
      supabase
        .from('user_progress')
        .update({
          saved_vocabulary: updatedVocab,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', current.userId)
        .then();
    }
  }

  public isMissionCompleted(missionId: string): boolean {
    return this.state().completedMissionIds.includes(missionId);
  }
}
