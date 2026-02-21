
import { supabase } from '../db/SupabaseClient';

export interface UserInfo {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
  [key: string]: any;
}

export interface GeoData {
  ip_hash: string;
  city?: string;
  country?: string;
}

export class SupabaseUserService {
  private syncedUsers = new Set<string>();

  /**
   * Upsert user profile (no geo — that goes to user_locations).
   * Only syncs once per process lifetime per user.
   */
  async syncUser(userInfo: UserInfo): Promise<{ success: boolean; error?: any }> {
    if (!supabase) return { success: false, error: 'Client not initialized' };
    if (!userInfo?.sub) return { success: false, error: 'Missing user ID' };

    if (this.syncedUsers.has(userInfo.sub)) return { success: true };

    try {
      console.log(`[SupabaseUserService] Syncing user ${userInfo.sub}`);

      const { error } = await supabase
        .from('users')
        .upsert({
          google_id:  userInfo.sub,
          email:      userInfo.email,
          name:       userInfo.name,
          picture:    userInfo.picture,
          last_login: new Date().toISOString()
        }, { onConflict: 'google_id' });

      if (error) {
        console.error('[SupabaseUserService] Upsert error:', error);
        return { success: false, error };
      }

      this.syncedUsers.add(userInfo.sub);
      return { success: true };
    } catch (err) {
      console.error('[SupabaseUserService] Unexpected error:', err);
      return { success: false, error: err };
    }
  }

  /**
   * Log a geo location event for a user (one row per login).
   */
  async logLocation(googleId: string, geo: GeoData): Promise<void> {
    if (!supabase || !googleId) return;

    try {
      const { error } = await supabase
        .from('user_locations')
        .insert({
          google_id:   googleId,
          ip_hash:     geo.ip_hash,
          geo_city:    geo.city,
          geo_country: geo.country,
          recorded_at: new Date().toISOString()
        });

      if (error) {
        console.error('[SupabaseUserService] Location log error:', error);
      }
    } catch (err) {
      console.error('[SupabaseUserService] Unexpected location error:', err);
    }
  }

  /**
   * Persist consent version and timestamp for a user.
   */
  async syncConsentData(
    googleId: string,
    consentVersion: string,
    consentAt: string | null
  ): Promise<{ success: boolean; error?: any }> {
    if (!supabase) return { success: false, error: 'Client not initialized' };
    if (!googleId)  return { success: false, error: 'Missing user ID' };

    try {
      console.log(`[SupabaseUserService] Syncing consent for ${googleId} (v${consentVersion})`);

      const { error } = await supabase
        .from('users')
        .update({ consent_version: consentVersion, consent_at: consentAt })
        .eq('google_id', googleId);

      if (error) {
        console.error('[SupabaseUserService] Consent sync error:', error);
        return { success: false, error };
      }

      return { success: true };
    } catch (err) {
      console.error('[SupabaseUserService] Unexpected consent error:', err);
      return { success: false, error: err };
    }
  }
  /**
   * Open a session row in user_sessions on login / app load.
   */
  async logSession(googleId: string, opts: {
    session_id: string;
    device?: string | null;
    ip_hash?: string;
    geo_city?: string;
    geo_country?: string;
  }): Promise<void> {
    if (!supabase || !googleId) return;
    try {
      await supabase.from('user_sessions').upsert({
        google_id:   googleId,
        session_id:  opts.session_id,
        started_at:  new Date().toISOString(),
        device:      opts.device ?? null,
        ip_hash:     opts.ip_hash,
        geo_city:    opts.geo_city,
        geo_country: opts.geo_country
      }, { onConflict: 'session_id' });
    } catch (err) {
      console.error('[SupabaseUserService] Session log error:', err);
    }
  }

  /**
   * Mark a session as ended with its duration.
   */
  async closeSession(session_id: string, duration_s?: number): Promise<void> {
    if (!supabase || !session_id) return;
    try {
      await supabase.from('user_sessions')
        .update({ ended_at: new Date().toISOString(), duration_s: duration_s ?? null })
        .eq('session_id', session_id);
    } catch (err) {
      console.error('[SupabaseUserService] Session close error:', err);
    }
  }
}

export const supabaseUserService = new SupabaseUserService();
