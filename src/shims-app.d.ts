/* eslint-disable @typescript-eslint/no-explicit-any */

declare module '#q-app/*' {
  import type { BootCallback } from 'quasar';
  export const defineRouter: any;
  export const defineStore: any;
  export const defineBoot: BootCallback<any>;
}
