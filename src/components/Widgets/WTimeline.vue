<template>
  <div v-if="loaded">
    <q-dialog full-height full-width v-model="show">
      <q-card class="bg-transparent h-full">
        <WCarousel :carousel="carousel" :current-slide="0" />
      </q-card>
    </q-dialog>
    <div class="flex flex-col flex-nowrap justify-center items-center roboto-flex">
      <div class="q-px-lg q-py-md select-none">
        <q-timeline v-if="history.length > 0" :layout="layout" color="secondary">
          <q-timeline-entry tag="h3" class="font-bold text-4xl tenada" heading>
            <span
              class="border-b-4 border-orange-600 transition transition-all hover:text-[#f3f4f6]"
            >
              Storia
            </span>
            <br />
          </q-timeline-entry>

          <q-timeline-entry
            v-for="(single, k) in history"
            :key="single.id"
            :color="k % 2 === 0 ? 'teal' : 'primary'"
            :side="k % 2 === 0 ? 'right' : 'left'"
          >
            <div
              class="transition transition-all hover:text-[#f3f4f6] text-lg font-light leading-none"
            >
              {{ single.description }}
            </div>
            <template #title>
              <div class="flex flex-row justify-end items-center">
                <h4 class="text-3xl font-bold transition transition-all hover:text-[#f3f4f6] coolvetica">
                  {{ single.name }}
                </h4>
                <q-btn
                  round
                  dense
                  icon="image"
                  color="blue"
                  class="mx-4 p-2"
                  @click="
                    carousel = single;
                    show = true;
                  "
                  v-if="single.content.data.length > 0"
                >
                </q-btn>
              </div>
            </template>
            <template #subtitle>
              <div class="flex flex-row justify-end items-center">
                <h5 class="text-xl transition transition-all hover:text-[#f3f4f6]">
                  {{ single.attributes.custom.date }}
                </h5>
              </div>
            </template>
          </q-timeline-entry>
        </q-timeline>
        <div v-else>
          <span class="font-bold text-3xl coolvetica transition transition-all hover:text-[#f3f4f6]"
            >Non ci sono contenuti</span
          >
        </div>
      </div>
    </div>
  </div>
  <div v-else class="flex flex-col flex-nowrap justify-center items-center q-px-lg q-py-md w-full">
    <div v-for="k in 3" :key="k" class="flex flex-col gap-2 my-6 w-full max-w-[600px]">
      <ESkeleton height="32px" width="45%" rounded />
      <ESkeleton height="18px" width="80%" rounded />
    </div>
  </div>
</template>
<style scoped>
video {
  object-fit: cover;
}

.roboto {
  font-family: Roboto;
}
</style>
<script lang="ts">
import { defineComponent } from 'vue';
import { computed } from 'vue';
import { useQuasar } from 'quasar';
import WCarousel from '@/components/Widgets/Mappable/WCarousel.vue';
import ESkeleton from '@/components/Elements/ESkeleton.vue';
import type { Resource } from '@/contracts/Resource';
import type { UUID } from '@/contracts/UUID';

export default defineComponent({
  name: 'WTimeline',
  components: {
    WCarousel,
    ESkeleton,
  },
  props: {
    history: {
      type: {} as () => Resource<UUID>[],
      required: true,
    },
  },
  data() {
    return {
      show: false,
      loaded: false,
      carousel: {} as Resource<UUID>,
    };
  },
  mounted() {
    this.carousel = this.history[0] as Resource<UUID>;
    this.loaded = true;
  },
  setup() {
    const $q = useQuasar();

    return {
      layout: computed(() => {
        return $q.screen.lt.sm ? 'dense' : $q.screen.lt.md ? 'comfortable' : 'loose';
      }),
    };
  },
});
</script>
