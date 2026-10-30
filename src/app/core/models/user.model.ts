import { CEFRLevel } from './course.model';

export interface SavedVocabularyItem {
  term: string;
  translation: string;
  techContext: string;
  savedAt: string;
}

export interface UserProgressState {
  userId?: string | null;
  isAuthenticated: boolean;
  userEmail?: string | null;
  xp: number;
  streak: number;
  currentLevel: CEFRLevel;
  completedMissionIds: string[];
  savedVocabulary: SavedVocabularyItem[];
  lastActivityDate: string;
  isSyncing: boolean;
}
