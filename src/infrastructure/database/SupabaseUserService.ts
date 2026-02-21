
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
}

export const supabaseUserService = new SupabaseUserService();
