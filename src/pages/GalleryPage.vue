<template>
  <q-page>
    <div v-if="loaded" style="min-height: 400px">
      <WGallery :folders="resources['galleria'] || []" :selectedAlbum="selectedAlbum" routeAlbums />
    </div>
  </q-page>
</template>
<script lang="ts">
import { defineComponent, inject } from 'vue';
import WGallery from '@/components/Widgets/Mappable/WGallery.vue';

import type { Resource } from '@/contracts/Resource';
import type { Mappings } from '@/contracts/Mappings';
import type { UUID } from '@/contracts/UUID';

export default defineComponent({
  name: 'GalleryPage',
  components: {
    WGallery,
  },
  computed: {
    selectedAlbum(): Resource<UUID> | null {
      return this.resources['galleria']?.find((album) => album.id === this.$route.params.uuid) ?? null;
    },
  },
  watch: {
    mappings: {
      immediate: true,
      deep: true,
      async handler(n: Mappings) {
        if (!n || !n.defaults) return;

        if (!n.defaults['galleria']) {
          this.loaded = true;
          return;
        }

        this.resources['galleria'] = await this.ensureResource(
          n.defaults['galleria'].id,
          'galleria',
        );

        this.loaded = true;
      },
    },
  },
  data() {
    return {
      resources: inject('data') as Record<string, Resource<UUID>[]>,
      mappings: inject('mappings') as Mappings,
      loaded: false,
      ensureResource: inject('ensureResource') as (
        uuid: UUID,
        resource: string,
      ) => Promise<Resource<UUID>[]>,
    };
  },
});
</script>
