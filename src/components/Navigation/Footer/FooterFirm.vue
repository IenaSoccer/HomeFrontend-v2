<template>
  <div class="flex flex-row justify-center items-center">
    <div>
      <a href="#/" class="block">
        <q-img src="/iena-logo.png" img-class="object-contain"
          class="px-4 w-24 h-full transform transition-all hover:rotate-12" />
      </a>
    </div>
    <span class="lg:text-xl select-none">Iena Soccer</span>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "FooterFirm",
  setup() { },
});
</script>
