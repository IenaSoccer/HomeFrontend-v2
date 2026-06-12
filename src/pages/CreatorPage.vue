<template>
  <div class="min-h-[500px] flex flex-row items-center justify-center">
    <div class="select-none font-bold text-4xl text-dark roboto-flex">
      Reindirizzando al pannello Creator...
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CreatorPage',
  setup() {
    window.location.href = 'https://mgmt.ienasoccer.it';
  },
});
</script>
