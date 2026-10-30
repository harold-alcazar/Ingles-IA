import { Component, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ProgressService } from '../../../core/services/progress.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div class="relative w-full max-w-md p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl space-y-5 text-left">
        <!-- Close Button -->
        <button
          type="button"
          (click)="closeModal.emit()"
          class="absolute top-4 right-4 text-slate-400 hover:text-slate-100 text-lg p-1"
        >
          ✕
        </button>

        <!-- Header -->
        <div class="space-y-1">
          <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-sky-950 text-sky-400 border border-sky-800">
            <span>⚡ Offline-First Cloud Sync</span>
          </div>
          <h2 class="text-xl font-bold text-slate-100">Sync Progress via Supabase</h2>
          <p class="text-xs text-slate-400 leading-relaxed">
            Your progress is currently saved in local storage (XP: {{ progress.xp() }}, Missions: {{ progress.completedMissions().length }}). Sign in to synchronize your streak across devices.
          </p>
        </div>

        @if (auth.currentUser()) {
          <!-- Authenticated State -->
          <div class="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3">
            <div class="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Connected to Cloud: {{ auth.currentUser()?.email }}</span>
            </div>
            <p class="text-xs text-slate-300">
              Automatic background syncing is active via Supabase Realtime & Upsert.
            </p>
            <button
              type="button"
              (click)="handleSignOut()"
              class="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
            >
              Sign Out
            </button>
          </div>
        } @else {
          <!-- Auth Form Tabs -->
          <div class="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-semibold">
            <button
              type="button"
              (click)="authMode.set('magic')"
              class="flex-1 py-1.5 rounded-lg transition-all"
              [ngClass]="authMode() === 'magic' ? 'bg-sky-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-slate-200'"
            >
              Magic Link
            </button>
            <button
              type="button"
              (click)="authMode.set('password')"
              class="flex-1 py-1.5 rounded-lg transition-all"
              [ngClass]="authMode() === 'password' ? 'bg-sky-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-slate-200'"
            >
              Email & Password
            </button>
          </div>

          <!-- Mode: Magic Link -->
          @if (authMode() === 'magic') {
            <form (submit)="handleMagicLink($event)" class="space-y-3">
              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Developer Email</label>
                <input
                  type="email"
                  [(ngModel)]="email"
                  name="email"
                  required
                  placeholder="name@company.com"
                  class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-sky-500 rounded-xl text-slate-100 text-xs focus:outline-none font-mono"
                />
              </div>

              <button
                type="submit"
                [disabled]="auth.isLoading() || !email.trim()"
                class="w-full py-2.5 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-sky-500/20"
              >
                {{ auth.isLoading() ? 'Sending link...' : 'Send Magic Link' }}
              </button>
            </form>
          }

          <!-- Mode: Password -->
          @if (authMode() === 'password') {
            <form (submit)="handlePasswordAuth($event)" class="space-y-3">
              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  [(ngModel)]="email"
                  name="email"
                  required
                  placeholder="dev@example.com"
                  class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-sky-500 rounded-xl text-slate-100 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  [(ngModel)]="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-sky-500 rounded-xl text-slate-100 text-xs focus:outline-none"
                />
              </div>

              <div class="flex gap-2 pt-1">
                <button
                  type="button"
                  (click)="handleSignUp()"
                  [disabled]="auth.isLoading() || !email || !password"
                  class="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-all"
                >
                  Create Account
                </button>
                <button
                  type="submit"
                  [disabled]="auth.isLoading() || !email || !password"
                  class="flex-1 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs transition-all"
                >
                  Sign In
                </button>
              </div>
            </form>
          }

          @if (feedbackMessage()) {
            <div class="p-3 rounded-xl border text-xs"
              [ngClass]="isError() ? 'bg-rose-950/50 border-rose-800 text-rose-300' : 'bg-emerald-950/50 border-emerald-800 text-emerald-300'">
              {{ feedbackMessage() }}
            </div>
          }
        }
      </div>
    </div>
  `
})
export class AuthModalComponent {
  public readonly closeModal = output<void>();

  public readonly auth = inject(AuthService);
  public readonly progress = inject(ProgressService);

  public readonly authMode = signal<'magic' | 'password'>('magic');
  public readonly feedbackMessage = signal<string | null>(null);
  public readonly isError = signal<boolean>(false);

  public email = '';
  public password = '';

  public async handleMagicLink(e: Event): Promise<void> {
    e.preventDefault();
    this.feedbackMessage.set(null);
    const { error } = await this.auth.signInWithMagicLink(this.email);
    if (error) {
      this.isError.set(true);
      this.feedbackMessage.set(error.message);
    } else {
      this.isError.set(false);
      this.feedbackMessage.set('Magic link sent! Check your inbox to confirm login.');
    }
  }

  public async handlePasswordAuth(e: Event): Promise<void> {
    e.preventDefault();
    this.feedbackMessage.set(null);
    const { error } = await this.auth.signInWithEmail(this.email, this.password);
    if (error) {
      this.isError.set(true);
      this.feedbackMessage.set(error.message);
    } else {
      this.closeModal.emit();
    }
  }

  public async handleSignUp(): Promise<void> {
    this.feedbackMessage.set(null);
    const { error } = await this.auth.signUp(this.email, this.password);
    if (error) {
      this.isError.set(true);
      this.feedbackMessage.set(error.message);
    } else {
      this.isError.set(false);
      this.feedbackMessage.set('Account created! Please check your email for confirmation.');
    }
  }

  public async handleSignOut(): Promise<void> {
    await this.auth.signOut();
    this.closeModal.emit();
  }
}
