<template>
  <div class="bg-dark w-full min-h-16">
    <div class="flex py-4 flex-col sm:flex-row h-full justify-evenly items-center">
      <div class="text-[#f3f4f6] pb-4 px-2 sm:pb-0 text-xl uppercase tenada select-none">
        <span>Non dimenticare di
          <span class="text-secondary">seguirci</span>
          sui
          <span class="text-accent">social</span></span>
      </div>
      <div class="flex flex-row justify-center items-center text-[#f3f4f6]">
        <div class="q-gutter-sm">
          <q-btn round color="primary" target="_blank"
            href="https://www.facebook.com/people/Asd-Iena-Soccer-Academy-2014/100054428202395/" glossy
            icon="facebook" />
          <q-btn round color="amber" target="_blank" href="https://www.instagram.com/asdienasocceracademy2014/" glossy
            text-color="black" icon="instagram" />
          <q-btn round color="purple" target="_blank" href="https://www.tiktok.com/@ienaforfuture" glossy
            icon="tiktok" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "WSocialBar",
  setup() { },
});
</script>
