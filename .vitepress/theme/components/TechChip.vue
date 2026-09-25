<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<template>
  <span class="cm-chip">{{ label }}</span>
</template>

<style scoped>
.cm-chip {
  display: inline-block;
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  padding: 0.15rem 0.5rem;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 4px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  line-height: 1.6;
}
</style>
