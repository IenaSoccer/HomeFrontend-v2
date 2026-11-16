<template>
  <div
    class="e-skeleton"
    :class="{ 'e-skeleton--rounded': rounded }"
    :style="{ width, height }"
    role="status"
    aria-label="Caricamento contenuto"
  ></div>
</template>

<style lang="scss" scoped>
.e-skeleton {
  background: linear-gradient(
    100deg,
    rgba(30, 25, 143, 0.35) 20%,
    rgba(35, 156, 237, 0.45) 50%,
    rgba(30, 25, 143, 0.35) 80%
  );
  background-size: 200% 100%;
  animation: e-skeleton-shimmer 1.6s ease-in-out infinite;

  &--rounded {
    border-radius: 12px;
  }
}

@keyframes e-skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ESkeleton',
  props: {
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '100%',
    },
    rounded: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
