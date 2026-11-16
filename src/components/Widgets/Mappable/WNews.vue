<template>
  <div v-if="loaded">
    <q-intersection transition="scale" once v-if="data.length > 0">
      <div class="grid px-4 grid-flow-row-dense grid-cols-3 grid-rows-[auto-fit] gap-2 justify-items-center py-16">
        <q-btn v-for="(single, k) in data" :key="single.id"
          class="p-0 w-full sm:col-span-1 sm:row-span-1 col-span-3 row-span-3 h-full transform transition-all" :class="{
            'sm:col-span-2 sm:row-span-2': (k + 2) % 3 === 0,
            'sm:col-start-2': (k + 2) % 6 === 0,
          }" :to="`/post/${single.id}/${slugify(single.name)}`" flat>
          <q-card class="cursor-pointer w-full h-full select-none">
            <q-img :src="thumb((single.thumbnail as Attachment).data.path)" class="h-full">
              <div class="absolute-bottom normal-case">
                <div class="text-xl lg:text-2xl roboto-flex font-thin">{{ single.name }}</div>
              </div>
            </q-img>
          </q-card>
        </q-btn>
      </div>
    </q-intersection>
    <div v-else class="flex flex-row justify-center items-center h-[400px]">
      <div class="select-none font-bold text-4xl text-dark roboto-flex">Non ci sono contenuti</div>
    </div>
  </div>
  <div v-else class="grid px-4 grid-cols-3 gap-2 justify-items-center py-16">
    <ESkeleton
      v-for="k in 3"
      :key="k"
      height="280px"
      class="w-full sm:col-span-1 col-span-3"
      rounded
    />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import type { Resource } from '@/contracts/Resource';
import type { UUID } from '@/contracts/UUID';
import { downloadAttachments } from '@/resources/loader';
import { attachmentUrl, slugify } from '@/utils/format';
import type { Attachment } from '@/contracts/Attachment';

import ESkeleton from '@/components/Elements/ESkeleton.vue';

export default defineComponent({
  name: 'WNews',
  components: {
    ESkeleton,
  },
  props: {
    news: {
      type: {} as () => Resource<UUID>[],
      required: true,
    },
  },
  watch: {
    news: {
      async handler() {
        this.loaded = false;
        this.data = [];

        this.data = (await Promise.all(
          this.news.map((single) => downloadAttachments(single)),
        )) as Resource<Attachment, string>[];

        this.loaded = true;
      },
      immediate: true,
    },
  },
  data() {
    return {
      loaded: false,
      data: [] as Resource<Attachment, string>[],
    };
  },
  methods: {
    slugify,
    thumb(url: string) {
      return attachmentUrl(url, 1280);
    },
  },
});
</script>
