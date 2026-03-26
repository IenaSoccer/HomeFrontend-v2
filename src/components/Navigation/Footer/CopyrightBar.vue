<template>
  <div class="bg-dark py-4 px-5 flex flex-wrap flex-col sm:flex-row">
    <p class="text-[#f3f4f6] coolvetica text-sm text-center sm:text-left">
      © 2026 Iena Soccer Academy —
      <a
        href="https://instagram.com/erpaciocco"
        rel="noopener noreferrer"
        class="text-gray-400 ml-1 roboto-flex font-light"
        target="_blank"
        >@ErPaciocco</a
      >
    </p>
    <span class="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
      <a class="text-gray-200" href="https://www.facebook.com/profile.php?id=100054428202395">
        <svg
          fill="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          class="w-5 h-5"
          viewBox="0 0 24 24"
        >
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
        </svg>
      </a>
      <a class="ml-3 text-gray-200" href="https://www.instagram.com/asdienasocceracademy2014/">
        <svg
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          class="w-5 h-5"
          viewBox="0 0 24 24"
        >
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
        </svg>
      </a>
    </span>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CopyrightBar',
  setup() {},
});
</script>
