<template>
  <div class="w-48">
    <q-select
      bottom-slots
      v-model="model"
      :options="options"
      label="Lingua"
      label-color="white"
      color="orange"
      input-class="text-dark"
      :dense="dense"
      :options-dense="denseOpts"
    >
      <template v-slot:before>
        <q-icon color="white" name="language" />
      </template>
    </q-select>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { ref } from 'vue';

export default defineComponent({
  name: 'LanguageBar',
  setup() {
    return {
      model: ref<string>(''),

      options: ['🇮🇹 - Italiano'],

      dense: ref(false),
      denseOpts: ref(false),
    };
  },
  mounted() {
    this.model = this.options[0]!;
  },
});
</script>
