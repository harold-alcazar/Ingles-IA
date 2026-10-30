import { Injectable, signal } from '@angular/core';
import { supabase } from '../../../lib/supabase';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public readonly currentUser = signal<User | null>(null);
  public readonly session = signal<Session | null>(null);
  public readonly isLoading = signal<boolean>(true);

  constructor() {
    this.initAuth();
  }

  private async initAuth(): Promise<void> {
    try {
      const { data } = await supabase.auth.getSession();
      this.session.set(data.session);
      this.currentUser.set(data.session?.user ?? null);

      supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
        this.session.set(session);
        this.currentUser.set(session?.user ?? null);
      });
    } catch (err) {
      console.warn('Supabase Auth init offline or key missing:', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  public async signInWithEmail(email: string, password: string): Promise<{ error: Error | null }> {
    this.isLoading.set(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } finally {
      this.isLoading.set(false);
    }
  }

  public async signUp(email: string, password: string): Promise<{ error: Error | null }> {
    this.isLoading.set(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined
        }
      });
      return { error };
    } finally {
      this.isLoading.set(false);
    }
  }

  public async signInWithMagicLink(email: string): Promise<{ error: Error | null }> {
    this.isLoading.set(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined
        }
      });
      return { error };
    } finally {
      this.isLoading.set(false);
    }
  }

  public async signOut(): Promise<void> {
    this.isLoading.set(true);
    try {
      await supabase.auth.signOut();
      this.currentUser.set(null);
      this.session.set(null);
    } finally {
      this.isLoading.set(false);
    }
  }
}
