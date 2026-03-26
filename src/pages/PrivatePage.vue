<template>
  <q-page>
    <div v-if="page.mapping === 'galleria'">
      <div style="min-height: 400px">
        <WGallery :folders="page.folders" />
      </div>
    </div>
    <div v-else class="flex flex-row justify-center items-center h-[400px]">
      <div class="select-none font-bold text-4xl text-dark coolvetica">Risorsa non esistente</div>
    </div>
  </q-page>
</template>
<script lang="ts">
import { defineComponent, inject, reactive } from 'vue';
import WGallery from 'src/components/Widgets/Mappable/WGallery.vue';
import type { Mappings } from 'src/contracts/Mappings';
import { useResourceStore } from 'src/stores/Resources';
import type { EventBus } from 'quasar';
import type { Folder } from 'src/contracts/Folder';
import type { Resource } from 'src/contracts/Resource';
import type { UUID } from 'src/contracts/UUID';

export default defineComponent({
  name: 'PrivatePage',
  components: {
    WGallery,
  },
  watch: {
    mappings: {
      immediate: true,
      deep: true,
      async handler(n: Mappings, o: Mappings) {
        if (!n || n === o) return;

        this.page.folders = await this.loadFolderWithHash(
          this.$route.params.fid as UUID,
          this.$route.params.hash as string,
        );
        this.page.mapping = this.mappings.custom[this.$route.params.fid as UUID] || '';
      },
    },
  },
  methods: {
    async loadFolderList(hash: string) {
      return await useResourceStore().listWithHash(hash);
    },
    async loadFolderWithHash(fid: UUID, hash: string) {
      const content = await useResourceStore().fetchWithHash(fid, hash);
      return content;
    },
  },
  data() {
    return {
      mappings: reactive(inject('mappings') as Mappings),
      page: {
        mapping: '' as string,
        album: {} as Folder,
        folders: [] as Resource<UUID>[],
      },
      bus: inject('bus') as EventBus,
    };
  },
  setup() {},
});
</script>
