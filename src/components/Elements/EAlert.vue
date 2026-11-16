<template>
  <div
    v-if="!hideAlert"
    class="fixed inset-x-0 bottom-0 z-40"
    style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  >
    <div
      :class="{
        'bg-blue-800': alert?.priority === 0,
        'bg-yellow-500': alert?.priority === 1,
        'bg-red-800': alert?.priority === 2,
      }"
      class="w-full min-h-[80px] text-[#f3f4f6]"
      role="alert"
      aria-live="assertive"
    >
      <div class="m-4 flex flex-row justify-between items-center roboto-flex">
        <div class="font-bold text-[#f3f4f6]">
          <q-btn
            flat
            tabindex="-1"
            :icon="!alert?.priority ? 'info' : alert?.priority === 1 ? 'warning' : 'error'"
          ></q-btn>
        </div>
        <div class="select-none">
          <div>{{ alert?.title }}</div>
          <div>{{ alert?.summary }}</div>
        </div>
        <div class="mx-4">
          <q-btn
            icon="close"
            size="md"
            flat
            rounded
            color="white"
            @click="hideAlert = true"
            aria-label="Chiudi avviso"
          ></q-btn>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import type { Alert } from '@/contracts/Alert';
import { useAlertsStore } from '@/stores/Alerts';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'WAlert',
  setup() {
    return {
      hideAlert: ref(true),
      alert: ref({} as Alert),
    };
  },
  async mounted() {
    try {
      const alerts = await this.fetchAlerts();
      if (alerts[0]) {
        this.hideAlert = false;
        this.alert = alerts[0];
      }
    } catch (error) {
      console.error('Impossibile caricare gli avvisi', error);
    }
  },
  methods: {
    async fetchAlerts() {
      return await useAlertsStore().list();
    },
  },
});
</script>
