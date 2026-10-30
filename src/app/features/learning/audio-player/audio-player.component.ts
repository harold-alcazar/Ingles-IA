import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpeechService } from '../../../core/services/speech.service';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="inline-flex items-center gap-2 p-1.5 bg-slate-900/80 border border-slate-800 rounded-xl shadow-inner">
      <!-- Play / Stop Button -->
      <button
        type="button"
        (click)="togglePlayback()"
        class="flex items-center justify-center w-8 h-8 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold shadow-md shadow-sky-500/20 active:scale-95 transition-all"
        [title]="speech.isSpeaking() ? 'Stop audio' : 'Play native English audio'"
      >
        @if (speech.isSpeaking()) {
          <span class="text-xs">⏹</span>
        } @else {
          <span class="text-xs pl-0.5">▶</span>
        }
      </button>

      <!-- Label / Audio wave indicator -->
      <div class="hidden sm:flex flex-col">
        <span class="text-[11px] font-medium text-slate-300">Natural Audio</span>
        <div class="flex items-center gap-0.5 h-2">
          @if (speech.isSpeaking()) {
            <span class="w-1 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span class="w-1 h-3 bg-emerald-400 rounded-full animate-bounce"></span>
            <span class="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></span>
          } @else {
            <span class="w-1 h-1 bg-slate-600 rounded-full"></span>
            <span class="w-1 h-1 bg-slate-600 rounded-full"></span>
            <span class="w-1 h-1 bg-slate-600 rounded-full"></span>
          }
        </div>
      </div>

      <!-- Speed Control (1.0x / 0.75x) -->
      <button
        type="button"
        (click)="changeSpeed()"
        class="px-2 py-1 text-[11px] font-mono font-semibold rounded-md border transition-all"
        [ngClass]="speech.playbackRate() === 1.0 
          ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500' 
          : 'bg-amber-950/60 border-amber-600/60 text-amber-300 font-bold'"
        title="Toggle audio speed (Normal 1.0x / Slow 0.75x for ear tuning)"
      >
        {{ speech.playbackRate() }}x
      </button>
    </div>
  `
})
export class AudioPlayerComponent {
  public readonly textToRead = input.required<string>();

  public readonly speech = inject(SpeechService);

  public togglePlayback(): void {
    if (this.speech.isSpeaking()) {
      this.speech.stop();
    } else {
      this.speech.speak(this.textToRead());
    }
  }

  public changeSpeed(): void {
    this.speech.toggleSpeed();
    if (this.speech.isSpeaking()) {
      // Re-trigger with new speed
      this.speech.speak(this.textToRead(), this.speech.playbackRate());
    }
  }
}
