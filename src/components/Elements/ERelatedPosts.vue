<template>
  <div class="text-3xl text-dark p-8 font-bold roboto-flex">
    Ti potrebbe interessare
  </div>
  <div v-if="loaded" class="text-xl text-dark p-8">
    <div v-if="news && news.length > 1">
      <div v-for="n in shuffleArray(
        news.filter((x) => x.id !== currentPostId)
      ).slice(0, 3)" :key="n.id">
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
  <div v-else class="flex flex-row justify-center items-center m-8">
    <q-spinner color="secondary" size="10em" :thickness="5"></q-spinner>
  </div>
</template>
<script lang="ts">
import { defineComponent, inject } from "vue";

import { loadResource, downloadAttachments } from "src/resources/loader";
import type { EventBus } from "quasar";
import type { Resource } from "src/contracts/Resource";
import type { Mappings } from "src/contracts/Mappings";
import { useMappingsStore } from "src/stores/Mappings";
import type { Attachment } from "src/contracts/Attachment";
import { useResourceStore } from "src/stores/Resources";
import type { UUID } from "src/contracts/UUID";

export default defineComponent({
  name: "WRelatedPosts",
  props: {
    currentPostId: {
      type: String,
      required: true,
    },
  },
  setup() { },
  data() {
    return {
      mappings: {} as Mappings,
      bus: inject("bus") as EventBus,
      news: [] as Resource<Attachment>[],
      loaded: false,
    };
  },
  async mounted() {
    this.mappings = await useMappingsStore().list();

    this.news = await this.getAllPosts();
    this.loaded = true;
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
      return `${process.env[(process.env.NODE_ENV as 'development' | 'production').toUpperCase() + '_ATTACHMENTS_URL']}/${url}`;
    },
    slugify(str: string) {
      return String(str)
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    },
    async loadResource(res: string): Promise<Resource<UUID>[]> {
      return loadResource(
        this.mappings.defaults[res]!.id,
        useResourceStore()
      ) as Promise<Resource<UUID>[]>;
    },
    async getAllPosts() {
      const risorse = await this.loadResource('news');
      risorse.forEach(n => {
        downloadAttachments(n).then(r => this.news.push(r as Resource<Attachment>)).catch(() => { });
      });
      return this.news;
    },
  },
});
</script>
