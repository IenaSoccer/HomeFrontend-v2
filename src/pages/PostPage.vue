<template>
  <q-page>
    <WPost :post="post" />
  </q-page>
</template>
<script lang="ts">
import { defineComponent, inject, reactive } from "vue";

import WPost from "src/components/Widgets/WPost.vue";
import { downloadAttachments } from "src/resources/loader";
import type { EventBus } from "quasar";
import type { Resource } from "src/contracts/Resource";
import type { Mappings } from "src/contracts/Mappings";
import { useResourceStore } from "src/stores/Resources";
import type { UUID } from "src/contracts/UUID";
import type { Attachment } from "src/contracts/Attachment";

export default defineComponent({
  name: "PostPage",
  components: {
    WPost,
  },
  watch: {
    mappings: {
      immediate: true,
      deep: true,
      async handler(n: Mappings, o: Mappings) {
        if (!n || n === o) return;

        void await this.loadResource();
      }
    }
  },
  methods: {
    async loadPost(uuid: UUID, slug: string) {
      const fetchedPost = await useResourceStore().fetchResource(uuid);
      this.post = await downloadAttachments(fetchedPost) as Resource<Attachment, string>;

      this.post.slug = slug;
    },
    async loadResource() {
      this.resources['news'] = await this.ensureResource(this.mappings.defaults['news']!.id, 'news');

      if (this.$route.path.startsWith("/post/preview/")) {
        await this.loadPreview(
          this.$route.params.uuid as UUID,
        );
      }
      else {
        await this.loadPost(
          this.$route.params.uuid as UUID,
          this.$route.params.slug as string
        );
      }
    },
    async loadPreview(uuid: UUID) {
      const fetchedPost = await useResourceStore().fetchPreview(uuid);
      this.post = await downloadAttachments(fetchedPost) as Resource<Attachment, string>;

      this.post.slug = 'preview';
    },
  },
  updated() {
    if (!this.mappings.defaults['news'])
      return;

    void this.loadResource();
  },
  data() {
    return {
      mappings: reactive(inject("mappings") as Mappings),
      bus: inject("bus") as EventBus,
      ensureResource: inject("ensureResource") as (uuid: UUID, resource: string) => Promise<Resource<UUID>[]>,
      post: {} as Resource<Attachment, string>,
      slug: "",
      resources: reactive(inject("data") as Record<string, Resource<UUID>[]>),
    };
  },
});
</script>
