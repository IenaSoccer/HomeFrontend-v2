<template>
  <div v-if="loaded">
    <q-dialog full-height full-width v-model="show">
      <q-card class="bg-transparent h-full">
        <WCarousel :carousel="carousel" :current-slide="0" />
      </q-card>
    </q-dialog>
    <div class="flex flex-col flex-nowrap justify-center items-center roboto-flex">
      <div class="q-px-lg q-py-md select-none">
        <q-timeline v-if="resources" :layout="layout" color="secondary">
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
  <div v-else class="flex flex-row justify-center items-center m-8">
    <q-spinner color="primary" size="10em" :thickness="10"></q-spinner>
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
import { defineComponent, inject } from 'vue';
import { computed } from 'vue';
import { useQuasar } from 'quasar';
import type { EventBus } from 'quasar';
import WCarousel from 'src/components/Widgets/Mappable/WCarousel.vue';
import type { Resource } from 'src/contracts/Resource';
import type { Attachment } from 'src/contracts/Attachment';
import type { UUID } from 'src/contracts/UUID';

export default defineComponent({
  name: 'WTimeline',
  components: {
    WCarousel,
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
      bus: inject('bus') as EventBus,
      key: 0,
      loaded: false,
      carousel: {} as Resource<UUID>,
      resources: [] as Resource<Attachment>[],
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
