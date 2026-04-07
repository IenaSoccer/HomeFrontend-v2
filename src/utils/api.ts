/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */

import axios from 'axios';
import { useCacheStore } from 'src/stores/Cache';

const apiBaseURL =
  process.env.NODE_ENV === 'production'
    ? process.env.PRODUCTION_API_URL
    : process.env.DEVELOPMENT_API_URL;

if (!apiBaseURL) {
  throw new Error('Missing API base URL env var for current NODE_ENV');
}

const api = axios.create({
  baseURL: apiBaseURL,
});

const DEFAULT_TTL = 60_000;

function getCacheKey(config: { method?: string; url?: string; baseURL?: string; params?: unknown }) {
  const method = (config.method ?? 'get').toUpperCase();
  const requestUrl = api.getUri(config);

  return `${method}:${requestUrl}`;
}

api.interceptors.request.use((config) => {
  const cacheStore = useCacheStore();

  const key = getCacheKey(config);

  const cached = cacheStore.get<any>(key);
  if (cached) {
    return Promise.reject({
      __fromCache: true,
      data: cached,
      config,
    });
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    const cacheStore = useCacheStore();
    const key = getCacheKey(response.config);

    cacheStore.set(key, response.data, DEFAULT_TTL);

    return response;
  },
  (error) => {
    if (error.__fromCache) {
      return Promise.resolve({
        data: error.data,
        config: error.config,
        status: 200,
        statusText: 'OK (from cache)',
        headers: {},
      });
    }
    return Promise.reject(error);
  },
);

export default api;
