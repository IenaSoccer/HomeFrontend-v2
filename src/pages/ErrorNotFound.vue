<template>
  <div class="fullscreen bg-[#0050a6] text-[#f3f4f6] text-center q-pa-md flex flex-center">
    <div>
      <q-img class="w-48 h-48" src="/backgrounds/background3.png" img-class="w-48 h-48 mx-auto"></q-img>
      <div style="font-size: 20vh">404</div>

      <div class="text-h3 font-thin" style="opacity: 0.9">
        Oops, non c'è nulla qui...
      </div>

      <q-btn class="q-mt-xl" color="white" text-color="blue" unelevated to="/" label="Homepage" no-caps />
    </div>
  </div>
</template>
<style scoped>
.bg-iena {
  background: url("/backgrounds/background3.png") no-repeat center center;
}
</style>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ErrorNotFound",
});
</script>