<template>
  <q-header>
    <div class="bg-dark text-[#f3f4f6] lg:h-[100px] h-full flex flex-row items-center justify-between">
      <div class="h-full z-20">
        <q-intersection transition="slide-right">
          <q-toolbar-title class="flex flex-row items-center justify-center h-[100px] clip-left stripes-bg px-8">
            <HeaderFirm />
          </q-toolbar-title>
        </q-intersection>
      </div>
      <q-intersection transition="slide-left">
        <div
          class="flex-row h-[100px] w-full items-center justify-center lg:justify-around bg-primary stripes-bg clip-right px-4 hidden lg:flex">
          <div class="flex flex-row justify-center items-center">
            <HeaderLink v-for="(option, k) in navbar" :key="k" :item="option" />
          </div>
        </div>
      </q-intersection>
    </div>
  </q-header>
</template>
<style lang="scss" scoped>
.clip-left {
  clip-path: polygon(0 0, 100% 0, 93% 100%, 0% 100%);
}

.clip-right {
  clip-path: polygon(7% 0, 100% 0, 100% 100%, 0% 100%);
}

.stripes-bg {
  background-color: var(--q-primary);
  background-image: url("/textures/stripes.png");
  background-repeat: repeat;
}
</style>
<script lang="ts">
import { defineComponent } from "vue";

import HeaderLink from "src/components/Navigation/Header/HeaderLink.vue";
import HeaderFirm from "src/components/Navigation/Header/HeaderFirm.vue";
import type { NavItem } from "src/contracts/Navbar";

export default defineComponent({
  name: "IHeader",
  props: {
    navbar: {
      type: {} as () => NavItem[],
      required: true,
    },
  },
  components: {
    HeaderLink,
    HeaderFirm,
  },
  setup() { },
});
</script>
