import { defineBoot } from '#q-app/wrappers';
import axios, { type AxiosInstance } from 'axios';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios;
});
