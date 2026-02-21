/**
 * SupabaseStatsService — Query live problem views and solves from the DB.
 *
 * Views  → user_activities rows with event_type = 'problem_opened' (last 30 days)
 * Solves → user_progress rows with status = 'solved'
 */
import { supabase } from '../db/SupabaseClient';

export interface LiveProblemStats {
    slug: string;
    views: number;
    solves: number;
    /** ISO timestamp of most recent view */
    lastViewed: string | null;
    /** ISO timestamp of most recent solve */
    lastSolved: string | null;
}

export interface LiveCategoryStats {
    category: string;
    totalViews: number;
    totalSolves: number;
    problemCount: number;
}

class SupabaseStatsServiceImpl {
    private readonly WINDOW_DAYS = 30;

    /** Pull view counts grouped by problem_slug from user_activities. */
    async getProblemViews(): Promise<Record<string, { count: number; last: string | null }>> {
        if (!supabase) return {};

        const since = new Date();
        since.setDate(since.getDate() - this.WINDOW_DAYS);

        const { data, error } = await supabase
            .from('user_activities')
            .select('problem_slug, created_at')
            .eq('event_type', 'problem_opened')
            .not('problem_slug', 'is', null)
            .gte('created_at', since.toISOString());

        if (error || !data) {
            console.error('[SupabaseStatsService] Views query error:', error);
            return {};
        }

        const result: Record<string, { count: number; last: string | null }> = {};
        for (const row of data) {
            if (!row.problem_slug) continue;
            const slug = row.problem_slug;
            if (!result[slug]) result[slug] = { count: 0, last: null };
            result[slug].count++;
            if (!result[slug].last || row.created_at > result[slug].last!) {
                result[slug].last = row.created_at;
            }
        }
        return result;
    }

    /** Pull solve counts grouped by problem_slug from user_progress. */
    async getProblemSolves(): Promise<Record<string, { count: number; last: string | null }>> {
        if (!supabase) return {};

        const { data, error } = await supabase
            .from('user_progress')
            .select('problem_slug, solve_count, solved_at')
            .eq('status', 'solved')
            .gt('solve_count', 0);

        if (error || !data) {
            console.error('[SupabaseStatsService] Solves query error:', error);
            return {};
        }

        const result: Record<string, { count: number; last: string | null }> = {};
        for (const row of data) {
            if (!row.problem_slug) continue;
            const slug = row.problem_slug;
            if (!result[slug]) result[slug] = { count: 0, last: null };
            result[slug].count += (row.solve_count ?? 1);
            if (row.solved_at && (!result[slug].last || row.solved_at > result[slug].last!)) {
                result[slug].last = row.solved_at;
            }
        }
        return result;
    }

    /**
     * Return merged live stats for all problems seen in either table.
     * Falls back gracefully if DB unavailable.
     */
    async getLiveStats(): Promise<LiveProblemStats[]> {
        const [views, solves] = await Promise.all([
            this.getProblemViews(),
            this.getProblemSolves(),
        ]);

        const slugs = new Set([...Object.keys(views), ...Object.keys(solves)]);
        const result: LiveProblemStats[] = [];

        for (const slug of slugs) {
            result.push({
                slug,
                views:      views[slug]?.count  ?? 0,
                solves:     solves[slug]?.count  ?? 0,
                lastViewed: views[slug]?.last    ?? null,
                lastSolved: solves[slug]?.last   ?? null,
            });
        }

        return result;
    }
}

export const supabaseStatsService = new SupabaseStatsServiceImpl();
