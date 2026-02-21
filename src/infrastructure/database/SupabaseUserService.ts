
import { supabase } from '../db/SupabaseClient';

export interface UserInfo {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
  [key: string]: any;
}

export class SupabaseUserService {
  private syncedUsers = new Set<string>();

  /**
   * Sync user metadata from Google OAuth to Supabase
   */
  async syncUser(userInfo: UserInfo, geo?: { city?: string; country?: string }): Promise<{ success: boolean; error?: any }> {
    if (!supabase) return { success: false, error: 'Client not initialized' };
    if (!userInfo?.sub) return { success: false, error: 'Missing user ID' };

    // Basic optimization: don't sync multiple times in the same process lifetime
    if (this.syncedUsers.has(userInfo.sub)) {
      return { success: true };
    }

    try {
      console.log(`[SupabaseUserService] Syncing metadata for user ${userInfo.sub} (${userInfo.email || 'no email'})`);
      
      const { error } = await supabase
        .from('users')
        .upsert({
          google_id: userInfo.sub,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          geo_city: geo?.city,
          geo_country: geo?.country,
          last_login: new Date().toISOString()
        }, { onConflict: 'google_id' });

      if (error) {
        console.error('[SupabaseUserService] Error upserting user:', error);
        return { success: false, error };
      }

      this.syncedUsers.add(userInfo.sub);
      return { success: true };
    } catch (error) {
      console.error('[SupabaseUserService] Unexpected error during user sync:', error);
      return { success: false, error };
    }
  }

  /**
   * Sync consent data for a user to Supabase
   */
  async syncConsentData(
    googleId: string,
    consentVersion: string,
    consentAt: string | null
  ): Promise<{ success: boolean; error?: any }> {
    if (!supabase) return { success: false, error: 'Client not initialized' };
    if (!googleId) return { success: false, error: 'Missing user ID' };

    try {
      console.log(`[SupabaseUserService] Syncing consent for user ${googleId} (v${consentVersion})`);

      const { error } = await supabase
        .from('users')
        .update({
          consent_version: consentVersion,
          consent_at: consentAt
        })
        .eq('google_id', googleId);

      if (error) {
        console.error('[SupabaseUserService] Error updating consent:', error);
        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      console.error('[SupabaseUserService] Unexpected error during consent sync:', error);
      return { success: false, error };
    }
  }
}

export const supabaseUserService = new SupabaseUserService();
