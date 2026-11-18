<template>
  <div v-if="loaded">
    <q-splitter horizontal v-model="splitterModel">
      <template v-slot:before>
        <div v-if="album" class="q-pa-md">
          <EFolders :folders="album" :routeAlbums="routeAlbums" @select="localAlbum = $event" />
        </div>
      </template>

      <template v-slot:after>
        <div v-if="selected" :key="selected.id" class="q-pa-md roboto-flex font-light">
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
import { defineComponent } from 'vue';
import { ref } from 'vue';

import EAlbum from '@/components/Elements/EAlbum.vue';
import EFolders from '@/components/Elements/EFolders.vue';
import ESkeleton from '@/components/Elements/ESkeleton.vue';
import type { Resource } from '@/contracts/Resource';
import type { UUID } from '@/contracts/UUID';

export default defineComponent({
  name: 'WGallery',
  components: {
    EAlbum,
    EFolders,
    ESkeleton,
  },
  props: {
    folders: {
      type: {} as () => Resource<UUID>[],
      required: true,
    },
    selectedAlbum: {
      type: {} as () => Resource<UUID> | null,
      default: null,
    },
    routeAlbums: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    selected(): Resource<UUID> | null {
      return this.routeAlbums ? this.selectedAlbum : this.localAlbum;
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
      localAlbum: null as Resource<UUID> | null,
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
