<template>
  <div class="tenada lg:block hidden">
    <q-toolbar class="text-[#f3f4f6] text-md">
      <q-list dense>
        <q-item v-if="!item.embedded" clickable :class="{ 'hidden': item.nav_hidden }" tag="a" class="xl:px-4 px-0 py-4"
          :to="item.link">
          <q-item-section>{{ item.title }}</q-item-section>
        </q-item>
        <q-item v-else clickable :class="{ 'hidden': item.nav_hidden }" tag="a" class="xl:px-4 px-0 py-4"
          :to="item.link">
          <q-item-section>{{ item.title }}</q-item-section>
        </q-item>
      </q-list>
    </q-toolbar>
  </div>
</template>

<style scoped>
.tenada {
  font-family: Tenada;
}

a:visited {
  color: white;
}

a:active {
  color: orange;
}
</style>

<script lang="ts">
import type { EventBus } from "quasar";
import type { NavItem } from "src/contracts/Navbar";
import { defineComponent } from "vue";
import { ref } from "vue";
import { inject } from "vue";

export default defineComponent({
  name: "HeaderLink",
  props: {
    item: {
      type: {} as () => NavItem,
      required: true,
    },
  },
  setup() {
    const bus = inject("bus") as EventBus;

    return {
      model: ref("one"),
      scrollEvent: function (slug: string) {
        bus.emit("navigate-to", "/");
        bus.emit("scroll-to", slug);
      },
    };
  },
});
</script>
