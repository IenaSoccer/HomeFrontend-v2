import { defineStore } from 'pinia';
import { extractBody } from '@/resources/loader';
import type { AxiosResponse } from 'axios';
import type { Mappings } from '@/contracts/Mappings';
import type { ApiResponse } from '@/contracts/ApiResponse';
import api from '@/utils/api';

interface MappingsState {
  mappings: Mappings | null;
}

export const useMappingsStore = defineStore('mappings', {
  state: (): MappingsState => ({
    mappings: null,
  }),

  actions: {
    async list(): Promise<Mappings> {
      const response: AxiosResponse<ApiResponse> = await api.get(`/mappings`);

      const mappings = extractBody<Mappings>(response);
      this.mappings = mappings;

      return mappings;
    },
  },
});
