
import { supabase } from '../db/SupabaseClient';
import { UserProgress } from '../store/ProgressStore';

export class SupabaseProgressService {
  /**
   * Upsert user progress into Supabase
   */
  async saveProgress(userId: string, progress: UserProgress): Promise<{ success: boolean; error?: any }> {
    if (!supabase) {
      console.warn('[SupabaseProgressService] Supabase client not initialized. Skipping progress save.');
      return { success: false, error: 'Client not initialized' };
    }

    try {
      console.log(`[SupabaseProgressService] Syncing progress for user ${userId} to Supabase...`);
      
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          data: progress,
          last_synced_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) {
        console.error('[SupabaseProgressService] Error upserting progress:', error);
        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      console.error('[SupabaseProgressService] Unexpected error during progress sync:', error);
      return { success: false, error };
    }
  }

  /**
   * Get user progress from Supabase
   */
  async getProgress(userId: string): Promise<UserProgress | null> {
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('data')
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        return null;
      }

      return data.data as UserProgress;
    } catch (error) {
      console.error('[SupabaseProgressService] Error fetching progress:', error);
      return null;
    }
  }
}

export const supabaseProgressService = new SupabaseProgressService();
