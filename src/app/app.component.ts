import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { MissionViewComponent } from './features/learning/mission-view/mission-view.component';
import { VocabBankComponent } from './features/learning/vocab-bank/vocab-bank.component';
import { AuthModalComponent } from './features/auth/auth-modal/auth-modal.component';
import { Mission } from './core/models/course.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    DashboardComponent,
    MissionViewComponent,
    VocabBankComponent,
    AuthModalComponent
  ],
  template: `
    <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-slate-950">
      <!-- Global Top & Bottom Navbar -->
      <app-navbar
        [activeTab]="currentTab()"
        (tabChange)="handleTabChange($event)"
        (openAuthModal)="isAuthModalOpen.set(true)"
      />

      <!-- Main Application Container -->
      <main class="flex-1 w-full max-w-4xl mx-auto px-4 py-6 sm:py-8">
        @if (activeMission()) {
          <!-- Active Immersion Mission View -->
          <app-mission-view
            [mission]="activeMission()!"
            (backToDashboard)="activeMission.set(null)"
          />
        } @else if (currentTab() === 'vocab') {
          <!-- Saved Developer Vocabulary Bank -->
          <app-vocab-bank />
        } @else {
          <!-- Dashboard & Level Roadmap -->
          <app-dashboard
            (startMission)="handleStartMission($event)"
          />
        }
      </main>

      <!-- Supabase Auth / Cloud Sync Modal -->
      @if (isAuthModalOpen()) {
        <app-auth-modal (closeModal)="isAuthModalOpen.set(false)" />
      }
    </div>
  `
})
export class AppComponent {
  public readonly currentTab = signal<'dashboard' | 'vocab'>('dashboard');
  public readonly activeMission = signal<Mission | null>(null);
  public readonly isAuthModalOpen = signal<boolean>(false);

  public handleTabChange(tab: 'dashboard' | 'vocab'): void {
    this.activeMission.set(null);
    this.currentTab.set(tab);
  }

  public handleStartMission(mission: Mission): void {
    this.activeMission.set(mission);
  }
}
