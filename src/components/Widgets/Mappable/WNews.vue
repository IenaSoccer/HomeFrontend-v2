<template>
  <div v-if="loaded">
    <q-intersection transition="scale" once v-if="data.length > 0">
      <div
        class="grid px-4 grid-flow-row-dense grid-cols-3 grid-rows-[auto-fit] gap-2 justify-items-center py-16"
      >
        <q-btn
          v-for="(single, k) in data"
          :key="single.id"
          class="p-0 w-full sm:col-span-1 sm:row-span-1 col-span-3 row-span-3 h-full transform transition-all"
          :class="{
            'sm:col-span-2 sm:row-span-2': (k + 2) % 3 === 0,
            'sm:col-start-2': (k + 2) % 6 === 0,
          }"
          :to="`/post/${single.id}/${slugify(single.name)}`"
          flat
        >
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
      <div class="select-none font-thin text-xl text-dark roboto-flex">Non ci sono contenuti</div>
    </div>
  </div>
  <div v-else class="flex flex-row justify-center items-center m-8">
    <q-spinner color="primary" size="10em" :thickness="10"></q-spinner>
  </div>
</template>
<script lang="ts">
import { defineComponent, inject } from 'vue';
import type { EventBus } from 'quasar';
import type { Resource } from 'src/contracts/Resource';
import type { UUID } from 'src/contracts/UUID';
import { downloadAttachments } from 'src/resources/loader';
import type { Attachment } from 'src/contracts/Attachment';
import type { Mappings } from 'src/contracts/Mappings';

export default defineComponent({
  name: 'WNews',
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

        await Promise.all(
          this.news.map(async (single) => {
            this.data.push((await downloadAttachments(single)) as Resource<Attachment, string>);
          }),
        );

        this.loaded = true;
      },
      immediate: true,
    },
  },
  data() {
    return {
      bus: inject('bus') as EventBus,
      loaded: false,
      mappings: inject('mappings') as Mappings,
      data: [] as Resource<Attachment, string>[],
    };
  },
  created() {
    this.bus.emit('register-ref', 'news', this);
  },
  methods: {
    slugify(str: string) {
      return String(str)
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    },
    thumb(url: string) {
      return `${process.env[(process.env.NODE_ENV as 'development' | 'production').toUpperCase() + '_ATTACHMENTS_URL']}${process.env.NODE_ENV === 'production' ? '/1280/' : '/'}${url}`;
    },
  },
});
</script>
