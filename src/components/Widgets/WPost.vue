<template>
  <div class="select-none" v-if="loaded">
    <div v-if="post.id">
      <div class="flex flex-row justify-between items-start w-full bg-gray-100">
        <div class="md:w-2/3 w-full px-8">
          <h1 class="roboto-flex font-bold text-3xl py-4 px-2">
            {{ post.name }}
          </h1>

          <div class="py-4" v-if="post.thumbnail">
            <q-img :src="thumb((post.thumbnail as Attachment).data.path)" class="w-full h-[700px] shadow"
              img-class="object-cover">
            </q-img>
          </div>
          <div class="flex flex-row justify-between flex-wrap items-center pb-4">
            <div class="flex flex-row text-md roboto-flex text-blue-700">
              <div class="font-thin" v-for="(tag, index) in post.attributes.tags" :key="index">
                <q-btn class="font-light" unelevated>
                  {{ '#' + tag }}
                </q-btn>
              </div>
            </div>
            <div class="text-lg roboto-flex font-light text-gray-700">
              {{ 'Pubblicato il ' + new Date(post.created_at).toLocaleDateString() }}
            </div>
          </div>
          <div class="text-dark roboto-flex text-5xl select-none font-bold">
            {{ post.name }}
          </div>
          <div class="roboto-flex text-lg py-8" v-html="post.content.data"></div>
        </div>
        <div class="border-l-4 border-blue-700 my-8">
          <WRelatedPosts :currentPostId="post.id" />
        </div>
      </div>
      <WShare class="py-8 md:w-[33%] w-full md:px-0 px-4" :url="computedUrl(post.id, slugify(post.name))"
        :title="post.name" :thumb="computedThumb((post.thumbnail as Attachment).data.path)" />
    </div>
    <div v-else class="flex flex-row justify-center items-center h-[400px]">
      <div class="select-none font-bold text-4xl text-dark roboto-flex">Post non esistente</div>
    </div>
  </div>
  <div v-else class="flex flex-row justify-center items-center my-8">
    <q-spinner color="primary" size="10em" :thickness="10"></q-spinner>
  </div>
</template>
<script lang="ts">
import { defineComponent, inject } from 'vue';

import WRelatedPosts from '../Elements/ERelatedPosts.vue';
import WShare from '../Elements/EShare.vue';
import type { EventBus } from 'quasar';
import type { UUID } from 'src/contracts/UUID';
import type { Resource } from 'src/contracts/Resource';
import type { Attachment } from 'src/contracts/Attachment';

export default defineComponent({
  name: 'WPost',
  components: {
    WRelatedPosts,
    WShare,
  },
  props: {
    post: {
      type: {} as () => Resource<Attachment, string>,
      required: true,
    },
  },
  watch: {
    post: {
      immediate: true,
      handler(n: Resource<Attachment, string>) {
        if(n.id)
          this.loaded = true;
      },
    },
  },
  methods: {
    computedUrl(id: UUID, slug: string) {
      return window.location.origin + '/post/' + id + '/' + slug;
    },
    computedThumb(thumb: string) {
      return window.location.origin + thumb;
    },
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
      data: {} as Resource<Attachment>,
      loaded: false,
    };
  },
});
</script>
