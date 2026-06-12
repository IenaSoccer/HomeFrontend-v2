<template>
  <div v-if="loaded">
    <q-splitter horizontal v-model="splitterModel">
      <template v-slot:before>
        <div v-if="album" class="q-pa-md">
          <EFolders :folders="album" />
        </div>
      </template>

      <template v-slot:after>
        <div v-if="selected.id" :key="selected.id" class="q-pa-md roboto-flex font-light">
          <div class="text-h4 q-mb-md font-bold p-4">
            {{ selected.name }}
          </div>
          <div class="text-lg px-4">
            {{ selected.description }}
          </div>
          <q-intersection once transition="slide-up">
            <EAlbum :album="selected" />
          </q-intersection>
        </div>
        <div v-else class="flex flex-row justify-center items-center my-8">
          <div class="select-none font-bold text-4xl text-dark roboto-flex">Seleziona un album</div>
        </div>
      </template>
    </q-splitter>
  </div>
  <div v-else class="flex flex-row justify-center items-center m-8">
    <q-spinner color="secondary" size="10em" :thickness="5"></q-spinner>
  </div>
</template>
<script lang="ts">
import { defineComponent, inject } from 'vue';
import { ref } from 'vue';

import EAlbum from 'src/components/Elements/EAlbum.vue';
import EFolders from 'src/components/Elements/EFolders.vue';
import type { Resource } from 'src/contracts/Resource';
import type { UUID } from 'src/contracts/UUID';
import type { EventBus } from 'quasar';

export default defineComponent({
  name: 'WGallery',
  components: {
    EAlbum,
    EFolders,
  },
  mounted() {
    this.bus.on('change-folder', (f: Resource<UUID>) => {
      this.selected = f;
    });
  },
  props: {
    folders: {
      type: {} as () => Resource<UUID>[],
      required: true,
    },
  },
  watch: {
    folders: {
      immediate: true,
      handler(n: Resource<UUID>[]) {
        this.album = n;
        this.loaded = true;
      }
    },
  },
  data() {
    return {
      album: [] as Resource<UUID>[],
      selected: {} as Resource<UUID>,
      bus: inject('bus') as EventBus,
      loaded: false,
      ensureResource: inject('ensureResource') as (
        uuid: UUID,
        resource: string,
      ) => Promise<Resource<UUID>[]>,
    };
  },
  setup() {
    return {
      srcset: ref(null),
      splitterModel: ref(20),
    };
  },
});
</script>
