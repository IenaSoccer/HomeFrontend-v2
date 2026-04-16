<template>
  <q-page class="max-h-[600px] overflow-y-auto">
    <video
      class="fixed-full opacity-80 w-full h-full"
      :src="background"
      autoplay
      loop
      muted
    ></video>
    <WTimeline :history="history" />
  </q-page>
</template>
<style scoped>
video {
  object-fit: cover;
}
</style>
<script lang="ts">
import { defineComponent, inject, reactive } from 'vue';

import WTimeline from 'src/components/Widgets/WTimeline.vue';
import { loadResource } from 'src/resources/loader';
import type { Mappings } from 'src/contracts/Mappings';
import { useMappingsStore } from 'src/stores/Mappings';
import type { Resource } from 'src/contracts/Resource';
import { useResourceStore } from 'src/stores/Resources';
import type { UUID } from 'src/contracts/UUID';
import type { EventBus } from 'quasar';

export default defineComponent({
  name: 'AboutPage',
  components: {
    WTimeline,
  },
  data() {
    return {
      history: [] as Resource<UUID>[],
      bus: inject('bus') as EventBus,
      resources: reactive(inject('data') as Record<string, Resource<UUID>[]>),
      selectedAlbum: {} as Resource<UUID>,
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
  async mounted() {
    this.mappings = await useMappingsStore().list();

    if (!this.mappings.defaults['storia']) return;

    this.history = await this.loadResource('storia');

    this.bus.emit('resource:loaded', { content: this.history, resource: 'storia' });
  },
  methods: {
    async loadResource(res: string): Promise<Resource<UUID>[]> {
      return loadResource(this.mappings.defaults[res]!.id, useResourceStore()) as Promise<
        Resource<UUID>[]
      >;
    },
  },
  setup() {
    return {
      background: '/backgrounds/background4.webm',
    };
  },
});
</script>
