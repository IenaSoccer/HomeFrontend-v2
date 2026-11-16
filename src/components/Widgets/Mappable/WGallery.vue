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
  <div v-else class="flex flex-row flex-wrap justify-start items-center q-pa-md">
    <ESkeleton v-for="k in 4" :key="k" width="256px" height="128px" class="m-4" rounded />
  </div>
</template>
<script lang="ts">
import { defineComponent, inject } from 'vue';
import { ref } from 'vue';

import EAlbum from '@/components/Elements/EAlbum.vue';
import EFolders from '@/components/Elements/EFolders.vue';
import ESkeleton from '@/components/Elements/ESkeleton.vue';
import type { Resource } from '@/contracts/Resource';
import type { UUID } from '@/contracts/UUID';
import type { EventBus } from 'quasar';

export default defineComponent({
  name: 'WGallery',
  components: {
    EAlbum,
    EFolders,
    ESkeleton,
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
    selectedAlbum: {
      type: {} as () => Resource<UUID>,
      default: () => ({}) as Resource<UUID>,
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
    selectedAlbum: {
      immediate: true,
      handler(n: Resource<UUID>) {
        if (n && n.id) this.selected = n;
      },
    },
  },
  data() {
    return {
      album: [] as Resource<UUID>[],
      selected: {} as Resource<UUID>,
      bus: inject('bus') as EventBus,
      loaded: false,
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
