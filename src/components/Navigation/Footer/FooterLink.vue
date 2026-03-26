<template>
  <div class="lg:w-1/4 md:w-1/2 w-full px-4">
    <q-toolbar class="text-[#f3f4f6]">
      <q-list dense>
        <div class="flex flex-col">
          <span class="text-2xl font-bold py-2">{{ title }}</span>
          <div class="flex flex-col self-start" v-for="single in link" :key="single.link">
            <q-item clickable dense tag="a" class="px-1 text-[#f3f4f6]" :to="single.link">
              <q-item-section :tooltip="single.caption">{{ single.title }}</q-item-section>
            </q-item>
          </div>
        </div>
      </q-list>
    </q-toolbar>
  </div>
</template>
<script lang="ts">
import type { FooterLink } from 'src/contracts/Navbar';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FooterLink',
  props: {
    link: {
      type: {} as () => FooterLink[],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  setup() {},
});
</script>
