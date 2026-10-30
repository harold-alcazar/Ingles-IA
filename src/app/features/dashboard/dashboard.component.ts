import { Component, output, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CURRICULUM_DATA } from '../../../data/courses';
import { CEFRLevel, Mission } from '../../core/models/course.model';
import { ProgressService } from '../../core/services/progress.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6 pb-24">
      <!-- Hero / Method banner -->
      <div class="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-2xl">
        <div class="relative z-10 space-y-2 max-w-xl">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-sky-500/10 text-sky-400 border border-sky-500/30">
            <span>🧠 Krashen's Comprehensible Input (i + 1)</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            English Acquisition for Software Engineers
          </h1>
          <p class="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            Zero abstract grammar rules. Acquire native developer intuition through real war rooms, pull request debates, Slack huddles, and architecture RFCs.
          </p>
        </div>
        <div class="absolute -right-8 -bottom-10 text-8xl text-slate-800/30 font-mono select-none pointer-events-none">
          &lt;/&gt;
        </div>
      </div>

      <!-- Level Selector Tabs (A1 -> C2) -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono uppercase text-slate-400 tracking-wider font-semibold">CEFR Framework</span>
          <span class="text-xs text-slate-500 font-mono">{{ activeLevelData().missions.length }} Missions available</span>
        </div>

        <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
          @for (lvl of levels; track lvl) {
            <button
              type="button"
              (click)="selectedLevel.set(lvl)"
              class="flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl border transition-all text-center"
              [ngClass]="selectedLevel() === lvl
                ? 'bg-sky-500/15 border-sky-400 text-sky-300 shadow-md shadow-sky-500/10'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'"
            >
              <span class="text-sm font-extrabold font-mono">{{ lvl }}</span>
              <span class="text-[9px] font-semibold tracking-tight truncate w-full px-1 mt-0.5">
                {{ getLevelShortName(lvl) }}
              </span>
            </button>
          }
        </div>
      </div>

      <!-- Selected Level Overview Banner -->
      <div class="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-base">{{ activeLevelData().badge }}</span>
            <h2 class="text-base font-bold text-slate-100">{{ activeLevelData().name }}</h2>
          </div>
          <p class="text-xs text-slate-400 mt-1 font-sans">{{ activeLevelData().summary }}</p>
        </div>

        <div class="flex-shrink-0 flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 font-mono text-xs">
          <span class="text-slate-400">Level Progress:</span>
          <span class="text-emerald-400 font-bold">
            {{ levelCompletedCount() }} / {{ activeLevelData().missions.length }}
          </span>
        </div>
      </div>

      <!-- Missions Grid -->
      <div class="grid grid-cols-1 gap-3.5">
        @for (mission of activeLevelData().missions; track mission.id) {
          <div
            class="p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 shadow-lg"
            [ngClass]="progress.isMissionCompleted(mission.id) 
              ? 'border-emerald-500/40 bg-emerald-950/10' 
              : 'border-slate-800 hover:border-slate-700'"
          >
            <div class="space-y-1.5 max-w-xl">
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                  [ngClass]="getScenarioBadgeClass(mission.scenarioType)">
                  {{ mission.scenarioType }}
                </span>
                <span class="text-xs text-amber-400 font-mono font-semibold">+{{ mission.xpReward }} XP</span>
                @if (progress.isMissionCompleted(mission.id)) {
                  <span class="text-xs text-emerald-400 font-bold flex items-center gap-1 font-mono">
                    ✓ Completed
                  </span>
                }
              </div>

              <h3 class="text-base font-bold text-slate-100 leading-snug">
                {{ mission.title }}
              </h3>

              <p class="text-xs text-slate-400 font-sans leading-relaxed">
                {{ mission.objective }}
              </p>
            </div>

            <div class="flex-shrink-0">
              <button
                type="button"
                (click)="startMission.emit(mission)"
                class="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                [ngClass]="progress.isMissionCompleted(mission.id)
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  : 'bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-slate-950 shadow-sky-500/20'"
              >
                <span>{{ progress.isMissionCompleted(mission.id) ? 'Revisit Module' : 'Launch Simulation' }}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class DashboardComponent {
  public readonly startMission = output<Mission>();

  public readonly progress = inject(ProgressService);

  public readonly levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  public readonly selectedLevel = signal<CEFRLevel>('A1');

  public readonly activeLevelData = computed(() => {
    return CURRICULUM_DATA.find(l => l.level === this.selectedLevel()) || CURRICULUM_DATA[0];
  });

  public readonly levelCompletedCount = computed(() => {
    const ids = this.activeLevelData().missions.map(m => m.id);
    return ids.filter(id => this.progress.isMissionCompleted(id)).length;
  });

  public getLevelShortName(level: CEFRLevel): string {
    const map: Record<CEFRLevel, string> = {
      'A1': 'Survival',
      'A2': 'Routines',
      'B1': 'Autonomous',
      'B2': 'Pairing',
      'C1': 'Staff/Arch',
      'C2': 'Executive'
    };
    return map[level];
  }

  public getScenarioBadgeClass(scenario: string): string {
    switch (scenario) {
      case 'war_room':
        return 'bg-rose-950 text-rose-300 border border-rose-800';
      case 'exec_pitch':
        return 'bg-purple-950 text-purple-300 border border-purple-800';
      case 'pairing':
        return 'bg-amber-950 text-amber-300 border border-amber-800';
      case 'jira':
        return 'bg-blue-950 text-blue-300 border border-blue-800';
      case 'terminal':
        return 'bg-emerald-950 text-emerald-300 border border-emerald-800';
      default:
        return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  }
}
