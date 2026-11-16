<template>
  <div class="q-pa-md" v-if="loaded">
    <q-dialog full-height full-width v-model="show">
      <q-card class="bg-transparent h-full">
        <WCarousel :carousel="album" :currentSlide="currentSlide" />
      </q-card>
    </q-dialog>
    <div class="q-gutter-sm md:grid md:grid-cols-2 md:gap-8" v-if="current.content">
      <q-btn v-for="(m, k) in current.content.data.slice(10 * (page - 1), 10 * (page - 1) + 10)" :key="m.id" flat
        @click="
          currentSlide = k + 10 * (page - 1);
        show = true;
        " class="p-0 w-full h-[300px] cursor-pointer shadow-xl">
        <div class="relative w-full h-[300px]">
          <ESkeleton v-if="!mediaLoaded[m.id]" class="absolute-full" />
          <q-img v-if="m.data.path ? m.data.path.endsWith('.jpg') : false" :src="thumb(m.data.path)"
            width="100%" height="300px" img-class="object-cover" @load="mediaLoaded[m.id] = true" />
          <video v-else-if="m.data.path ? m.data.path.endsWith('.mp4') : false" :src="thumb(m.data.path)" muted controls
            class="w-full h-[300px] object-cover" @loadeddata="mediaLoaded[m.id] = true"></video>
        </div>
      </q-btn>
    </div>
    <div class="flex flex-row justify-center items-center w-full" v-if="current.content">
      <q-btn flat rounded icon="chevron_left" color="black" class="w-4" @click="page--"
        :disabled="page - 1 < 1"></q-btn>
      <q-input type="text" mask="##" dense v-if="current.content" :label="'Pagina' +
        ' (' +
        Math.floor(
          current.content.data.length / 10 < 1 ? 1 : Math.floor(current.content.data.length / 10),
        ) +
        ' in totale)'
        " class="w-24 m-4" v-model="page" readonly></q-input>
      <q-btn flat rounded icon="chevron_right" color="black" class="w-4" @click="page++"
        :disabled="page * 10 >= current.content.data.length"></q-btn>
    </div>
  </div>
  <div v-else class="q-pa-md md:grid md:grid-cols-2 md:gap-8">
    <ESkeleton v-for="k in 6" :key="k" height="300px" class="w-full" rounded />
  </div>
</template>
<style scoped>
.q-card {
  box-shadow: none;
}
</style>
<script lang="ts">
import { defineComponent } from 'vue';
import WCarousel from '@/components/Widgets/Mappable/WCarousel.vue';
import type { Resource } from '@/contracts/Resource';
import type { Attachment } from '@/contracts/Attachment';
import type { UUID } from '@/contracts/UUID';
import { downloadAttachments } from '@/resources/loader';
import { attachmentUrl } from '@/utils/format';

import ESkeleton from '@/components/Elements/ESkeleton.vue';

const createMediaLoadState = (): Record<UUID, boolean> => ({});

export default defineComponent({
  name: 'EAlbum',
  components: {
    WCarousel,
    ESkeleton,
  },
  props: {
    album: {
      type: {} as () => Resource<UUID>,
      required: true,
    },
  },
  watch: {
    album: {
      immediate: true,
      async handler(n: Resource<UUID>) {
        this.loaded = false;
        this.mediaLoaded = createMediaLoadState();
        this.current = (await downloadAttachments(n)) as Resource<Attachment>;
        this.page = 1;
        this.currentSlide = 0;
        this.loaded = true;
      },
    },
  },
  data() {
    return {
      show: false,
      currentSlide: 0,
      page: 1,
      current: {} as Resource<Attachment>,
      mediaLoaded: createMediaLoadState(),
      loaded: false,
    };
  },
  methods: {
    thumb(url: string) {
      return attachmentUrl(url);
    },
  },
});
</script>
