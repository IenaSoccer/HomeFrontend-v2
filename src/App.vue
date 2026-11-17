<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted, provide, reactive } from 'vue';
import type { Mappings } from './contracts/Mappings';
import type { UUID } from './contracts/UUID';
import type { Resource } from './contracts/Resource';
import { useMappingsStore } from './stores/Mappings';
import { loadResource } from './resources/loader';
import { useResourceStore } from './stores/Resources';

const mappingsStore = useMappingsStore();
const mappings = reactive<Mappings>({
  defaults: mappingsStore.mappings?.defaults ?? {},
  custom: mappingsStore.mappings?.custom ?? {},
});
const data = reactive<Record<string, Resource<UUID>[]>>({});

async function loadMappings() {
  try {
    const loadedMappings = await mappingsStore.list();
    mappings.defaults = loadedMappings.defaults;
    mappings.custom = loadedMappings.custom;
  } catch (error) {
    console.error('Impossibile caricare le associazioni del sito', error);
  }
}

onMounted(() => void loadMappings());

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
