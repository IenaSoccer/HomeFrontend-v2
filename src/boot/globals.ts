import { defineBoot } from '#q-app';
import type Globals from '@/contracts/Globals';

const globals: Globals = {
  page: '/',
};

export default defineBoot(({ app }) => {
  app.provide('globals', globals);
  app.config.globalProperties.$globals = globals;
});

export { globals };
