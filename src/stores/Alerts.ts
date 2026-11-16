import { defineStore } from 'pinia';
import { extractBody } from '@/resources/loader';
import type { AxiosResponse } from 'axios';
import type { Alert } from '@/contracts/Alert';
import type { ApiResponse } from '@/contracts/ApiResponse';
import api from '@/utils/api';

interface AlertsState {
  items: Alert[];
}

export const useAlertsStore = defineStore('alerts', {
  state: (): AlertsState => ({
    items: [],
  }),

  actions: {
    async list(): Promise<Alert[]> {
      const response: AxiosResponse<ApiResponse> = await api.get(`/alerts`);

      const alerts = extractBody<Alert[]>(response);
      this.items = alerts;
      return alerts;
    },
  },
});
