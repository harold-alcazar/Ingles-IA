import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Challenge, DecisionBranch } from '../../../core/models/course.model';

@Component({
  selector: 'app-challenge-runner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <!-- Challenge Header -->
      <div class="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase"
            [ngClass]="{
              'bg-purple-950 text-purple-300 border border-purple-800': challenge().type === 'decision_tree',
              'bg-blue-950 text-blue-300 border border-blue-800': challenge().type === 'multiple_choice',
              'bg-emerald-950 text-emerald-300 border border-emerald-800': challenge().type === 'fill_blank'
            }">
            {{ challenge().type.replace('_', ' ') }}
          </span>
          <span class="text-xs text-slate-400">Knowledge Check</span>
        </div>
        <span class="text-amber-400 font-mono font-bold text-xs flex items-center gap-1">
          <span>+{{ challenge().xpReward }} XP</span>
        </span>
      </div>

      <!-- Instruction / Question Prompt -->
      <p class="text-slate-100 font-medium text-sm sm:text-base leading-relaxed">
        {{ challenge().instruction }}
      </p>

      <!-- Optional Code / Context Snippet -->
      @if (challenge().contextSnippet) {
        <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
          {{ challenge().contextSnippet }}
        </div>
      }

      <!-- MODE 1: MULTIPLE CHOICE -->
      @if (challenge().type === 'multiple_choice' && challenge().options) {
        <div class="space-y-2 pt-1">
          @for (option of challenge().options; track option.id) {
            <button
              type="button"
              (click)="selectMultipleChoice(option.id, option.isCorrect)"
              [disabled]="isAnswered()"
              class="w-full text-left p-3.5 rounded-xl border transition-all text-xs sm:text-sm flex items-start gap-3"
              [ngClass]="getOptionClasses(option.id, option.isCorrect)"
            >
              <span class="w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center text-[10px] font-bold font-mono mt-0.5"
                [ngClass]="selectedOptionId() === option.id ? 'border-sky-400 bg-sky-500 text-slate-950' : 'border-slate-700 text-slate-400'">
                {{ $index + 1 }}
              </span>
              <div class="space-y-1">
                <span class="font-sans block text-slate-200">{{ option.text }}</span>
                @if (isAnswered() && (selectedOptionId() === option.id || option.isCorrect)) {
                  <p class="text-xs text-slate-400 font-normal mt-1 border-t border-slate-800/80 pt-1">
                    {{ option.explanation }}
                  </p>
                }
              </div>
            </button>
          }
        </div>
      }

      <!-- MODE 2: FILL IN THE BLANK (CLOZE) -->
      @if (challenge().type === 'fill_blank') {
        <div class="space-y-3 pt-1">
          <div class="flex items-center gap-2">
            <input
              type="text"
              [(ngModel)]="userBlankInput"
              [disabled]="isAnswered()"
              placeholder="Type your answer here..."
              (keyup.enter)="submitBlankAnswer()"
              class="flex-1 bg-slate-950 border border-slate-700 focus:border-sky-500 rounded-xl px-4 py-2.5 text-slate-100 font-mono text-sm focus:outline-none transition-colors"
            />
            @if (!isAnswered()) {
              <button
                type="button"
                (click)="submitBlankAnswer()"
                [disabled]="!userBlankInput.trim()"
                class="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                Check
              </button>
            }
          </div>

          @if (isAnswered()) {
            <div class="p-3 rounded-xl border text-xs"
              [ngClass]="isCorrect() ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300' : 'bg-rose-950/40 border-rose-700/50 text-rose-300'">
              @if (isCorrect()) {
                <p class="font-bold">✓ Spot on! Valid technical usage in professional communication.</p>
              } @else {
                <p class="font-bold">✕ Not quite. Accepted terms: {{ challenge().acceptedAnswers?.join(', ') }}</p>
              }
            </div>
          }
        </div>
      }

      <!-- MODE 3: DECISION TREE -->
      @if (challenge().type === 'decision_tree' && challenge().decisionBranches) {
        <div class="space-y-2.5 pt-1">
          @for (branch of challenge().decisionBranches; track branch.id) {
            <button
              type="button"
              (click)="selectDecisionBranch(branch)"
              [disabled]="isAnswered()"
              class="w-full text-left p-3.5 rounded-xl border transition-all text-xs sm:text-sm space-y-2"
              [ngClass]="getBranchClasses(branch.id, branch.isOptimal)"
            >
              <div class="flex items-center justify-between">
                <span class="font-semibold text-slate-200">{{ branch.decisionText }}</span>
                @if (selectedBranchId() === branch.id) {
                  <span class="text-xs px-2 py-0.5 rounded font-mono font-bold"
                    [ngClass]="branch.isOptimal ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'">
                    {{ branch.isOptimal ? 'Optimal Choice' : 'Suboptimal' }}
                  </span>
                }
              </div>

              @if (selectedBranchId() === branch.id) {
                <div class="text-xs space-y-1 pt-2 border-t border-slate-800/80">
                  <p class="text-slate-300"><strong class="text-slate-400">Impact:</strong> {{ branch.consequence }}</p>
                  <p class="text-sky-300 font-sans italic">{{ branch.feedback }}</p>
                </div>
              }
            </button>
          }
        </div>
      }

      <!-- Bottom Next / Continue Button -->
      @if (isAnswered()) {
        <div class="pt-2 flex justify-end">
          <button
            type="button"
            (click)="onContinue()"
            class="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span>Proceed</span>
            <span>→</span>
          </button>
        </div>
      }
    </div>
  `
})
export class ChallengeRunnerComponent {
  public readonly challenge = input.required<Challenge>();
  public readonly challengeCompleted = output<{ isSuccess: boolean; xpEarned: number }>();

  public readonly isAnswered = signal<boolean>(false);
  public readonly isCorrect = signal<boolean>(false);
  public readonly selectedOptionId = signal<string | null>(null);
  public readonly selectedBranchId = signal<string | null>(null);

  public userBlankInput = '';

  public selectMultipleChoice(optionId: string, isCorrect: boolean): void {
    if (this.isAnswered()) return;
    this.selectedOptionId.set(optionId);
    this.isAnswered.set(true);
    this.isCorrect.set(isCorrect);
  }

  public submitBlankAnswer(): void {
    if (this.isAnswered() || !this.userBlankInput.trim()) return;

    const trimmed = this.userBlankInput.trim().toLowerCase();
    const accepted = (this.challenge().acceptedAnswers || []).map(a => a.toLowerCase());
    const valid = accepted.includes(trimmed);

    this.isAnswered.set(true);
    this.isCorrect.set(valid);
  }

  public selectDecisionBranch(branch: DecisionBranch): void {
    if (this.isAnswered()) return;
    this.selectedBranchId.set(branch.id);
    this.isAnswered.set(true);
    this.isCorrect.set(branch.isOptimal);
  }

  public onContinue(): void {
    const xp = this.isCorrect() ? this.challenge().xpReward : Math.floor(this.challenge().xpReward * 0.4);
    this.challengeCompleted.emit({
      isSuccess: this.isCorrect(),
      xpEarned: xp
    });
  }

  public getOptionClasses(optionId: string, isCorrectOption: boolean): string {
    if (!this.isAnswered()) {
      return 'border-slate-800 bg-slate-950/50 hover:bg-slate-800/60 hover:border-slate-700 cursor-pointer';
    }

    if (this.selectedOptionId() === optionId) {
      return isCorrectOption
        ? 'border-emerald-500/80 bg-emerald-950/40 text-emerald-200'
        : 'border-rose-500/80 bg-rose-950/40 text-rose-200';
    }

    if (isCorrectOption) {
      return 'border-emerald-600/50 bg-emerald-950/20 text-slate-300';
    }

    return 'border-slate-800/60 bg-slate-950/30 text-slate-500 opacity-60';
  }

  public getBranchClasses(branchId: string, isOptimal: boolean): string {
    if (!this.isAnswered()) {
      return 'border-slate-800 bg-slate-950/50 hover:bg-slate-800/60 hover:border-purple-800/60 cursor-pointer';
    }

    if (this.selectedBranchId() === branchId) {
      return isOptimal
        ? 'border-emerald-500/80 bg-emerald-950/40'
        : 'border-amber-500/80 bg-amber-950/40';
    }

    return 'border-slate-800/60 bg-slate-950/30 opacity-60';
  }
}
