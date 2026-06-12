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
  <div v-else class="flex flex-row justify-center items-center m-8">
    <q-spinner color="primary" size="10em" :thickness="5"></q-spinner>
  </div>
</template>
<script lang="ts">
import type { EventBus } from 'quasar';
import type { Attachment } from 'src/contracts/Attachment';
import type { Resource } from 'src/contracts/Resource';
import type { UUID } from 'src/contracts/UUID';
import { extractThumbnails } from 'src/resources/loader';
import { useResourceStore } from 'src/stores/Resources';
import { defineComponent, inject, ref } from 'vue';

export default defineComponent({
  name: 'WFolders',
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
          n.map((folder: Resource<UUID>) => {
            void this.useThumbnail(folder);
          }),
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
      const attachmentsBase =
        process.env.NODE_ENV === 'production'
          ? process.env.PRODUCTION_ATTACHMENTS_URL
          : process.env.DEVELOPMENT_ATTACHMENTS_URL;

      return `${attachmentsBase}${process.env.NODE_ENV === 'production' ? '/800/' : '/'}${url}`;
    },
  },
  data() {
    return {
      bus: inject('bus') as EventBus,
      loaded: false,
      thumbnails: {} as Record<string, Attachment>,
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
