import { defineStore } from 'pinia';
import { extractBody } from '@/resources/loader';
import type { AxiosResponse } from 'axios';
import type { Mappings } from '@/contracts/Mappings';
import type { ApiResponse } from '@/contracts/ApiResponse';
import api from '@/utils/api';

interface MappingsState {
  mappings: Mappings | null;
}

const pendingRequests = new WeakMap<object, Promise<Mappings>>();

export const useMappingsStore = defineStore('mappings', {
  state: (): MappingsState => ({
    mappings: null,
  }),

  actions: {
    async list(): Promise<Mappings> {
      if (this.mappings) return this.mappings;

      const store = this as object;
      const pendingRequest = pendingRequests.get(store);
      if (pendingRequest) return pendingRequest;

      const request = (async () => {
        const response: AxiosResponse<ApiResponse> = await api.get('/mappings');
        const mappings = extractBody<Mappings>(response);
        this.mappings = mappings;

        return mappings;
      })().finally(() => {
        pendingRequests.delete(store);
      });

      pendingRequests.set(store, request);
      return request;
    },
  },
});
