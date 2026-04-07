/* eslint-disable @typescript-eslint/no-explicit-any */

import { defineStore } from 'pinia';
import type { CacheEntry } from 'src/contracts/Types';

export const useCacheStore = defineStore('cache', {
  state: () => ({
    cache: {} as Record<string, CacheEntry<any>>,
  }),
  actions: {
    set<T>(key: string, data: T, ttl = 60_000) {
      this.cache[key] = {
        data,
        timestamp: Date.now(),
        ttl,
      };
    },
    get<T>(key: string): T | null {
      const entry = this.cache[key];
      if (!entry) return null;

      const isExpired = Date.now() - entry.timestamp > entry.ttl;
      if (isExpired) {
        delete this.cache[key];
        return null;
      }

      return entry.data as T;
    },
    clear(key?: string) {
      if (key) {
        delete this.cache[key];
        return;
      }

      this.cache = {};
    },
  },
});
