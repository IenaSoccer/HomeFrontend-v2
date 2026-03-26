import { defineStore } from 'pinia';
import { extractBody } from 'src/resources/loader';
import type { AxiosResponse } from 'axios';
import type { Alert } from 'src/contracts/Alert';
import type { ApiResponse } from 'src/contracts/ApiResponse';
import api from 'src/utils/api';

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
