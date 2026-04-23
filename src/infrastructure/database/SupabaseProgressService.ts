
import { supabase } from '../db/SupabaseClient';
import { UserProgress, SolvedProblem } from '../store/ProgressStore';

export interface ProblemProgressRow {
  google_id:       string;
  problem_slug:    string;
  status:          'attempted' | 'solved';
  solve_count:     number;
  attempt_count:   number;
  best_runtime_ms?: number | null;
  last_code?:      string | null;
  language?:       string | null;
  first_seen_at:   string;
  solved_at?:      string | null;
  last_activity:   string;
}

export class SupabaseProgressService {
  /**
   * Persist the full UserProgress snapshot as per-problem rows.
   * Uses upsert with (google_id, problem_slug) unique constraint.
   */
  async saveProgress(googleId: string, progress: UserProgress): Promise<{ success: boolean; error?: any }> {
    if (!supabase) {
      console.warn('[SupabaseProgressService] Client not initialized. Skipping.');
      return { success: false, error: 'Client not initialized' };
    }

    try {
      const now = new Date().toISOString();
      const rows: ProblemProgressRow[] = [];

      // Solved problems
      for (const sp of progress.solvedProblems ?? []) {
        rows.push({
          google_id:    googleId,
          problem_slug: sp.slug,
          status:       'solved',
          solve_count:  1,
          attempt_count: 1,
          last_code:    sp.code ?? null,
          best_runtime_ms: sp.bestRuntime ?? null,
          first_seen_at: new Date(sp.timestamp).toISOString(),
          solved_at:    new Date(sp.timestamp).toISOString(),
          last_activity: now,
        });
      }

      // Attempted but not solved
      for (const ap of progress.attemptedProblems ?? []) {
        if (progress.solvedProblems?.some(s => s.slug === ap.slug)) continue;
        rows.push({
          google_id:     googleId,
          problem_slug:  ap.slug,
          status:        'attempted',
          solve_count:   0,
          attempt_count: 1,
          first_seen_at: new Date(ap.openedAt).toISOString(),
          last_activity: now,
        });
      }

      // Drafts (ensure we record the problem as at least attempted)
      for (const [slug, draft] of Object.entries(progress.drafts ?? {})) {
        if (rows.some(r => r.problem_slug === slug)) continue;
        rows.push({
          google_id:     googleId,
          problem_slug:  slug,
          status:        'attempted',
          solve_count:   0,
          attempt_count: 0,
          last_code:     draft.code ?? null,
          first_seen_at: now,
          last_activity: new Date(draft.updatedAt).toISOString(),
        });
      }

      if (rows.length === 0) return { success: true };

      console.log(`[SupabaseProgressService] Syncing ${rows.length} problem rows for ${googleId}…`);

      const { error } = await supabase
        .from('user_progress')
        .upsert(rows, { onConflict: 'google_id,problem_slug' });

      if (error) {
        console.error('[SupabaseProgressService] Upsert error:', error);
        return { success: false, error };
      }

      // Also persist drafts into problem_drafts table
      await this.saveDrafts(googleId, progress.drafts ?? {});

      return { success: true };
    } catch (err) {
      console.error('[SupabaseProgressService] Unexpected error:', err);
      return { success: false, error: err };
    }
  }

  /**
   * Save code drafts into the dedicated problem_drafts table.
   */
  private async saveDrafts(
    googleId: string,
    drafts: Record<string, { code: string; updatedAt: number }>
  ): Promise<void> {
    if (!supabase) return;
    const rows = Object.entries(drafts).map(([slug, draft]) => ({
      google_id:    googleId,
      problem_slug: slug,
      language:     'javascript',   // TODO: store language alongside draft in frontend
      code:         draft.code,
      updated_at:   new Date(draft.updatedAt).toISOString()
    }));
    if (rows.length === 0) return;
    const { error } = await supabase
      .from('problem_drafts')
      .upsert(rows, { onConflict: 'google_id,problem_slug,language' });
    if (error) console.error('[SupabaseProgressService] Draft upsert error:', error);
  }

  /**
   * Reconstruct a UserProgress object from per-problem rows.
   */
  async getProgress(googleId: string): Promise<UserProgress | null> {
    if (!supabase) return null;

    try {
      const { data: progressRows, error: pe } = await supabase
        .from('user_progress')
        .select('*')
        .eq('google_id', googleId);

      const { data: draftRows } = await supabase
        .from('problem_drafts')
        .select('*')
        .eq('google_id', googleId);

      if (pe) { console.error('[SupabaseProgressService] Fetch error:', pe); return null; }

      const solvedProblems: SolvedProblem[] = (progressRows ?? [])
        .filter((r: any) => r.status === 'solved')
        .map((r: any) => ({
          slug:        r.problem_slug,
          timestamp:   new Date(r.solved_at ?? r.last_activity).getTime(),
          code:        r.last_code ?? '',
          attempts:    r.attempt_count,
          bestRuntime: r.best_runtime_ms ?? undefined
        }));

      const attemptedProblems = (progressRows ?? [])
        .filter((r: any) => r.status === 'attempted')
        .map((r: any) => ({ slug: r.problem_slug, openedAt: new Date(r.first_seen_at).getTime() }));

      const drafts: Record<string, { code: string; updatedAt: number }> = {};
      for (const d of draftRows ?? []) {
        drafts[d.problem_slug] = { code: d.code ?? '', updatedAt: new Date(d.updated_at).getTime() };
      }

      return {
        userId:           googleId,
        lastSyncedAt:     Date.now(),
        solvedProblems,
        attemptedProblems,
        drafts
      };
    } catch (err) {
      console.error('[SupabaseProgressService] Unexpected fetch error:', err);
      return null;
    }
  }
}

export const supabaseProgressService = new SupabaseProgressService();
