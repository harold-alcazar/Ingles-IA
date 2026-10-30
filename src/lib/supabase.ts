import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';
import { SavedVocabularyItem } from '../app/core/models/user.model';

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

export const supabase: SupabaseClient = createClient(
  environment.supabaseUrl,
  environment.supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
