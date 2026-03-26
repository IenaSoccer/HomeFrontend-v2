<template>
  <iframe
    style="border: 0"
    loading="lazy"
    class="block mt-4 w-40 mx-auto"
    allowfullscreen
    referrerpolicy="no-referrer-when-downgrade"
    src="https://www.google.com/maps/embed/v1/place?key=AIzaSyB8ZLLJVWBO6eNHoHuW5nFuug40fE2ynbU&amp;q=Stadio+Comunale+Vincenzo+Ottaviano,Roccarainola"
  >
  </iframe>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'IMap',
  setup() {},
});
</script>
