<template>
  <router-view />
</template>

<script setup lang="ts">
import { reactive, provide, watchEffect } from 'vue';
import type { Mappings } from './contracts/Mappings';
import type { UUID } from './contracts/UUID';
import type { Resource } from './contracts/Resource';
import { useMappingsStore } from './stores/Mappings';
import { loadResource } from './resources/loader';
import { useResourceStore } from './stores/Resources';

const mappings = reactive<Mappings>({
  defaults: {},
  custom: {},
});
const data = reactive<Record<string, Resource<UUID>[]>>({});

watchEffect(() => {
  if (Object.keys(mappings.defaults).length === 0) {
    useMappingsStore()
      .list()
      .then((m) => {
        mappings.defaults = m.defaults;
        mappings.custom = m.custom;
      })
      .catch(() => {
        mappings.defaults = {};
        mappings.custom = {};
      });
  }
});

async function ensureResource(uuid: UUID, resource: string) {
  const key = mappings.defaults[resource]?.name.toLowerCase();
  if (!key) return;

  if (!data[key]) data[key] = (await loadResource(uuid, useResourceStore())) as Resource<UUID>[];

  return data[key];
}

provide('mappings', mappings);
provide('data', data);
provide('ensureResource', ensureResource);
</script>
