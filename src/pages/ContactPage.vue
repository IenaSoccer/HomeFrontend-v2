<template>
  <q-page>
    <div class="bg-contact bg-cover">
      <WContact />
    </div>
  </q-page>
</template>
<style scoped>
.bg-contact {
  background: url("/backgrounds/background5.jpg") no-repeat top left;
}
</style>
<script lang="ts">
import { defineComponent } from "vue";

import WContact from "src/components/Widgets/WContact.vue";

export default defineComponent({
  name: "ContactPage",
  components: {
    WContact,
  },
  setup() {
    return {};
  },
});
</script>