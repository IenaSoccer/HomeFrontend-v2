<template>
  <div class="flex flex-row justify-start items-center w-full h-full">
    <div class="flex flex-row justify-center items-center">
      <span
        class="hidden h-full lg:block lg:text-5xl select-none text-uppercase tenada transform translate-y-2"
      >
        Iena Soccer
      </span>
      <div>
        <a href="/" class="hidden lg:block">
          <q-img
            src="/iena-logo.png"
            img-class="object-contain"
            class="px-4 w-24 h-full transform transition-all hover:rotate-12"
          />
        </a>
      </div>
    </div>

    <div class="lg:hidden w-full flex flex-row items-center justify-center">
      <q-btn
        flat
        class="flex flex-row justify-center items-center w-32 h-full"
        @click="toggleLeftDrawer"
      >
        <div>
          <q-avatar icon="menu" class="lg:hidden" />
        </div>
        <div class="lg:hidden">
          <q-img class="h-full w-8" src="/iena-logo.png" aria-label="Menu" />
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
