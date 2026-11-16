<template>
  <div v-if="loaded">
    <q-dialog v-model="popup">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="link" color="primary" text-color="white" />
          <span class="w-full q-ml-sm roboto-flex text-center">Ecco il link dell'album:</span>
        </q-card-section>

        <q-card-section>
          <span class="select-all roboto-flex font-light" v-text="popupText"></span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div class="text-3xl font-normal p-4 roboto-flex">Raccolta</div>
    <q-intersection once transition="slide-down" v-if="folders && folders.length > 0">
      <div class="flex flex-row flex-wrap justify-start items-center">
        <div v-for="f in folders" :key="f.id">
          <q-btn @click="changeFolder(f)" flat class="h-32 w-64 m-4 border-b-4 border-blue-700">
            <q-img :src="thumbnails[f.id]?.data.path ? thumb(thumbnails[f.id]!.data.path) : ''"
              class="absolute-full bg-cover bg-center h-full border-b-4" :class="`border-[#0000ff]`">
              <div class="text-subtitle2 flex h-full w-full flex-col flex-center">
                <q-icon name="folder" class="block" size="sm"></q-icon>
                <div class="font-thin">{{ f.name }}</div>
              </div>
            </q-img>
          </q-btn>
        </div>
      </div>
    </q-intersection>
    <div v-else class="flex flex-row justify-center items-center h-[400px]">
      <div class="font-bold text-4xl text-dark roboto-flex select-none">Non ci sono contenuti</div>
    </div>
  </div>
  <div v-else class="flex flex-row flex-wrap justify-start items-center q-pa-md">
    <ESkeleton v-for="k in 4" :key="k" width="256px" height="128px" class="m-4" rounded />
  </div>
</template>
<script lang="ts">
import type { EventBus } from 'quasar';
import type { Attachment } from '@/contracts/Attachment';
import type { Resource } from '@/contracts/Resource';
import type { UUID } from '@/contracts/UUID';
import { extractThumbnails } from '@/resources/loader';
import { useResourceStore } from '@/stores/Resources';
import { attachmentUrl } from '@/utils/format';
import { defineComponent, inject, ref } from 'vue';

import ESkeleton from '@/components/Elements/ESkeleton.vue';

const createThumbnailMap = (): Record<UUID, Attachment> => ({});

export default defineComponent({
  name: 'WFolders',
  components: {
    ESkeleton,
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
      async handler(n: Resource<UUID>[]) {
        await Promise.all(
          n.map((folder: Resource<UUID>) => this.useThumbnail(folder)),
        );
        this.loaded = true;
      },
    },
  },
  methods: {
    async useThumbnail(f: Resource<UUID>) {
      this.thumbnails[f.id] = (await this.getThumbnail(f)) as Attachment;
    },
    async getThumbnail(folder: Resource<UUID>) {
      return (await extractThumbnails(folder.thumbnail as UUID, useResourceStore()))[0];
    },
    changeFolder(f: Resource<UUID>) {
      this.bus.emit('change-folder', f);
    },
    thumb(url: string) {
      return attachmentUrl(url, 800);
    },
  },
  data() {
    return {
      bus: inject('bus') as EventBus,
      loaded: false,
      thumbnails: createThumbnailMap(),
    };
  },
  setup() {
    return {
      popup: ref(false),
      popupText: ref(''),
    };
  },
});
</script>
