<template>
  <div class="" v-cloak v-if="loaded">
    <div class="q-gutter-md" v-if="data && data.id">
      <q-carousel v-model="slide" transition-prev="slide-right" transition-next="slide-left" swipeable animated v-cloak
        infinite control-color="white" padding arrows class="h-[min(72vh,600px)] bg-dark text-[#f3f4f6]">
        <q-carousel-slide v-for="s in data.content.data" :key="s.id" :name="s.id" class="p-0"
          :class="{ 'bg-contain bg-no-repeat': mantainAspectRatio, 'lg:bg-contain bg-no-repeat': true }"
          :img-src="isImage(s.data.path) ? thumb(s.data.path) : ''">
          <q-video v-if="isVideo(s.data.path)" :src="original(s.data.path)" :ratio="16 / 9"
            class="absolute-full w-full h-full z-0">
          </q-video>
          <q-btn
            icon="download"
            color="secondary"
            round
            unelevated
            class="absolute top-4 right-4 z-20"
            aria-label="Scarica media"
            tag="a"
            :href="original(s.data.path)"
            target="_blank"
            rel="noopener noreferrer"
          />
          <div class="flex flex-col justify-end text-3xl roboto-flex h-full">
            <div class="z-10 w-full flex flex-row flex-nowrap justify-between items-stretch">
              <div
                class="bg-[rgba(0,0,0,.6)] flex flex-row items-center px-5 py-3 min-w-[30%] w-fit"
              >
                <div class="font-light whitespace-nowrap">{{ s.data.name }}</div>
              </div>
              <div class="bg-primary opacity-70 flex flex-row justify-center items-center shrink-0">
                <q-btn square padding="md" :label="'#' + tag" flat v-for="(tag, i) in data.attributes?.tags" :key="i"
                  class="text-sm font-light">
                </q-btn>
              </div>
            </div>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>
    <div v-else class="flex flex-row justify-center items-center h-[400px]">
      <div class="select-none font-bold text-4xl text-dark roboto-flex">Non ci sono contenuti</div>
    </div>
  </div>
  <ESkeleton v-else height="min(72vh, 600px)" />
</template>
<script lang="ts">
import type { Attachment } from '@/contracts/Attachment';
import type { Resource } from '@/contracts/Resource';
import type { UUID } from '@/contracts/UUID';
import { downloadAttachments } from '@/resources/loader';
import { attachmentUrl } from '@/utils/format';
import { defineComponent } from 'vue';

import ESkeleton from '@/components/Elements/ESkeleton.vue';

export default defineComponent({
  name: 'WCarousel',
  components: {
    ESkeleton,
  },
  props: {
    carousel: {
      type: {} as () => Resource<UUID> | undefined,
      default: undefined,
    },
    mantainAspectRatio: {
      type: Boolean,
      default: true,
      required: false,
    },
    currentSlide: {
      type: Number,
      required: true,
    },
  },
  async mounted() {
    if (!this.carousel || !this.carousel.id) {
      this.loaded = true;
      return;
    }

    try {
      this.data = (await downloadAttachments(this.carousel)) as Resource<Attachment>;
      const slides = Array.isArray(this.data.content.data) ? this.data.content.data : [];
      this.slide = (slides[this.currentSlide] ?? slides[0])?.id ?? null;
    } catch (error) {
      console.error('Impossibile caricare il carosello', error);
    } finally {
      this.loaded = true;
    }
  },
  data() {
    return {
      loaded: false,
      slide: null as UUID | null,
      data: {} as Resource<Attachment>,
    };
  },
  methods: {
    original(url: string) {
      const size = /\/\d{1,4}\//;
      return this.thumb(url).replace(size, '/original/');
    },
    isImage(url: string) {
      return /\.(avif|gif|jpe?g|png|webp)(?:[?#].*)?$/i.test(url);
    },
    isVideo(url: string) {
      return /\.(m4v|mov|mp4|webm)(?:[?#].*)?$/i.test(url);
    },
    thumb(url: string) {
      return attachmentUrl(url, 1280);
    },
  },
});
</script>
