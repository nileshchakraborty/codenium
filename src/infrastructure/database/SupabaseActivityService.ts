
import { supabase } from '../db/SupabaseClient';

export interface ActivityEvent {
  user_id: string;
  event_type: string;
  metadata?: Record<string, any>;
  created_at?: string;
}

export class SupabaseActivityService {
  /**
   * Batch insert activity events into Supabase
   */
  async logBatch(events: ActivityEvent[]): Promise<{ success: boolean; count?: number; error?: any }> {
    if (!supabase) {
      console.warn('[SupabaseActivityService] Supabase client not initialized. Skipping batch log.');
      return { success: false, error: 'Client not initialized' };
    }

    if (events.length === 0) {
      return { success: true, count: 0 };
    }

    try {
      console.log(`[SupabaseActivityService] Syncing ${events.length} events to Supabase...`);
      
      const { data, error } = await supabase
        .from('user_activities')
        .insert(events.map(event => ({
          user_id: event.user_id,
          event_type: event.event_type,
          metadata: event.metadata || {},
          created_at: event.created_at || new Date().toISOString()
        })));

      if (error) {
        console.error('[SupabaseActivityService] Error inserting events:', error);
        return { success: false, error };
      }

      return { success: true, count: events.length };
    } catch (error) {
      console.error('[SupabaseActivityService] Unexpected error during sync:', error);
      return { success: false, error };
    }
  }
}

export const supabaseActivityService = new SupabaseActivityService();
