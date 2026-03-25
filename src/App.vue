<template>
  <router-view />
</template>

<script setup lang="ts">
import { ref, reactive, provide, watchEffect } from "vue";
import type { Mappings } from "./contracts/Mappings";
import type { UUID } from "./contracts/UUID";
import type { Resource } from "./contracts/Resource";
import { useMappingsStore } from "./stores/Mappings";
import { loadResource } from "./resources/loader";
import { useResourceStore } from "./stores/Resources";

const mappings = ref<Mappings | null>(null);
const data = reactive<Record<string, Resource<UUID>[]>>({});

watchEffect(() => {
  if (!mappings.value) {
    useMappingsStore().list().then((m) => (mappings.value = m)).catch(() => (mappings.value = null));
  }
});

async function ensureResource(uuid: UUID, resource: string) {
  const key = mappings.value?.defaults[resource]?.name.toLowerCase();
  if (!key) return;

  if (!data[key])
    data[key] = (await loadResource(uuid, useResourceStore())) as Resource<UUID>[];

  return data[key];
}

provide("mappings", mappings);
provide("data", data);
provide("ensureResource", ensureResource);
</script>
