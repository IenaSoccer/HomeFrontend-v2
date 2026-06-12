<template>
  <q-page class="w-full h-full bg-contact bg-cover">
    <div class="bg-contact bg-cover shadow-none w-full h-full flex flex-row justify-center items-center">
      <WContact />
    </div>
  </q-page>
</template>
<style scoped>
.bg-contact {
  background: url('/backgrounds/background5.jpg') no-repeat top left;
  opacity: 0.9;
}
</style>
<script lang="ts">
import { defineComponent } from 'vue';

import WContact from 'src/components/Widgets/WContact.vue';

export default defineComponent({
  name: 'ContactPage',
  components: {
    WContact,
  },
  setup() {
    return {};
  },
});
</script>
