<template>
  <q-page>
    <div v-if="loaded" style="min-height: 400px">
      <WGallery :folders="resources['galleria'] || []" :selectedAlbum="selectedAlbum" />
    </div>
  </q-page>
</template>
<script lang="ts">
import { defineComponent, inject, reactive } from 'vue';
import WGallery from 'src/components/Widgets/Mappable/WGallery.vue';

import type { EventBus } from 'quasar';
import type { Resource } from 'src/contracts/Resource';
import type { Mappings } from 'src/contracts/Mappings';
import type { UUID } from 'src/contracts/UUID';

export default defineComponent({
  name: 'GalleryPage',
  components: {
    WGallery,
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

        if (this.$route.params.uuid)
          this.selectedAlbum = this.resources['galleria'].find(
            (r) => r.id === this.$route.params.uuid,
          ) as Resource<UUID>;

        this.loaded = true;
      },
    },
  },
  data() {
    return {
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
});
</script>
