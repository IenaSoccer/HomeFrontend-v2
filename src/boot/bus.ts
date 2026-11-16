import { defineBoot } from '#q-app';
import mitt from 'mitt';

const emitter = mitt();

export default defineBoot(({ app }) => {
  app.provide('bus', emitter);
  app.config.globalProperties.$bus = emitter;
});

export { emitter };
