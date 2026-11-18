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
          <div class="post-content roboto-flex text-lg py-8" v-html="sanitizedContent"></div>
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
const SAFE_CSS_COLOR = /^(?:#[0-9a-f]{3,8}|rgba?\(\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)|[a-z]+)$/i;

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
          '*': ['class', 'data-list', 'style'],
          a: ['href', 'name', 'rel', 'target'],
          img: ['alt', 'height', 'loading', 'src', 'title', 'width'],
          source: ['src', 'type'],
          video: ['controls', 'height', 'poster', 'preload', 'src', 'width'],
        },
        allowedStyles: {
          '*': {
            'background-color': [SAFE_CSS_COLOR],
            color: [SAFE_CSS_COLOR],
            'font-family': [/^(?:monospace|serif)$/i],
            'font-size': [/^(?:10|18|32)px$/],
            'text-align': [/^(?:center|justify|left|right)$/],
          },
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

<style scoped>
.post-content {
  line-height: 1.75;
  overflow-wrap: anywhere;
}

.post-content :deep(p),
.post-content :deep(blockquote),
.post-content :deep(ol),
.post-content :deep(ul),
.post-content :deep(pre) {
  margin-block: 0 1rem;
}

.post-content :deep(h1),
.post-content :deep(h2),
.post-content :deep(h3) {
  font-weight: 700;
  line-height: 1.25;
  margin-block: 1.5rem 0.75rem;
}

.post-content :deep(h1) {
  font-size: 2rem;
}

.post-content :deep(h2) {
  font-size: 1.5rem;
}

.post-content :deep(h3) {
  font-size: 1.25rem;
}

.post-content :deep(ol),
.post-content :deep(ul) {
  padding-left: 1.75rem;
}

.post-content :deep(ol) {
  list-style: decimal;
}

.post-content :deep(ul) {
  list-style: disc;
}

.post-content :deep(blockquote) {
  border-left: 4px solid #2563eb;
  color: #4b5563;
  padding-left: 1rem;
}

.post-content :deep(pre) {
  background: #111827;
  border-radius: 0.5rem;
  color: #f9fafb;
  overflow-x: auto;
  padding: 1rem;
}

.post-content :deep(a) {
  color: #1d4ed8;
  text-decoration: underline;
}

.post-content :deep(img),
.post-content :deep(video) {
  height: auto;
  max-width: 100%;
}

.post-content :deep(.ql-align-center) {
  text-align: center;
}

.post-content :deep(.ql-align-right) {
  text-align: right;
}

.post-content :deep(.ql-align-justify) {
  text-align: justify;
}

.post-content :deep(.ql-direction-rtl) {
  direction: rtl;
}

.post-content :deep(.ql-font-serif) {
  font-family: Georgia, 'Times New Roman', serif;
}

.post-content :deep(.ql-font-monospace) {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.post-content :deep(.ql-size-small) {
  font-size: 0.75em;
}

.post-content :deep(.ql-size-large) {
  font-size: 1.5em;
}

.post-content :deep(.ql-size-huge) {
  font-size: 2.5em;
}

.post-content :deep(.ql-indent-1) {
  padding-left: 3em;
}

.post-content :deep(.ql-indent-2) {
  padding-left: 6em;
}

.post-content :deep(.ql-indent-3) {
  padding-left: 9em;
}

.post-content :deep(.ql-indent-4) {
  padding-left: 12em;
}

.post-content :deep(.ql-indent-5) {
  padding-left: 15em;
}

.post-content :deep(.ql-indent-6) {
  padding-left: 18em;
}

.post-content :deep(.ql-indent-7) {
  padding-left: 21em;
}

.post-content :deep(.ql-indent-8) {
  padding-left: 24em;
}
</style>
