<template>
  <div :class="parentClass" class="min-h-[400px] pt-4 font-bold">
    <div :class="childClass" class="text-6xl pb-8 text-uppercase select-none">
      <span :class="{ 'border-b-4 border-[#b02747]': underlined }">
        {{ title }}
      </span>
    </div>
    <slot name="content"></slot>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { ref } from 'vue';

export default defineComponent({
  name: 'ESectionWrapper',
  props: {
    title: {
      type: String,
      required: true,
    },
    parentClass: {
      type: String,
      required: true,
    },
    childClass: {
      type: String,
      required: true,
    },
    underlined: {
      type: Boolean,
      required: false,
    },
  },
  setup() {
    return {
      text: ref(''),
    };
  },
});
</script>
