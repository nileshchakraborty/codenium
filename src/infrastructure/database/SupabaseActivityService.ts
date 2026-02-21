
import { supabase } from '../db/SupabaseClient';

export interface ActivityEvent {
  /** Google OAuth sub — maps to users.google_id */
  google_id?: string;
  /** Legacy field — alias for google_id (backward compat) */
  user_id?: string;
  /** Frontend-generated UUID grouping a browser session */
  session_id?: string;
  /** e.g. 'problem_open', 'code_run', 'problem_solve' */
  event_type: string;
  /** LeetCode-style slug e.g. 'two-sum' */
  problem_slug?: string;
  /** How long the action took in ms */
  duration_ms?: number;
  /** Flexible extra data */
  metadata?: Record<string, any>;
  /** Hashed IP for PII compliance */
  ip_hash?: string;
  created_at?: string;
}

export class SupabaseActivityService {
  /**
   * Batch-insert activity events into user_activities.
   */
  async logBatch(events: ActivityEvent[]): Promise<{ success: boolean; count?: number; error?: any }> {
    if (!supabase) {
      console.warn('[SupabaseActivityService] Client not initialized. Skipping.');
      return { success: false, error: 'Client not initialized' };
    }

    if (events.length === 0) return { success: true, count: 0 };

    try {
      console.log(`[SupabaseActivityService] Syncing ${events.length} events…`);

      const { error } = await supabase
        .from('user_activities')
        .insert(events.map(e => ({
          google_id:    e.google_id ?? e.user_id ?? null,
          session_id:   e.session_id ?? null,
          event_type:   e.event_type,
          problem_slug: e.problem_slug ?? null,
          duration_ms:  e.duration_ms ?? null,
          metadata:     e.metadata ?? {},
          ip_hash:      e.ip_hash ?? null,
          created_at:   e.created_at ?? new Date().toISOString()
        })));

      if (error) {
        console.error('[SupabaseActivityService] Insert error:', error);
        return { success: false, error };
      }

      return { success: true, count: events.length };
    } catch (err) {
      console.error('[SupabaseActivityService] Unexpected error:', err);
      return { success: false, error: err };
    }
  }
}

export const supabaseActivityService = new SupabaseActivityService();
