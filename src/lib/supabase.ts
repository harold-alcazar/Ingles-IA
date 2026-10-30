import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SavedVocabularyItem } from '../app/core/models/user.model';

// Resolve environment variables safely across build runners without polluting browser types
const getEnvVar = (key: string): string | undefined => {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.[key]) {
    return (import.meta as any).env[key];
  }
  const g = typeof globalThis !== 'undefined' ? (globalThis as any) : undefined;
  return g?.process?.env?.[key];
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL') || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || 'placeholder-anon-key';

export interface DatabaseUserProgress {
  id?: string;
  user_id?: string;
  xp: number;
  streak: number;
  current_level: string;
  completed_mission_ids: string[];
  saved_vocabulary: SavedVocabularyItem[];
  last_activity_date: string;
  updated_at?: string;
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
