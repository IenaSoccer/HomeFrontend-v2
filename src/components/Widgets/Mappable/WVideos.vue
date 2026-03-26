<template>
  <div v-if="loaded">
    <div
      class="q-pa-md pb-0 flex flex-row flex-wrap justify-start lg:justify-evenly items-center"
      v-if="data.length > 0"
    >
      <div class="roboto-flex mx-4 self-start max-w-[300px] py-4">
        <div class="text-2xl text-[#f3f4f6]">
          {{ data[0]?.content.data[slide]?.data.name }}
        </div>
        <span class="text-lg font-thin text-[#f3f4f6]">{{
          data[0]?.content.data[slide]?.data.description
        }}</span>
      </div>
      <q-carousel class="w-[700px]" swipeable animated v-model="slide" infinite>
        <template #control>
          <div class="absolute bottom-0 left-0 right-0 flex justify-between px-4 z-5">
            <q-btn
              round
              dense
              size="xl"
              flat
              icon="navigate_before"
              @click="
                slide = data[0]?.content.data?.length
                  ? (slide - 1 + data[0]?.content.data!.length) % data[0]?.content?.data.length
                  : 0
              "
              class="text-white"
            />
            <q-btn
              round
              dense
              size="xl"
              flat
              icon="navigate_next"
              @click="
                slide = data[0]?.content.data?.length
                  ? (slide + 1) % data[0]?.content.data!.length
                  : 0
              "
              class="text-white"
            />
          </div>
        </template>
        <q-carousel-slide
          v-for="(single, k) in data[0]?.content?.data as Attachment[]"
          :key="single.id"
          class="bg-dark"
          style="padding: 0 !important"
          :name="k"
        >
          <video
            v-if="single.data.path.endsWith('.mp4')"
            :id="'video' + single.id"
            class="w-full z-10 h-full"
            muted
            controls
          >
            <source :src="thumb(single.data.path)" type="video/mp4" />
          </video>
          <img
            v-else
            :src="thumb(single.data.path)"
            class="relative w-full h-full object-contain object-center !z-2"
          />
          <img
            v-if="single.data.path.endsWith('.jpg')"
            :src="thumb(single.data.path)"
            class="absolute top-0 left-0 z-0 w-full h-full object-cover"
            style="filter: blur(5px)"
          />
        </q-carousel-slide>
      </q-carousel>
    </div>
    <div v-else class="flex flex-row justify-center items-center h-[400px]">
      <div class="select-none font-bold text-4xl text-[#f3f4f6] roboto-flex">
        Non ci sono contenuti
      </div>
    </div>
    <div class="bg-primary opacity-70 md:max-w-[30%] sm:max-w-[50%] w-full mt-12 self-end">
      <div
        class="flex flex-row flex-nowrap justify-evenly px-4 items-center w-full text-[#f3f4f6] roboto-flex"
      >
        <q-btn
          square
          padding="md"
          :label="'#' + tag"
          flat
          v-for="(tag, i) in videos[slide]?.attributes?.tags"
          :key="i"
          class="text-md font-thin"
        >
        </q-btn>
      </div>
    </div>
  </div>
  <div v-else class="flex flex-row justify-center items-center m-8">
    <q-spinner color="accent" size="10em" :thickness="10"></q-spinner>
  </div>
</template>
<style scoped>
.bg-back1 {
  background: url('/backgrounds/background1.png') no-repeat top left;
}
</style>
<script lang="ts">
import type { EventBus } from 'quasar';
import type { Attachment } from 'src/contracts/Attachment';
import type { Mappings } from 'src/contracts/Mappings';
import type { Resource } from 'src/contracts/Resource';
import type { UUID } from 'src/contracts/UUID';
import { downloadAttachments } from 'src/resources/loader';
import { defineComponent, inject } from 'vue';

export default defineComponent({
  name: 'WVideos',
  props: {
    videos: {
      type: {} as () => Resource<UUID>[],
      required: true,
    },
  },
  watch: {
    videos: {
      handler() {
        this.loaded = false;

        if (this.videos.length === 0) {
          this.loaded = true;
          return;
        }

        Promise.all(
          this.videos.map(async (single) => {
            this.data.push((await downloadAttachments(single)) as Resource<Attachment>);
          }),
        )
          .then(() => {
            this.loaded = true;
          })
          .catch(() => {
            console.error('Error loading videos');
          })
          .finally(() => {
            this.loaded = true;
          });
      },
      immediate: true,
    },
  },
  methods: {
    thumb(url: string) {
      return `${process.env[(process.env.NODE_ENV as 'development' | 'production').toUpperCase() + '_ATTACHMENTS_URL']}/${url}`;
    },
  },
  data() {
    return {
      slide: 0,
      loaded: false,
      data: [] as Resource<Attachment>[],
      mappings: inject('mappings') as Mappings,
      bus: inject('bus') as EventBus,
    };
  },
});
</script>
