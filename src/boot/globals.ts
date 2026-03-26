import { boot } from 'quasar/wrappers';
import type Globals from 'src/contracts/Globals';

const globals = {
  page: '/',
} as Globals;

export default boot(({ app }) => {
  app.provide('globals', globals);
  app.config.globalProperties.$globals = globals;
});

export { globals };
