
import axios from 'axios';
import { getAuthToken } from '../utils/auth';

const API_BASE = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_URL || '/api');
const STORAGE_KEY = 'codenium_activity_queue';
const BASE_DELAY = 5000; // 5 seconds initial delay
const MAX_DELAY = 300000; // 5 minutes max delay

export interface ActivityEvent {
  event_type: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

class ActivityQueueService {
  private queue: ActivityEvent[] = [];
  private isSyncing: boolean = false;
  private syncTimer: number | null = null;
  private retryCount: number = 0;

  constructor() {
    this.loadQueue();
  }

  /**
   * Load queue from LocalStorage
   */
  private loadQueue() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (e) {
      console.error('[ActivityQueue] Failed to load queue:', e);
      this.queue = [];
    }
  }

  /**
   * Save queue to LocalStorage
   */
  private saveQueue() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.queue));
    } catch (e) {
      console.error('[ActivityQueue] Failed to save queue:', e);
    }
  }

  /**
   * Add an event to the queue
   */
  enqueue(event_type: string, metadata?: Record<string, unknown>) {
    const event: ActivityEvent = {
      event_type,
      metadata,
      created_at: new Date().toISOString()
    };

    this.queue.push(event);
    this.saveQueue();
    
    // Attempt sync if idle
    if (!this.isSyncing && !this.syncTimer) {
      this.sync();
    }
  }

  /**
   * Schedule the next sync attempt
   */
  private scheduleSync(delay: number) {
    this.stop();
    this.syncTimer = window.setTimeout(() => this.sync(), delay);
  }

  /**
   * Sync the queue with the backend
   */
  async sync() {
    if (this.isSyncing) return;
    
    if (this.queue.length === 0) {
      this.stop();
      return;
    }

    const token = getAuthToken();
    if (!token) {
      // Not authenticated: wait and try again
      this.scheduleSync(BASE_DELAY);
      return;
    }

    this.isSyncing = true;
    const eventsToSync = [...this.queue];

    try {
      const response = await axios.post(`${API_BASE}/sync/activity`, {
        events: eventsToSync
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        this.queue = this.queue.slice(eventsToSync.length);
        this.saveQueue();
        console.log(`[ActivityQueue] Successfully synced ${eventsToSync.length} events.`);
        
        // Success: Reset backoff
        this.retryCount = 0;
        
        // If queue still has items (e.g. enqueued during sync), schedule next immediately
        if (this.queue.length > 0) {
          this.scheduleSync(BASE_DELAY);
        } else {
          this.stop(); // Idle
        }
      } else {
        throw new Error('Sync endpoint returned failure');
      }
    } catch (e) {
      console.error('[ActivityQueue] Sync failed:', e);
      
      // Failure: Increment retry count and use exponential backoff
      this.retryCount++;
      const backoffDelay = Math.min(BASE_DELAY * Math.pow(2, this.retryCount), MAX_DELAY);
      console.log(`[ActivityQueue] Retrying in ${Math.round(backoffDelay / 1000)}s...`);
      this.scheduleSync(backoffDelay);
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Start background sync (called on app mount)
   */
  start() {
    if (this.queue.length > 0) {
      this.sync();
    }
  }

  /**
   * Stop periodic sync
   */
  stop() {
    if (this.syncTimer) {
      window.clearTimeout(this.syncTimer);
      this.syncTimer = null;
    }
  }
}

export const activityQueueService = new ActivityQueueService();
