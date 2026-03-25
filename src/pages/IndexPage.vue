<template>
  <q-page>
    <div v-if="loaded">
      <div>
        <WCarousel ref="Carosello" :mantainAspectRatio="false" :id="mappings.defaults['carosello']?.id"
          :carousel="resources['carosello']?.[Math.floor(Math.random() % resources['carosello']!.length)] || {}"
          :currentSlide="0" />
        <ESocialBar />
      </div>

      <div>
        <ESectionWrapper parentClass="bg-training pb-8 bg-center bg-cover"
          childClass="text-7xl text-left px-4 coolvetica md:px-8 text-[#f3f4f6] drop-shadow-xl" title="IL NOSTRO TEAM"
          underlined>
          <template v-slot:content>
            <WTeam ref="Team" :id="mappings.defaults['team']?.id" :team="resources['team'] || []" />
          </template>
        </ESectionWrapper>
      </div>

      <ESectionWrapper parentClass="bg-[#f3f4f6] bg-newspaper"
        childClass="p-8 text-7xl text-left pb-8 text-black coolvetica md:px-8" title="Notizie" underlined>
        <template v-slot:content>
          <WNews ref="News" :id="mappings.defaults['news']?.id" :news="resources['news'] || []" />
        </template>
      </ESectionWrapper>

      <ESectionWrapper parentClass="bg-back1 bg-cover min-h-[700px] pb-8"
        childClass="py-8 text-4xl text-left pb-8 text-[#f3f4f6] px-8 coolvetica" title="Video Popolari" underlined>
        <template v-slot:content>
          <WVideos ref="Video" :id="mappings.defaults['video']?.id" :videos="resources['video'] || []" />
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
  background: url("/backgrounds/background1.png") no-repeat top left;
}

.bg-training {
  background: url("/backgrounds/background4.jpg") no-repeat center center;
}

.bg-newspaper {
  background-image: url("/textures/newspaper.png");
  background-size: cover;
}
</style>
<script lang="ts">
import { defineComponent, inject, reactive } from "vue";

import type { Mappings } from "src/contracts/Mappings";

import WNews from "components/Widgets/Mappable/WNews.vue";
import WTeam from "components/Widgets/Mappable/WTeam.vue";
import WVideos from "components/Widgets/Mappable/WVideos.vue";
import WCarousel from "components/Widgets/Mappable/WCarousel.vue";
import ESectionWrapper from "components/Elements/ESectionWrapper.vue";
import ESocialBar from "src/components/Elements/ESocialBar.vue";

import { scroll, type EventBus } from "quasar";
import type { Resource } from "src/contracts/Resource";
import type { UUID } from "src/contracts/UUID";

export default defineComponent({
  name: "IndexPage",
  components: {
    WCarousel,
    WTeam,
    WNews,
    WVideos,
    ESectionWrapper,
    ESocialBar
  },

  $refs: {} as {
    [key: string]:
    | InstanceType<typeof WCarousel>
  },

  data() {
    return {
      bus: inject("bus") as EventBus,
      mappings: reactive(inject("mappings") as Mappings),
      resources: reactive(inject("data") as Record<string, Resource<UUID>[]>),
      ensureResource: inject("ensureResource") as (
        uuid: UUID,
        resource: string
      ) => Promise<Resource<UUID>[]>,
      loaded: false
    };
  },

  watch: {
    mappings: {
      immediate: true,
      deep: true,
      async handler(n: Mappings, o: Mappings) {
        if (!n || n === o) return;

        await Promise.all(
          Object.entries(n.defaults).map(async ([key, value]) => {
            if (!this.resources[key] && value) {
              const resource = await this.ensureResource(value.id, key);
              this.resources[key] = resource;
            }
          })
        );

        this.loaded = true;
      }
    },

    $route(n) {
      const section = n.params.section as string;
      const ref = this.$refs[section] as
        | InstanceType<typeof WCarousel>
        | undefined;

      if (!ref) return;

      // caso componente Vue
      const el = "$el" in ref ? (ref.$el as HTMLElement) : (ref as HTMLElement);

      if (el) {
        const { getScrollTarget, setVerticalScrollPosition } = scroll
        const target = getScrollTarget(el)
        const offset = el.offsetTop

        setVerticalScrollPosition(target, offset, 500) // 500ms smooth scroll
      }
    }

  },
});
</script>
