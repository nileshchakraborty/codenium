
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
}

export const supabaseUserService = new SupabaseUserService();
