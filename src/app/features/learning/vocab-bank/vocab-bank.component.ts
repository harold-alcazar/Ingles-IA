import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressService } from '../../../core/services/progress.service';
import { SpeechService } from '../../../core/services/speech.service';

@Component({
  selector: 'app-vocab-bank',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-3xl mx-auto space-y-5 pb-24">
      <div class="space-y-1">
        <h2 class="text-xl sm:text-2xl font-bold text-slate-100">Personal Tech Lexicon</h2>
        <p class="text-xs text-slate-400">
          Terms captured via Tap-to-Translate during authentic engineering dialogues.
        </p>
      </div>

      @if (progress.savedVocabulary().length === 0) {
        <div class="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div class="text-3xl">📚</div>
          <p class="text-slate-300 text-sm font-medium">No saved terms yet.</p>
          <p class="text-slate-500 text-xs">
            While going through missions, tap any highlighted phrase and click <strong>"+ Save word"</strong> to build your engineering vocabulary deck.
          </p>
        </div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          @for (item of progress.savedVocabulary(); track item.term) {
            <div class="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 hover:border-slate-700 transition-all shadow-md">
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="text-sm font-bold text-sky-300 font-mono">{{ item.term }}</h3>
                  <span class="text-xs text-emerald-400 font-medium">{{ item.translation }}</span>
                </div>
                <button
                  type="button"
                  (click)="speech.speak(item.term)"
                  class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 transition-colors"
                  title="Pronounce"
                >
                  🔊
                </button>
              </div>

              <div class="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 text-[11px] text-slate-300 font-sans">
                <span class="font-semibold text-slate-400 block mb-0.5 uppercase tracking-wider text-[9px]">Dev Usage</span>
                {{ item.techContext }}
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class VocabBankComponent {
  public readonly progress = inject(ProgressService);
  public readonly speech = inject(SpeechService);
}
