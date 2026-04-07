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
  font-family: 'Roboto Variable', sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-variation-settings: 'wdth' 75;
  letter-spacing: -0.04em;
}
</style>
<script lang="ts">
import { defineComponent } from 'vue';
import { inject } from 'vue';
import { useRoute } from 'vue-router';

import IHeader from 'src/components/Navigation/Header.vue';
import IFooter from 'src/components/Navigation/Footer.vue';
import HeaderMobileLink from 'src/components/Navigation/Header/HeaderMobileLink.vue';
import WAlert from 'src/components/Elements/EAlert.vue';

import links from 'src/collections/navbar';
import type Globals from 'src/contracts/Globals';
import { useMeta, type EventBus } from 'quasar';
import { useMappingsStore } from 'src/stores/Mappings';

const SITE_NAME = 'Iena Soccer';
const SITE_URL = 'https://www.ienasoccer.it';
const DEFAULT_DESCRIPTION =
  'Iena Soccer e il tuo punto di riferimento per tutte le notizie e gli aggiornamenti sulla nostra squadra.';
const DEFAULT_IMAGE = `${SITE_URL}/iena-logo.png`;

export default defineComponent({
  name: 'MainLayout',

  components: {
    IHeader,
    IFooter,
    HeaderMobileLink,
    WAlert,
  },
  data: () => {
    return {
      globals: inject('globals') as Globals,
      leftDrawerOpen: false,
    };
  },
  watch: {
    $route(n) {
      this.globals.page = n.path;
    },
  },
  async mounted() {
    const bus = inject('bus') as EventBus;

    this.globals.page = this.$route.path;

    bus.emit('mappings:loaded', await useMappingsStore().list());

    bus.on('sidebar-toggle', () => {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    });

    bus.on('navigate-to', (page: string) => {
      if (this.globals.page !== page) void this.$router.push(page);
    });
  },
  setup() {
    const route = useRoute();

    useMeta(() => {
      const pageTitle = typeof route.meta.title === 'string' ? route.meta.title : 'Homepage';
      const pageDescription =
        typeof route.meta.description === 'string' ? route.meta.description : DEFAULT_DESCRIPTION;
      const pageUrl = `${SITE_URL}${route.fullPath}`;
      const fullTitle = `${pageTitle} - ${SITE_NAME}`;

      return {
        title: pageTitle,
        titleTemplate: (currentTitle: string) => `${currentTitle} - ${SITE_NAME}`,
        meta: {
          contentType: {
            'http-equiv': 'Content-Type',
            content: 'text/html; charset=UTF-8',
          },
          description: {
            name: 'description',
            content: pageDescription,
          },
          keywords: {
            name: 'keywords',
            content: 'Iena Soccer, Clementino, Roccarainola, squadra, calcio',
          },
          robots: {
            name: 'robots',
            content: 'index, follow',
          },
          ogType: {
            property: 'og:type',
            content: 'website',
          },
          ogLocale: {
            property: 'og:locale',
            content: 'it_IT',
          },
          ogSiteName: {
            property: 'og:site_name',
            content: SITE_NAME,
          },
          ogTitle: {
            property: 'og:title',
            content: fullTitle,
          },
          ogDescription: {
            property: 'og:description',
            content: pageDescription,
          },
          ogImage: {
            property: 'og:image',
            content: DEFAULT_IMAGE,
          },
          ogUrl: {
            property: 'og:url',
            content: pageUrl,
          },
          twitterCard: {
            name: 'twitter:card',
            content: 'summary_large_image',
          },
          twitterTitle: {
            name: 'twitter:title',
            content: fullTitle,
          },
          twitterDescription: {
            name: 'twitter:description',
            content: pageDescription,
          },
          twitterImage: {
            name: 'twitter:image',
            content: DEFAULT_IMAGE,
          },
        },
      };
    });

    return {
      headerLinks: links.header,
      footerLinks: links.footer,
    };
  },
});
</script>
