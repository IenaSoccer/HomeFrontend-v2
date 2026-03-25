<template>
  <div class="absolute h-[100vh]" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <div
      :class="{ 'hidden': hideAlert, 'bg-blue-800': alert?.priority === 0, 'bg-yellow-500': alert?.priority === 1, 'bg-red-800': alert?.priority === 2 }"
      class="z-40 w-full min-h-[80px] fixed text-[#f3f4f6] bottom-0">
      <div class="m-4 flex flex-row justify-between items-center roboto-flex">
        <div class="font-bold text-[#f3f4f6]">
          <q-btn flat :icon="!alert?.priority
            ? 'info'
            : alert?.priority === 1
              ? 'warning'
              : 'error'
            "></q-btn>
        </div>
        <div class="select-none">
          <div>{{ alert?.title }}</div>
          <div>{{ alert?.summary }}</div>
        </div>
        <div class="mx-4">
          <q-btn icon="close" size="md" flat rounded color="white" @click="hideAlert = true"></q-btn>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import type { Alert } from "src/contracts/Alert";
import { useAlertsStore } from "src/stores/Alerts";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "WAlert",
  setup() {
    return {
      hideAlert: ref(true),
      alert: ref({} as Alert),
    };
  },
  async mounted() {
    const alerts = await this.fetchAlerts();
    if (alerts[0]) {
      this.hideAlert = false;
      this.alert = alerts[0];
    }
  },
  methods: {
    async fetchAlerts() {
      return await useAlertsStore().list();
    },
  },
});
</script>
