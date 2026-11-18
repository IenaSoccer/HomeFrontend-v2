import { defineRouter } from '#q-app';
import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router';
import routes from './routes';

export default defineRouter(function () {
  const createHistory = import.meta.env.QUASAR_SERVER ? createMemoryHistory : createWebHistory;

  const Router = createRouter({
    scrollBehavior: (to) => (to.params.section ? false : { left: 0, top: 0 }),
    routes,

    history: createHistory(import.meta.env.BASE_URL),
  });

  return Router;
});
