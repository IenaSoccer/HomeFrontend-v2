<template>
  <div v-if="loaded">
    <q-intersection once transition="slide-right">
      <div class="flex flex-col md:flex-row justify-between items-center min-h-[400px]" v-if="currentTeam.id">
        <div class="border-l-4 md:border-r-0 border-white h-full w-full my-4 md:max-w-[200px]">
          <q-list separator>
            <q-item class="bg-accent" clickable v-ripple v-for="s in teams" :key="s.id" @click="changeTeam(s.id)">
              <q-item-section class="text-[#f3f4f6] text-lg font-thin roboto-flex px-8">
                <q-item-label class="text-[#f3f4f6] text-lg font-thin roboto-flex" caption>{{
                  s.name
                }}</q-item-label>
                <q-item-label class="text-[#f3f4f6] text-md" caption>{{
                  s.description
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <div v-if="currentTeam.content.data.length > 0" class="md:py-0 w-full md:w-fit md:grow drop-shadow-2xl">
          <q-carousel v-model="currentSlide" transition-prev="slide-right" transition-next="slide-left" swipeable
            animated v-cloak infinite control-color="white" arrows padding height="400px" class="bg-transparent">
            <q-carousel-slide v-for="s in currentTeam.content.data" :key="s.id" :name="s.id"
              :img-src="s.data.path && s.data.path.endsWith('.jpg') ? thumb(s.data.path) : ''" width="500px"
              spinner-color="white" class="!bg-contain p-0 bg-no-repeat" loading="lazy" alt="Squadra">
              <q-video v-if="s.data.path && s.data.path.endsWith('.mp4')" :src="thumb(s.data.path)" :ratio="16 / 9"
                class="absolute-full w-full h-full z-0">
              </q-video></q-carousel-slide>
          </q-carousel>
        </div>
      </div>
      <div v-else class="flex flex-row justify-center items-center h-[400px]">
        <div class="select-none font-bold text-4xl text-[#f3f4f6] roboto-flex">
          Non ci sono contenuti
        </div>
      </div>
    </q-intersection>
  </div>
  <div v-else class="flex flex-col md:flex-row justify-between items-stretch min-h-[400px]">
    <div class="w-full md:max-w-[200px] my-4 flex flex-col gap-2">
      <ESkeleton v-for="k in 3" :key="k" height="72px" />
    </div>
    <div class="w-full md:grow flex items-center justify-center px-4">
      <ESkeleton height="400px" rounded />
    </div>
  </div>
</template>
<style scoped>
.bg-poly {
  background: url('/textures/triangles.png');
}
</style>
<script lang="ts">
import { defineComponent } from 'vue';
import type { Resource } from '@/contracts/Resource';
import type { UUID } from '@/contracts/UUID';
import type { Attachment } from '@/contracts/Attachment';
import { downloadAttachments } from '@/resources/loader';
import { attachmentUrl } from '@/utils/format';

import ESkeleton from '@/components/Elements/ESkeleton.vue';

export default defineComponent({
  name: 'WTeam',
  components: {
    ESkeleton,
  },
  props: {
    team: {
      type: {} as () => Resource<UUID>[],
      required: true,
    },
  },
  watch: {
    team: {
      async handler(n) {
        this.loaded = false;

        this.teams = n;
        if (n[0]) await this.changeTeam(n[0].id);

        this.loaded = true;
      },
      immediate: true,
    },
  },
  methods: {
    async changeTeam(id: UUID, slide = 0) {
      this.loaded = false;

      this.currentTeam = (await downloadAttachments(
        this.teams.find((x) => x.id === id)!,
      )) as Resource<Attachment>;
      this.currentSlide = this.currentTeam.content.data[slide]!.id;
      this.loaded = true;
    },
    thumb(url: string) {
      return attachmentUrl(url, 1280);
    },
  },
  data() {
    return {
      currentSlide: '' as UUID,
      teams: [] as Resource<UUID>[],
      currentTeam: {} as Resource<Attachment>,
      loaded: false,
    };
  },
});
</script>
