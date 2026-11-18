<template>
  <q-page>
    <div v-if="loaded">
      <div ref="carosello" class="scroll-mt-[100px]">
        <WCarousel
          :mantainAspectRatio="false"
          :id="mappings.defaults['carosello']?.id"
          :carousel="pickCarousel(resources['carosello'])"
          :currentSlide="0"
        />
        <ESocialBar />
      </div>

      <div ref="team" class="scroll-mt-[100px]">
        <ESectionWrapper
          parentClass="bg-training pb-8 bg-center bg-cover"
          childClass="text-7xl text-left px-4 coolvetica md:px-8 text-[#f3f4f6] drop-shadow-xl"
          title="IL NOSTRO TEAM"
          underlined
        >
          <template v-slot:content>
            <WTeam :id="mappings.defaults['team']?.id" :team="resources['team'] || []" />
          </template>
        </ESectionWrapper>
      </div>

      <ESectionWrapper
        ref="news"
        parentClass="bg-[#f3f4f6] bg-newspaper scroll-mt-[100px]"
        childClass="p-8 text-7xl text-left pb-8 text-black coolvetica md:px-8"
        title="Notizie"
        underlined
      >
        <template v-slot:content>
          <WNews :id="mappings.defaults['news']?.id" :news="resources['news'] || []" />
        </template>
      </ESectionWrapper>

      <ESectionWrapper
        ref="video"
        parentClass="bg-back1 bg-cover min-h-[700px] pb-8 scroll-mt-[100px]"
        childClass="py-8 text-4xl text-left pb-8 text-[#f3f4f6] px-8 coolvetica"
        title="Video Popolari"
        underlined
      >
        <template v-slot:content>
          <WVideos
            :id="mappings.defaults['video']?.id"
            :videos="resources['video'] || []"
          />
        </template>
      </ESectionWrapper>
    </div>
  </q-page>
</template>
<style>
.coolvetica {
  font-family: Coolvetica, sans-serif;
}

.bg-back1 {
  background: url('/backgrounds/background1.png') no-repeat top left;
}

.bg-training {
  background: url('/backgrounds/background4.jpg') no-repeat center center;
}

.bg-newspaper {
  background-image: url('/textures/newspaper.png');
  background-size: cover;
}
</style>
<script lang="ts">
import { defineComponent, inject, reactive } from 'vue';

import type { Mappings } from '@/contracts/Mappings';

import WNews from '@/components/Widgets/Mappable/WNews.vue';
import WTeam from '@/components/Widgets/Mappable/WTeam.vue';
import WVideos from '@/components/Widgets/Mappable/WVideos.vue';
import WCarousel from '@/components/Widgets/Mappable/WCarousel.vue';
import ESectionWrapper from '@/components/Elements/ESectionWrapper.vue';
import ESocialBar from '@/components/Elements/ESocialBar.vue';

import type { Resource } from '@/contracts/Resource';
import type { UUID } from '@/contracts/UUID';

export default defineComponent({
  name: 'IndexPage',
  components: {
    WCarousel,
    WTeam,
    WNews,
    WVideos,
    ESectionWrapper,
    ESocialBar,
  },

  data() {
    return {
      mappings: reactive(inject('mappings') as Mappings),
      resources: reactive(inject('data') as Record<string, Resource<UUID>[]>),
      ensureResource: inject('ensureResource') as (
        uuid: UUID,
        resource: string,
      ) => Promise<Resource<UUID>[]>,
      loaded: false,
      carouselIndex: null as number | null,
    };
  },

  methods: {
    scrollToSection() {
      const section = this.$route.params.section;
      if (!this.loaded || typeof section !== 'string') return;

      const ref = this.$refs[section.toLowerCase()] as
        | HTMLElement
        | InstanceType<typeof ESectionWrapper>
        | undefined;
      const element = ref && ('$el' in ref ? (ref.$el as HTMLElement) : ref);
      if (element instanceof HTMLElement) element.scrollIntoView({ behavior: 'smooth' });
    },
    pickCarousel(list: Resource<UUID>[] | undefined): Resource<UUID> | undefined {
      if (!list || list.length === 0) return undefined;

      if (this.carouselIndex === null) {
        this.carouselIndex = Math.floor(Math.random() * list.length);
      }

      return list[this.carouselIndex % list.length];
    },
  },

  watch: {
    mappings: {
      immediate: true,
      deep: true,
      async handler(n: Mappings) {
        if (!n || !n.defaults || Object.keys(n.defaults).length === 0) return;

        await Promise.all(
          Object.entries(n.defaults).map(async ([key, value]) => {
            if (!this.resources[key] && value) {
              const resource = await this.ensureResource(value.id, key);
              this.resources[key] = resource;
            }
          }),
        );

        this.loaded = true;
      },
    },

    loaded: {
      flush: 'post',
      handler: 'scrollToSection',
    },
    $route: {
      flush: 'post',
      handler: 'scrollToSection',
    },
  },
});
</script>
