<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ name: string }>()

const paths: Record<string, string> = {
  cloud: '<path d="M6.5 18a3.5 3.5 0 0 1 0-7 4.5 4.5 0 0 1 8.7-1.3A3.5 3.5 0 0 1 17 18H6.5z"/>',
  containers:
    '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="8.5" y="13" width="7" height="7" rx="1"/>',
  'ci-cd':
    '<path d="M4 12a8 8 0 0 1 13.7-5.6L20 8"/><path d="M20 4v4h-4"/><path d="M20 12a8 8 0 0 1-13.7 5.6L4 16"/><path d="M4 20v-4h4"/>',
  iac: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3"/><path d="M13 15h4"/>',
  monitoring: '<path d="M3 12h4l3 8 4-16 3 8h4"/>',
  database:
    '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/>',
  web: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/>',
  languages: '<path d="M8 8l-4 4 4 4"/><path d="M16 8l4 4-4 4"/><path d="M13 5l-2 14"/>',
  identity: '<circle cx="8" cy="12" r="4"/><path d="M12 12h9"/><path d="M17 12v4"/><path d="M20 12v3"/>'
}

const inner = computed(() => paths[props.name] ?? paths.web)
</script>

<template>
  <svg
    class="cm-cat-icon"
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    v-html="inner"
  />
</template>

<style scoped>
.cm-cat-icon {
  color: var(--vp-c-brand-1);
  flex: 0 0 auto;
}
</style>
