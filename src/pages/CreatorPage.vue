<template>
  <div>Reindirizzando al pannello Creator...</div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CreatorPage",
  setup() {
    window.location.href = "https://mgmt.ienasoccer.it";
  },
});
</script>
