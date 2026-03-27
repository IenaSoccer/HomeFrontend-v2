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
  <div v-else class="flex flex-row justify-center items-center m-8">
    <q-spinner color="accent" size="10em" :thickness="10"></q-spinner>
  </div>
</template>
<style scoped>
.bg-poly {
  background: url('/textures/triangles.png');
}
</style>
<script lang="ts">
import { defineComponent } from 'vue';
import { inject } from 'vue';
import type { Resource } from 'src/contracts/Resource';
import type { EventBus } from 'quasar';
import type { UUID } from 'src/contracts/UUID';
import type { Attachment } from 'src/contracts/Attachment';
import { downloadAttachments } from 'src/resources/loader';

export default defineComponent({
  name: 'WTeam',
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
  created() {
    this.bus.emit('register-ref', 'team', this);
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
      const attachmentsBase =
        process.env.NODE_ENV === 'production'
          ? process.env.PRODUCTION_ATTACHMENTS_URL
          : process.env.DEVELOPMENT_ATTACHMENTS_URL;

      return `${attachmentsBase}${process.env.NODE_ENV === 'production' ? '/1280/' : '/'}${url}`;
    },
  },
  data() {
    return {
      bus: inject('bus') as EventBus,
      currentSlide: '' as UUID,
      teams: [] as Resource<UUID>[],
      currentTeam: {} as Resource<Attachment>,
      loaded: false,
    };
  },
});
</script>
