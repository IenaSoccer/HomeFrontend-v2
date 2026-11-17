<template>
  <div class="text-3xl text-dark p-8 font-bold roboto-flex">Ti potrebbe interessare</div>
  <div v-if="loaded" class="text-xl text-dark p-8">
    <div v-if="news && news.length > 1">
      <div v-for="n in shuffleArray(news.filter((x) => x.id !== currentPostId)).slice(0, 3)" :key="n.id">
        <q-btn flat :to="`/post/${n.id}/${slugify(n.name)}`">
          <q-card flat class="w-[256px] cursor-pointer w-full h-full select-none">
            <q-img height="256px" width="256px" :src="thumb((n.thumbnail as Attachment).data.path)">
              <div class="absolute-bottom normal-case">
                <div class="text-h6 roboto-flex">{{ n.name }}</div>
                <div class="text-subtitle2 roboto-flex font-light">
                  {{ n.description }}
                </div>
              </div>
            </q-img>
          </q-card>
        </q-btn>
      </div>
    </div>
    <div v-else>Non ci sono contenuti suggeriti al momento</div>
  </div>
  <div v-else class="flex flex-col gap-4 p-8">
    <ESkeleton v-for="k in 3" :key="k" width="256px" height="256px" rounded />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import { loadResource, downloadAttachments } from '@/resources/loader';
import { attachmentUrl, slugify } from '@/utils/format';
import ESkeleton from './ESkeleton.vue';
import type { Resource } from '@/contracts/Resource';
import type { Mappings } from '@/contracts/Mappings';
import { useMappingsStore } from '@/stores/Mappings';
import type { Attachment } from '@/contracts/Attachment';
import { useResourceStore } from '@/stores/Resources';
import type { UUID } from '@/contracts/UUID';

export default defineComponent({
  name: 'WRelatedPosts',
  components: {
    ESkeleton,
  },
  props: {
    currentPostId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      mappings: {} as Mappings,
      news: [] as Resource<Attachment>[],
      loaded: false,
    };
  },
  async mounted() {
    try {
      this.mappings = await useMappingsStore().list();
      if (!this.mappings.defaults['news']) return;

      this.news = await this.getAllPosts();
    } catch (error) {
      console.error('Impossibile caricare i contenuti correlati', error);
    } finally {
      this.loaded = true;
    }
  },
  methods: {
    shuffleArray(array: Array<Resource<Attachment>>) {
      for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        if (array[i] !== undefined && array[j] !== undefined) {
          const temp: Resource<Attachment> = array[i] as Resource<Attachment>;
          array[i] = array[j];
          array[j] = temp;
        }
      }

      return array;
    },
    thumb(url: string) {
      return attachmentUrl(url);
    },
    slugify,
    async loadResource(res: string): Promise<Resource<UUID>[]> {
      return loadResource(this.mappings.defaults[res]!.id, useResourceStore()) as Promise<
        Resource<UUID>[]
      >;
    },
    async getAllPosts() {
      const risorse = await this.loadResource('news');

      this.news = (await Promise.all(
        risorse.map((n) => downloadAttachments(n)),
      )) as Resource<Attachment>[];

      return this.news;
    },
  },
});
</script>
