<template>
  <div class="tenada lg:block hidden">
    <q-toolbar class="text-[#f3f4f6] text-md header-link-toolbar">
      <q-list dense>
        <q-item
          v-if="!item.embedded"
          clickable
          :class="{ hidden: item.nav_hidden }"
          tag="a"
          class="xl:px-4 px-2 py-4 whitespace-nowrap"
          :to="item.link"
          exact
        >
          <q-item-section>{{ item.title }}</q-item-section>
        </q-item>
        <q-item
          v-else
          clickable
          :class="{ hidden: item.nav_hidden }"
          tag="a"
          class="xl:px-4 px-2 py-4 whitespace-nowrap"
          :to="item.link"
          exact
        >
          <q-item-section>{{ item.title }}</q-item-section>
        </q-item>
      </q-list>
    </q-toolbar>
  </div>
</template>

<style scoped>
.tenada {
  font-family: Tenada;
}

a:visited {
  color: white;
}

a:active {
  color: orange;
}

.q-item {
  color: #f3f4f6;
  transition: color 0.2s ease;
}

.q-item:hover {
  color: #239ced;
}

.q-item.q-router-link--active {
  color: #239ced;
  font-weight: 600;
}

.header-link-toolbar {
  width: fit-content;
  padding: 0;
}
</style>

<script lang="ts">
import type { NavItem } from '@/contracts/Navbar';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HeaderLink',
  props: {
    item: {
      type: {} as () => NavItem,
      required: true,
    },
  },
});
</script>
