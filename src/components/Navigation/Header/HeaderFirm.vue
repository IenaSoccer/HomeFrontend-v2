<template>
  <div class="flex flex-row justify-start items-center w-full h-full">
    <div class="flex flex-row justify-center items-center">
      <span
        class="hidden h-full lg:block lg:text-5xl select-none text-uppercase tenada transform translate-y-2"
      >
        Iena Soccer
      </span>
      <div>
        <router-link to="/" class="hidden lg:block" aria-label="Vai alla homepage">
          <img
            src="/iena-logo.png"
            class="mx-4 size-16 object-contain transition-transform hover:rotate-12"
            alt="Logo Iena Soccer"
          />
        </router-link>
      </div>
    </div>

    <div class="lg:hidden w-full flex flex-row items-center justify-center">
      <q-btn
        flat
        class="flex flex-row justify-center items-center w-32 h-full"
        @click="toggleLeftDrawer"
        aria-label="Apri il menu principale"
      >
        <div>
          <q-avatar icon="menu" class="lg:hidden" />
        </div>
        <div class="lg:hidden">
          <q-img class="h-full w-8" src="/iena-logo.png" alt="Logo Iena Soccer" />
        </div>
      </q-btn>
    </div>
  </div>
</template>
<style lang="css" scoped>
.tenada {
  font-family: Tenada;
}
</style>
<script lang="ts">
import type { EventBus } from 'quasar';
import { defineComponent } from 'vue';
import { inject } from 'vue';

export default defineComponent({
  name: 'HeaderFirm',
  setup() {
    const bus = inject('bus') as EventBus;

    return {
      toggleLeftDrawer() {
        bus.emit('sidebar-toggle');
      },
    };
  },
});
</script>
