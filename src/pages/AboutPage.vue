<template>
  <q-page class="max-h-[600px] overflow-y-auto">
    <video
      class="fixed-full opacity-80 w-full h-full"
      :src="background"
      autoplay
      loop
      muted
    ></video>
    <WTimeline v-if="loaded" :history="history" />
    <div v-else class="flex flex-col flex-nowrap justify-center items-center q-px-lg q-py-md w-full">
      <div v-for="k in 3" :key="k" class="flex flex-col gap-2 my-6 w-full max-w-[600px]">
        <ESkeleton height="32px" width="45%" rounded />
        <ESkeleton height="18px" width="80%" rounded />
      </div>
    </div>
  </q-page>
</template>
<style scoped>
video {
  object-fit: cover;
}
</style>
<script lang="ts">
import { defineComponent, inject, reactive } from 'vue';

import WTimeline from '@/components/Widgets/WTimeline.vue';
import ESkeleton from '@/components/Elements/ESkeleton.vue';
import type { Mappings } from '@/contracts/Mappings';
import type { Resource } from '@/contracts/Resource';
import type { UUID } from '@/contracts/UUID';

export default defineComponent({
  name: 'AboutPage',
  components: {
    WTimeline,
    ESkeleton,
  },
  data() {
    return {
      history: [] as Resource<UUID>[],
      resources: reactive(inject('data') as Record<string, Resource<UUID>[]>),
      mappings: reactive(inject('mappings') as Mappings),
      loaded: false,
      ensureResource: inject('ensureResource') as (
        uuid: UUID,
        resource: string,
      ) => Promise<Resource<UUID>[]>,
    };
  },
  watch: {
    mappings: {
      immediate: true,
      deep: true,
      async handler(n: Mappings) {
        if (!n || !n.defaults || !n.defaults['storia']) return;

        this.resources['storia'] = await this.ensureResource(n.defaults['storia'].id, 'storia');
        this.history = this.resources['storia'];

        this.loaded = true;
      },
    },
  },
  setup() {
    return {
      background: '/backgrounds/background4.webm',
    };
  },
});
</script>
