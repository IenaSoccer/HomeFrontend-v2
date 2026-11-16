<template>
  <div class="select-none" v-if="loaded">
    <div v-if="post.id">
      <div class="flex flex-row justify-between items-start w-full bg-gray-100">
        <div class="md:w-2/3 w-full px-8">
          <h1 class="roboto-flex font-bold text-3xl py-4 px-2">
            {{ post.name }}
          </h1>

          <div class="py-4" v-if="post.thumbnail">
            <q-img :src="thumb((post.thumbnail as Attachment).data.path)" :alt="post.name"
              class="w-full max-h-[70vh] aspect-video shadow" img-class="object-cover">
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
          <div class="roboto-flex text-lg py-8" v-html="sanitizedContent"></div>
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
  <div v-else class="flex flex-row justify-between items-start w-full bg-gray-100">
    <div class="md:w-2/3 w-full px-8 py-4">
      <ESkeleton height="40px" width="60%" class="my-4" rounded />
      <ESkeleton height="min(70vh, 700px)" class="w-full my-4" rounded />
      <ESkeleton height="20px" width="40%" class="my-4" rounded />
      <ESkeleton height="120px" class="w-full my-4" rounded />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import sanitizeHtml from 'sanitize-html';

import WRelatedPosts from '../Elements/ERelatedPosts.vue';
import WShare from '../Elements/EShare.vue';
import ESkeleton from '../Elements/ESkeleton.vue';
import { attachmentUrl, slugify } from '@/utils/format';
import type { UUID } from '@/contracts/UUID';
import type { Resource } from '@/contracts/Resource';
import type { Attachment } from '@/contracts/Attachment';

const SITE_URL = 'https://www.ienasoccer.it';

export default defineComponent({
  name: 'WPost',
  components: {
    WRelatedPosts,
    WShare,
    ESkeleton,
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
      return `${SITE_URL}/post/${id}/${slug}`;
    },
    computedThumb(thumb: string) {
      return attachmentUrl(thumb, 1280);
    },
    slugify,
    thumb(url: string) {
      return attachmentUrl(url, 1280);
    },
  },
  computed: {
    sanitizedContent(): string {
      return sanitizeHtml(this.post.content.data, {
        allowedTags: [
          ...sanitizeHtml.defaults.allowedTags,
          'figure',
          'figcaption',
          'h1',
          'h2',
          'img',
          'source',
          'video',
        ],
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          '*': ['class'],
          a: ['href', 'name', 'rel', 'target'],
          img: ['alt', 'height', 'loading', 'src', 'title', 'width'],
          source: ['src', 'type'],
          video: ['controls', 'height', 'poster', 'preload', 'src', 'width'],
        },
        allowedSchemes: ['http', 'https', 'mailto', 'tel'],
        transformTags: {
          a: (_tagName, attribs) => ({
            tagName: 'a',
            attribs: attribs.target === '_blank'
              ? { ...attribs, rel: 'noopener noreferrer' }
              : attribs,
          }),
        },
      });
    },
  },
  data() {
    return {
      loaded: false,
    };
  },
});
</script>
