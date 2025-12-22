/**
 * TTLStorage - Client-side storage with Time-To-Live support
 * 
 * Provides localStorage wrapper with automatic expiration
 */

export interface TTLStorageItem<T> {
    value: T;
    timestamp: number;
    ttl: number; // TTL in milliseconds
}

// Default TTLs in milliseconds
export const TTL = {
    MINUTE: 60 * 1000,
    HOUR: 60 * 60 * 1000,
    DAY: 24 * 60 * 60 * 1000,
    WEEK: 7 * 24 * 60 * 60 * 1000,
};

export class TTLStorage {
    private prefix: string;
    private defaultTTL: number;

    constructor(prefix: string = 'codenium_', defaultTTL: number = TTL.DAY) {
        this.prefix = prefix;
        this.defaultTTL = defaultTTL;
    }

    /**
     * Get item with TTL check
     * Returns null if expired or not found
     */
    get<T>(key: string): T | null {
        try {
            const raw = localStorage.getItem(this.prefix + key);
            if (!raw) return null;

            const item: TTLStorageItem<T> = JSON.parse(raw);
            const now = Date.now();

            // Check if expired
            if (now - item.timestamp > item.ttl) {
                this.remove(key);
                return null;
            }

            return item.value;
        } catch {
            return null;
        }
    }

    /**
     * Set item with TTL
     */
    set<T>(key: string, value: T, ttl: number = this.defaultTTL): void {
        try {
            const item: TTLStorageItem<T> = {
                value,
                timestamp: Date.now(),
                ttl,
            };
            localStorage.setItem(this.prefix + key, JSON.stringify(item));
        } catch (e) {
            console.error('[TTLStorage] Error saving item:', e);
        }
    }

    /**
     * Remove item
     */
    remove(key: string): void {
        localStorage.removeItem(this.prefix + key);
    }

    /**
     * Check if item exists and is not expired
     */
    has(key: string): boolean {
        return this.get(key) !== null;
    }

    /**
     * Get remaining TTL in milliseconds (0 if expired or not found)
     */
    getRemainingTTL(key: string): number {
        try {
            const raw = localStorage.getItem(this.prefix + key);
            if (!raw) return 0;

            const item: TTLStorageItem<unknown> = JSON.parse(raw);
            const elapsed = Date.now() - item.timestamp;
            const remaining = item.ttl - elapsed;

            return remaining > 0 ? remaining : 0;
        } catch {
            return 0;
        }
    }

    /**
     * Refresh TTL (update timestamp without changing value)
     */
    touch<T>(key: string, newTTL?: number): boolean {
        const value = this.get<T>(key);
        if (value === null) return false;

        const raw = localStorage.getItem(this.prefix + key);
        if (!raw) return false;

        try {
            const item: TTLStorageItem<T> = JSON.parse(raw);
            item.timestamp = Date.now();
            if (newTTL !== undefined) {
                item.ttl = newTTL;
            }
            localStorage.setItem(this.prefix + key, JSON.stringify(item));
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Clean up all expired items with this prefix
     */
    cleanup(): number {
        let cleaned = 0;
        const now = Date.now();

        for (let i = 0; i < localStorage.length; i++) {
            const fullKey = localStorage.key(i);
            if (!fullKey || !fullKey.startsWith(this.prefix)) continue;

            try {
                const raw = localStorage.getItem(fullKey);
                if (!raw) continue;

                const item: TTLStorageItem<unknown> = JSON.parse(raw);
                if (now - item.timestamp > item.ttl) {
                    localStorage.removeItem(fullKey);
                    cleaned++;
                }
            } catch {
                // Skip invalid items
            }
        }

        return cleaned;
    }
}

// Singleton instances for common use cases
export const draftStorage = new TTLStorage('codenium_draft_', TTL.WEEK); // Drafts expire after 1 week
export const cacheStorage = new TTLStorage('codenium_cache_', TTL.HOUR); // Cache expires after 1 hour

export default TTLStorage;
