import { Component, input, output, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mission, InteractiveToken } from '../../../core/models/course.model';
import { TapToTranslateComponent } from '../tap-to-translate/tap-to-translate.component';
import { AudioPlayerComponent } from '../audio-player/audio-player.component';
import { ChallengeRunnerComponent } from '../challenge-runner/challenge-runner.component';
import { ProgressService } from '../../../core/services/progress.service';

@Component({
  selector: 'app-mission-view',
  standalone: true,
  imports: [
    CommonModule,
    TapToTranslateComponent,
    AudioPlayerComponent,
    ChallengeRunnerComponent
  ],
  template: `
    <div class="max-w-3xl mx-auto space-y-6 pb-24">
      <!-- Top Navigation & Scenario Header -->
      <div class="flex items-center justify-between">
        <button
          type="button"
          (click)="backToDashboard.emit()"
          class="flex items-center gap-1.5 text-xs text-slate-400 hover:text-sky-400 transition-colors font-medium cursor-pointer"
        >
          <span>←</span>
          <span>Back to Curriculum</span>
        </button>

        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-sky-950 text-sky-400 border border-sky-800">
            {{ mission().level }}
          </span>
          <span class="text-xs text-amber-400 font-mono font-semibold">
            🪙 +{{ mission().xpReward }} XP
          </span>
        </div>
      </div>

      <!-- Mission Title & Scenario Context Card -->
      <div class="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs uppercase font-mono tracking-wider font-semibold text-slate-400">
                Scenario: {{ formatScenario(mission().scenarioType) }}
              </span>
            </div>
            <h1 class="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
              {{ mission().title }}
            </h1>
          </div>
        </div>

        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
          💡 <strong class="text-sky-300">Context:</strong> {{ mission().contextBackground }}
        </p>

        <!-- Entire Dialogue Audio Reader -->
        <div class="flex items-center justify-between pt-2 border-t border-slate-800/80">
          <span class="text-xs text-slate-400 font-medium">Listen to entire immersion dialogue:</span>
          <app-audio-player [textToRead]="fullDialogueText()" />
        </div>
      </div>

      <!-- Step 1: Comprehensible Input Dialogue -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-semibold text-slate-300 uppercase tracking-wider font-mono">
            1. Immersion Feed (Tap highlighted words)
          </h2>
          <span class="text-[11px] text-sky-400 font-sans">Tap terms for $i+1$ translation</span>
        </div>

        <div class="space-y-3">
          @for (line of mission().dialogue; track line.id) {
            <div class="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 shadow-md transition-all hover:border-slate-700/80">
              <!-- Speaker Meta -->
              <div class="flex items-center justify-between mb-2 pb-2 border-b border-slate-800/60">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-lg bg-sky-950 border border-sky-800 flex items-center justify-center text-xs font-mono font-bold text-sky-300">
                    {{ line.speaker.charAt(0) }}
                  </div>
                  <div>
                    <span class="text-xs font-bold text-slate-200 block">{{ line.speaker }}</span>
                    <span class="text-[10px] text-slate-400">{{ line.role }}</span>
                  </div>
                </div>

                <!-- Per-line quick audio -->
                <app-audio-player [textToRead]="line.fullAudioText" />
              </div>

              <!-- Dialogue Content with Tap-to-Translate Tokens -->
              <div class="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
                @for (token of line.content; track $index) {
                  @if (isInteractiveToken(token)) {
                    <app-tap-to-translate [token]="asInteractiveToken(token)" />
                  } @else {
                    <span>{{ token }}</span>
                  }
                }
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Step 2: Challenge / Decision Section -->
      @if (mission().challenges.length > 0 && !isCompleted()) {
        <div class="space-y-3 pt-4">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-semibold text-slate-300 uppercase tracking-wider font-mono">
              2. Situational Challenges ({{ activeChallengeIndex() + 1 }} / {{ mission().challenges.length }})
            </h2>
          </div>

          <app-challenge-runner
            [challenge]="mission().challenges[activeChallengeIndex()]"
            (challengeCompleted)="handleChallengeCompleted($event)"
          />
        </div>
      }

      <!-- Step 3: Mission Completed Celebration Screen -->
      @if (isCompleted()) {
        <div class="p-6 bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/50 rounded-2xl shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div class="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 text-2xl mx-auto flex items-center justify-center">
            ✓
          </div>
          <div class="space-y-1">
            <h3 class="text-lg font-bold text-slate-100">Mission Accomplished!</h3>
            <p class="text-xs text-slate-300">You absorbed authentic software engineering communication in this module.</p>
          </div>

          <div class="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-950/80 border border-emerald-500/30 text-emerald-400 font-mono text-sm font-bold">
            <span>+{{ earnedXPTotal() }} XP Awarded</span>
            <span>•</span>
            <span>Streak Maintained 🔥</span>
          </div>

          <div class="pt-2">
            <button
              type="button"
              (click)="backToDashboard.emit()"
              class="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
            >
              Continue Learning Journey →
            </button>
          </div>
        </div>
      }
    </div>
  `
})
export class MissionViewComponent {
  public readonly mission = input.required<Mission>();
  public readonly backToDashboard = output<void>();

  private readonly progress = inject(ProgressService);

  public readonly activeChallengeIndex = signal<number>(0);
  public readonly isCompleted = signal<boolean>(false);
  public readonly earnedXPTotal = signal<number>(0);

  public readonly fullDialogueText = computed(() => {
    return this.mission().dialogue.map(d => `${d.speaker} says: ${d.fullAudioText}`).join('. ');
  });

  public isInteractiveToken(item: string | InteractiveToken): boolean {
    return typeof item === 'object' && item !== null && 'translation' in item;
  }

  public asInteractiveToken(item: string | InteractiveToken): InteractiveToken {
    return item as InteractiveToken;
  }

  public formatScenario(type: string): string {
    return type.replace('_', ' ').toUpperCase();
  }

  public handleChallengeCompleted(result: { isSuccess: boolean; xpEarned: number }): void {
    this.earnedXPTotal.update(x => x + result.xpEarned);

    const nextIndex = this.activeChallengeIndex() + 1;
    if (nextIndex < this.mission().challenges.length) {
      this.activeChallengeIndex.set(nextIndex);
    } else {
      // Mark whole mission completed
      this.isCompleted.set(true);
      this.progress.completeMission(this.mission().id, this.mission().xpReward);
    }
  }
}
