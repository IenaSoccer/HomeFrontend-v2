<template>
  <div v-if="loaded">
    <div v-if="data.length > 0" class="mx-auto max-w-[1200px] px-4 md:px-8">
      <div class="grid overflow-hidden rounded-2xl border border-white/10 bg-[#121212]/85 shadow-[0_16px_40px_rgba(0,0,0,0.3)] lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div class="roboto-flex flex min-w-0 flex-col gap-4 p-6 text-[#f3f4f6] md:p-8">
          <div class="h-1 w-12 rounded-full bg-[#239ced]"></div>
          <h3 class="m-0 text-2xl font-bold leading-tight md:text-3xl">
            {{ data[0]?.content.data[slide]?.data.name }}
          </h3>
          <p class="m-0 whitespace-pre-line text-base font-light leading-relaxed text-[#f3f4f6]/75">
            {{ data[0]?.content.data[slide]?.data.description }}
          </p>
          <div v-if="data[0]?.attributes?.tags?.length" class="mt-auto flex flex-wrap gap-2 pt-2">
            <q-btn
              v-for="(tag, i) in data[0]?.attributes?.tags"
              :key="i"
              :label="'#' + tag"
              flat
              dense
              no-caps
              class="!rounded-full !bg-[#1e198f]/70 !px-3 !text-sm !font-normal !text-[#f3f4f6]"
            />
          </div>
        </div>
        <div class="min-w-0 bg-black/40">
          <q-carousel class="!h-auto w-full aspect-video" swipeable animated v-model="slide" infinite>
            <q-carousel-slide v-for="(single, k) in data[0]?.content?.data as Attachment[]" :key="single.id" class="bg-dark !p-0"
              :name="k">
              <video v-if="single.data.path.endsWith('.mp4')" :id="'video' + single.id" class="relative z-10 h-full w-full" muted
                controls>
                <source :src="thumb(single.data.path)" type="video/mp4" />
              </video>
              <img v-else :src="thumb(single.data.path)" :alt="single.data.name" class="relative z-10 h-full w-full object-contain object-center" />
              <img v-if="single.data.path.endsWith('.jpg')" :src="thumb(single.data.path)"
                alt="" aria-hidden="true" class="absolute top-0 left-0 z-0 h-full w-full object-cover blur-[5px]" />
            </q-carousel-slide>
          </q-carousel>
          <div class="flex items-center justify-end gap-2 px-4 py-2 text-[#f3f4f6]">
            <q-btn round dense flat icon="navigate_before" aria-label="Video precedente" @click="
              slide = data[0]?.content.data?.length
                ? (slide - 1 + data[0]?.content.data!.length) % data[0]?.content?.data.length
                : 0
              " />
            <span class="roboto-flex text-sm font-normal text-[#f3f4f6]/70">{{ data[0]?.content.data?.length ? slide + 1 : 0 }} / {{ data[0]?.content.data?.length || 0 }}</span>
            <q-btn round dense flat icon="navigate_next" aria-label="Video successivo" @click="
              slide = data[0]?.content.data?.length
                ? (slide + 1) % data[0]?.content.data!.length
                : 0
              " />
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-row justify-center items-center h-[400px]">
      <div class="select-none font-bold text-4xl text-[#f3f4f6] roboto-flex">
        Non ci sono contenuti
      </div>
    </div>
  </div>
  <div v-else class="mx-auto max-w-[1200px] px-4 md:px-8">
    <div class="grid overflow-hidden rounded-2xl border border-white/10 bg-[#121212]/85 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <div class="flex flex-col gap-4 p-6 md:p-8">
        <ESkeleton height="4px" width="48px" rounded />
        <ESkeleton height="32px" width="70%" rounded />
        <ESkeleton height="18px" rounded />
        <ESkeleton height="18px" width="85%" rounded />
      </div>
      <div class="p-2">
        <div class="aspect-video">
          <ESkeleton rounded />
        </div>
      </div>
    </div>
  </div>
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
  name: 'WVideos',
  components: {
    ESkeleton,
  },
  props: {
    videos: {
      type: {} as () => Resource<UUID>[],
      required: true,
    },
  },
  watch: {
    videos: {
      async handler() {
        this.loaded = false;
        this.data = [];

        if (this.videos.length === 0) {
          this.loaded = true;
          return;
        }

        try {
          this.data = (await Promise.all(
            this.videos.map((single) => downloadAttachments(single)),
          )) as Resource<Attachment>[];
        } catch {
          console.error('Error loading videos');
        } finally {
          this.loaded = true;
        }
      },
      immediate: true,
    },
  },
  methods: {
    thumb(url: string) {
      return attachmentUrl(url);
    },
  },
  data() {
    return {
      slide: 0,
      loaded: false,
      data: [] as Resource<Attachment>[],
    };
  },
});
</script>
