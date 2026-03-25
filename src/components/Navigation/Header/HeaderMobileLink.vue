<template>
  <q-item clickable tag="a" target="_top" :to="link.link">
    <q-item-section v-if="link.icon" avatar>
      <q-icon :name="link.icon" :class="link.classes" />
    </q-item-section>

    <q-item-section>
      <q-item-label :class="link.title_classes">{{ link.title }}</q-item-label>
      <q-item-label caption>{{ link.caption }}</q-item-label>
    </q-item-section>
  </q-item>
  <q-separator size="1px" v-if="link.divider"></q-separator>
</template>

<script lang="ts">
import type { NavItem } from "src/contracts/Navbar";
import { defineComponent } from "vue";

export default defineComponent({
  name: "HeaderMobileLink",
  props: {
    link: {
      type: {} as () => NavItem,
      required: true,
    },
  },
});
</script>
