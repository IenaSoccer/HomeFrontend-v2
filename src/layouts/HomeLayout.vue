<template>
  <q-layout view="lHh Lpr lFf">
    <WAlert />

    <q-intersection transition="fade">
      <IHeader :navbar="headerLinks" />
    </q-intersection>
    <q-drawer class="bg-[#f4f5f6] roboto-flex" v-model="leftDrawerOpen" bordered>
      <q-list>
        <q-item-label header> Menu </q-item-label>

        <HeaderMobileLink v-for="link in headerLinks" :key="link.title" :link="link" />
      </q-list>
    </q-drawer>

    <q-page-container class="pb-0">
      <router-view />
    </q-page-container>

    <IFooter :navbar="footerLinks" />
  </q-layout>
</template>
<style>
.roboto-flex {
  font-family: "Roboto Variable", sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-variation-settings:
    "wdth" 75;
  letter-spacing: -0.04em;
}
</style>
<script lang="ts">
import { defineComponent } from "vue";
import { inject } from "vue";

import IHeader from "src/components/Navigation/Header.vue";
import IFooter from "src/components/Navigation/Footer.vue";
import HeaderMobileLink from "src/components/Navigation/Header/HeaderMobileLink.vue";
import WAlert from "src/components/Elements/EAlert.vue";

import links from "src/collections/navbar";
import type Globals from "src/contracts/Globals";
import type { EventBus } from "quasar";
import { useMappingsStore } from "src/stores/Mappings";

export default defineComponent({
  name: "MainLayout",

  components: {
    IHeader,
    IFooter,
    HeaderMobileLink,
    WAlert,
  },
  data: () => {
    return {
      globals: inject("globals") as Globals,
      leftDrawerOpen: false,
    };
  },
  watch: {
    $route(n) {
      this.globals.page = n.path;
    },
  },
  async mounted() {
    const bus = inject("bus") as EventBus;

    this.globals.page = this.$route.path;

    bus.emit("mappings:loaded", await useMappingsStore().list())


    bus.on("sidebar-toggle", () => {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    });

    bus.on("navigate-to", (page: string) => {
      if (this.globals.page !== page) void this.$router.push(page);
    });
  },
  setup() {
    return {
      headerLinks: links.header,
      footerLinks: links.footer,
    };
  },
});
</script>
