/* eslint-disable @typescript-eslint/no-explicit-any */

import { defineStore } from "pinia";
import type { CacheEntry } from "src/contracts/Types";

export const useCacheStore = defineStore("cache", {
    state: () => ({
        cache: new Map<string, CacheEntry<any>>(),
    }),
    actions: {
        set<T>(key: string, data: T, ttl = 60_000) {
            this.cache.set(key, {
                data,
                timestamp: Date.now(),
                ttl,
            });
        },
        get<T>(key: string): T | null {
            const entry = this.cache.get(key);
            if (!entry) return null;

            const isExpired = Date.now() - entry.timestamp > entry.ttl;
            if (isExpired) {
                this.cache.delete(key);
                return null;
            }

            return entry.data as T;
        },
        clear(key?: string) {
            if (key) this.cache.delete(key);
            else this.cache.clear();
        },
    },
});
