<template>
  <q-footer class="relative">
    <q-toolbar class="bg-primary text-[#f3f4f6] flex-col lg:flex-row pb-8">
      <div class="tenada w-full flex flex-row flex-wrap items-center justify-start sm:pl-16">
        <FooterFirm class="m-4" />
        <IMap />
      </div>
      <div class="w-full h-full">
        <div class="w-full pt-16">
          <div class="flex w-full roboto-flex flex-row justify-center items-start">
            <FooterLink
              v-for="(value, key) in navbar"
              :key="key"
              :title="key as string"
              :link="value"
            />
            <LanguageBar />
          </div>
        </div>
      </div>
    </q-toolbar>
    <CopyrightBar />
  </q-footer>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import FooterLink from 'src/components/Navigation/Footer/FooterLink.vue';
import FooterFirm from 'src/components/Navigation/Footer/FooterFirm.vue';
import LanguageBar from 'src/components/Navigation/Footer/LanguageBar.vue';
import CopyrightBar from 'src/components/Navigation/Footer/CopyrightBar.vue';
import IMap from 'src/components/Navigation/Footer/Map.vue';
import type { FooterLinks } from 'src/contracts/Navbar';

export default defineComponent({
  name: 'IFooter',
  props: {
    navbar: {
      type: {} as () => FooterLinks,
      required: true,
    },
  },
  components: {
    FooterLink,
    FooterFirm,
    CopyrightBar,
    LanguageBar,
    IMap,
  },
  setup() {},
});
</script>
