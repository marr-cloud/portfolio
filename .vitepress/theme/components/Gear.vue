<script setup lang="ts">
const props = defineProps<{ size?: number; teeth?: number; speed?: number }>()
const teeth = props.teeth ?? 8
</script>

<template>
  <svg
    class="cm-gear"
    :width="size ?? 120"
    :height="size ?? 120"
    viewBox="0 0 100 100"
    aria-hidden="true"
    role="presentation"
    :style="{ '--cm-gear-speed': (speed ?? 26) + 's' }"
  >
    <g fill="currentColor">
      <rect
        v-for="n in teeth"
        :key="n"
        x="45" y="3" width="10" height="18" rx="2"
        :transform="`rotate(${(360 / teeth) * n} 50 50)`"
      />
      <circle cx="50" cy="50" r="34" />
    </g>
    <circle cx="50" cy="50" r="12" fill="var(--vp-c-bg)" />
  </svg>
</template>

<style scoped>
.cm-gear {
  color: var(--vp-c-brand-1);
  animation: cm-spin var(--cm-gear-speed, 26s) linear infinite;
  transform-origin: 50% 50%;
}
@keyframes cm-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) {
  .cm-gear { animation: none; }
}
</style>
