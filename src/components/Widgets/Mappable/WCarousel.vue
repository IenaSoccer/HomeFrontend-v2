<template>
  <div class="" v-cloak v-if="loaded">
    <div class="q-gutter-md" v-if="data && data.id">
      <q-carousel v-model="slide" transition-prev="slide-right" transition-next="slide-left" swipeable animated v-cloak
        infinite control-color="white" padding arrows height="600px" class="bg-dark text-[#f3f4f6]">
        <q-carousel-slide v-for="s in data.content.data" :key="s.id" :name="s.id" class="p-0"
          :class="{ 'bg-contain bg-no-repeat': mantainAspectRatio, 'lg:bg-contain bg-no-repeat': true }"
          :img-src="s.data.path && s.data.path.endsWith('.jpg') ? thumb(s.data.path) : ''">
          <q-video v-if="s.data.path ? s.data.path.endsWith('.mp4') : false" :src="thumb(s.data.path)" :ratio="16 / 9"
            class="absolute-full w-full h-full z-0">
          </q-video>
          <div class="flex flex-col justify-between text-3xl roboto-flex h-full">
            <div class="z-10 bg-[rgba(0,0,0,.6)] h-16 w-full flex flex-row justify-start items-center px-2">
              <div class="flex flex-row flex-wrap justify-between items-center w-full">
                <div class="grow font-light">{{ s.data.name }}</div>
                <q-btn icon="download" color="secondary" rounded flat @click="downloadMedia(s.data.path)"></q-btn>
              </div>
            </div>
            <div class="z-10 bg-primary opacity-70 my-12 self-end max-w-1/2 flex flex-row justify-center items-center">
              <div class="flex flex-row justify-center items-center w-full">
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
  <div v-else class="flex flex-row justify-center items-center m-8">
    <q-spinner color="primary" size="10em" :thickness="10"></q-spinner>
  </div>
</template>
<script lang="ts">
import type { EventBus } from 'quasar';
import type { Attachment } from 'src/contracts/Attachment';
import type { Mappings } from 'src/contracts/Mappings';
import type { Resource } from 'src/contracts/Resource';
import type { UUID } from 'src/contracts/UUID';
import { downloadAttachments } from 'src/resources/loader';
import { inject } from 'vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'WCarousel',
  props: {
    carousel: {
      type: {} as () => Resource<UUID>,
      required: true,
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

    this.data = (await downloadAttachments(this.carousel)) as Resource<Attachment>;
    this.slide = this.data.content.data[this.currentSlide]!.id;
    this.loaded = true;
  },
  data() {
    return {
      bus: inject('bus') as EventBus,
      loaded: false,
      slide: '' as UUID,
      resource: {} as Resource<UUID>,
      data: {} as Resource<Attachment>,
      mappings: inject('mappings') as Mappings,
    };
  },
  created() {
    this.bus.emit('register-ref', 'carousel', this);
  },
  methods: {
    downloadMedia(url: string) {
      const size = /\/\d{1,4}\//;
      window.open(this.thumb(url).replace(size, '/original/'), '_blank');
    },
    thumb(url: string) {
      const attachmentsBase =
        process.env.NODE_ENV === 'production'
          ? process.env.PRODUCTION_ATTACHMENTS_URL
          : process.env.DEVELOPMENT_ATTACHMENTS_URL;

      return `${attachmentsBase}${process.env.NODE_ENV === 'production' ? '/1280/' : '/'}${url}`;
    },
  },
});
</script>
