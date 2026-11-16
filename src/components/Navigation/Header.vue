<template>
  <q-header>
    <div
      class="bg-dark text-[#f3f4f6] lg:h-[100px] h-full flex flex-row flex-nowrap items-center justify-between"
    >
      <div class="h-full z-20 shrink-0">
        <div
          class="firm-left flex flex-row items-center justify-start h-[100px] clip-left stripes-bg px-8"
        >
          <HeaderFirm />
        </div>
      </div>
      <div
        class="nav-right flex-row flex-nowrap h-[100px] items-center justify-end bg-primary stripes-bg clip-right pl-12 pr-4 hidden lg:flex shrink-0"
      >
        <div class="flex flex-row flex-nowrap justify-center items-center">
          <HeaderLink v-for="(option, k) in navbar" :key="k" :item="option" />
        </div>
        <HeaderSearch variant="desktop" />
      </div>
      <HeaderSearch variant="mobile" class="px-2 shrink-0" />
    </div>
  </q-header>
</template>
<style lang="scss" scoped>
$clip-slant: 40px;

.clip-left {
  clip-path: polygon(0 0, 100% 0, calc(100% - #{$clip-slant}) 100%, 0% 100%);
}

.clip-right {
  clip-path: polygon(#{$clip-slant} 0, 100% 0, 100% 100%, 0% 100%);
}

.stripes-bg {
  background-color: var(--q-primary);
  background-image: url('/textures/stripes.png');
  background-repeat: repeat;
}

.nav-right {
  width: fit-content !important;
  max-width: fit-content;
}

.firm-left {
  width: fit-content;
}

</style>
<script lang="ts">
import { defineComponent } from 'vue';

import HeaderLink from '@/components/Navigation/Header/HeaderLink.vue';
import HeaderFirm from '@/components/Navigation/Header/HeaderFirm.vue';
import HeaderSearch from '@/components/Navigation/Header/HeaderSearch.vue';
import type { NavItem } from '@/contracts/Navbar';

export default defineComponent({
  name: 'IHeader',
  props: {
    navbar: {
      type: {} as () => NavItem[],
      required: true,
    },
  },
  components: {
    HeaderLink,
    HeaderFirm,
    HeaderSearch,
  },
});
</script>
