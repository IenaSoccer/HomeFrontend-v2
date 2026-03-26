/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */

import axios from 'axios';
import { useCacheStore } from 'src/stores/Cache';

const api = axios.create({
  baseURL: `${process.env[`${(process.env.NODE_ENV as 'development' | 'production').toUpperCase()}_API_URL`]}`,
});

const DEFAULT_TTL = 60_000;

api.interceptors.request.use((config) => {
  const cacheStore = useCacheStore();

  const key = `${config.method}:${config.url}`;

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
    const key = `${response.config.method}:${response.config.url}`;

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
