import { Component, input, signal, inject, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InteractiveToken } from '../../../core/models/course.model';
import { SpeechService } from '../../../core/services/speech.service';
import { ProgressService } from '../../../core/services/progress.service';

@Component({
  selector: 'app-tap-to-translate',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="relative inline-block my-0.5">
      <!-- Clickable Interactive Word Pill (LingQ style) -->
      <button
        type="button"
        (click)="togglePopover($event)"
        [class.bg-sky-500/20]="isOpen()"
        [class.border-sky-400]="isOpen()"
        class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-sky-300 font-medium border-b-2 border-dashed border-sky-500/60 hover:bg-sky-500/15 hover:border-sky-400 transition-all cursor-pointer focus:outline-none"
        [title]="'Click for translation & software context'"
      >
        <span>{{ token().text }}</span>
        <span class="text-[10px] text-sky-400 font-mono">💡</span>
      </button>

      <!-- LingQ Style Contextual Popover Card -->
      @if (isOpen()) {
        <div
          class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 sm:w-80 p-3.5 bg-slate-900/95 backdrop-blur-md border border-sky-500/40 rounded-xl shadow-2xl z-50 text-left text-xs animate-in fade-in zoom-in-95 duration-150"
        >
          <!-- Header: Term and Audio action -->
          <div class="flex items-start justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
            <div>
              <span class="font-bold text-sm text-sky-200 block font-mono">{{ token().text }}</span>
              <span class="text-emerald-400 font-medium text-xs">{{ token().translation }}</span>
            </div>
            
            <button
              (click)="playAudio($event)"
              class="p-1.5 rounded-lg bg-sky-950/80 text-sky-400 hover:bg-sky-900 hover:text-sky-200 border border-sky-700/50 transition-colors"
              title="Pronounce term"
            >
              🔊
            </button>
          </div>

          <!-- Developer Context / Tech Application -->
          <div class="space-y-1.5">
            <div class="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
              <span>🛠️ Tech Context</span>
            </div>
            <p class="text-slate-300 text-xs leading-relaxed font-sans bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
              {{ token().techContext }}
            </p>
          </div>

          <!-- Footer Actions: Bookmark / Save to Deck -->
          <div class="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <button
              (click)="saveToVocabulary($event)"
              [disabled]="isSaved()"
              class="text-[11px] font-medium px-2.5 py-1 rounded-md transition-colors flex items-center gap-1"
              [ngClass]="isSaved() ? 'text-emerald-400 bg-emerald-950/50 border border-emerald-800/50' : 'text-sky-300 bg-sky-900/40 hover:bg-sky-800/60 border border-sky-700/50'"
            >
              <span>{{ isSaved() ? '✓ Saved' : '+ Save word' }}</span>
            </button>
            <span class="text-[10px] text-slate-500 font-mono">Input $i+1$</span>
          </div>

          <!-- Pointer triangle -->
          <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-r border-b border-sky-500/40 rotate-45"></div>
        </div>
      }
    </span>
  `
})
export class TapToTranslateComponent {
  public readonly token = input.required<InteractiveToken>();

  public readonly isOpen = signal<boolean>(false);
  public readonly isSaved = signal<boolean>(false);

  private readonly speech = inject(SpeechService);
  private readonly progress = inject(ProgressService);
  private readonly elementRef = inject(ElementRef);

  public togglePopover(event: MouseEvent): void {
    event.stopPropagation();
    this.isOpen.update(v => !v);
  }

  public playAudio(event: MouseEvent): void {
    event.stopPropagation();
    this.speech.speak(this.token().audioText || this.token().text);
  }

  public saveToVocabulary(event: MouseEvent): void {
    event.stopPropagation();
    this.progress.saveVocabulary(this.token().text, this.token().translation, this.token().techContext);
    this.isSaved.set(true);
  }

  @HostListener('document:click', ['$event'])
  public onOutsideClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  public onEscape(): void {
    this.isOpen.set(false);
  }
}
