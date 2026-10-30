import { Component, output, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressService } from '../../../core/services/progress.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Top Global Header -->
    <header class="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <!-- Brand / Identity -->
        <div class="flex items-center gap-2 cursor-pointer" (click)="tabChange.emit('dashboard')">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-slate-950 font-mono font-bold text-base shadow-md shadow-sky-500/20">
            &gt;_
          </div>
          <div>
            <span class="font-extrabold text-sm sm:text-base text-slate-100 tracking-tight font-mono block">DevLingo</span>
            <span class="text-[9px] text-sky-400 font-semibold tracking-wider uppercase block">Comprehensible Input</span>
          </div>
        </div>

        <!-- Right Indicators: XP, Streak, Cloud Sync -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Daily Streak -->
          <div class="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-amber-400" title="Consecutive day streak">
            <span>🔥</span>
            <span>{{ progress.streak() }}d</span>
          </div>

          <!-- Total XP -->
          <div class="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-sky-400" title="Accumulated Developer XP">
            <span>⚡</span>
            <span>{{ progress.xp() }} XP</span>
          </div>

          <!-- Cloud Sync Button -->
          <button
            type="button"
            (click)="openAuthModal.emit()"
            class="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer border"
            [ngClass]="auth.currentUser()
              ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/60'
              : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-sky-500'"
            title="Supabase sync status"
          >
            @if (auth.currentUser()) {
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span class="hidden sm:inline text-[11px] font-mono">Cloud Synced</span>
            } @else {
              <span class="text-xs">☁️</span>
              <span class="hidden sm:inline text-[11px]">Sync Cloud</span>
            }
          </button>
        </div>
      </div>
    </header>

    <!-- Bottom Navigation Bar (Optimized for Mobile PWA & Desktop) -->
    <nav class="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-4 py-2">
      <div class="max-w-md mx-auto flex items-center justify-around">
        <button
          type="button"
          (click)="tabChange.emit('dashboard')"
          class="flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all"
          [ngClass]="activeTab() === 'dashboard' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-slate-200'"
        >
          <span class="text-lg">🗺️</span>
          <span class="text-[10px] font-mono tracking-wider">Curriculum</span>
        </button>

        <button
          type="button"
          (click)="tabChange.emit('vocab')"
          class="flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all"
          [ngClass]="activeTab() === 'vocab' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-slate-200'"
        >
          <span class="text-lg">📖</span>
          <span class="text-[10px] font-mono tracking-wider">Lexicon ({{ progress.savedVocabulary().length }})</span>
        </button>

        <button
          type="button"
          (click)="openAuthModal.emit()"
          class="flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all text-slate-400 hover:text-slate-200"
        >
          <span class="text-lg">⚙️</span>
          <span class="text-[10px] font-mono tracking-wider">Sync & Settings</span>
        </button>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  public readonly activeTab = input.required<'dashboard' | 'vocab'>();
  public readonly tabChange = output<'dashboard' | 'vocab'>();
  public readonly openAuthModal = output<void>();

  public readonly progress = inject(ProgressService);
  public readonly auth = inject(AuthService);
}
