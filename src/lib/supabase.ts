import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Resolve environment variables safely across build runners (Vite / Angular Application Builder / Process)
const supabaseUrl =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.['VITE_SUPABASE_URL']) ||
  (typeof process !== 'undefined' && process.env?.['VITE_SUPABASE_URL']) ||
  'https://placeholder-project.supabase.co';

const supabaseAnonKey =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.['VITE_SUPABASE_ANON_KEY']) ||
  (typeof process !== 'undefined' && process.env?.['VITE_SUPABASE_ANON_KEY']) ||
  'placeholder-anon-key';

export interface DatabaseUserProgress {
  id?: string;
  user_id?: string;
  xp: number;
  streak: number;
  current_level: string;
  completed_mission_ids: string[];
  saved_vocabulary: Array<{
    term: string;
    translation: string;
    context: string;
    saved_at: string;
  }>;
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
