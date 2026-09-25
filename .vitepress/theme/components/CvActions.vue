<script setup lang="ts">
defineProps<{ label?: string }>()
function printCv() {
  if (typeof window !== 'undefined') window.print()
}
</script>

<template>
  <div class="cm-cv-actions no-print">
    <button class="cm-cv-btn" type="button" @click="printCv">
      {{ label ?? 'Descargar CV (PDF)' }}
    </button>
  </div>
</template>

<style scoped>
.cm-cv-actions { margin: 0 0 1.5rem; }
.cm-cv-btn {
  font-family: var(--vp-font-family-mono);
  font-weight: 600;
  padding: 0.5rem 1.1rem;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 6px;
  background: var(--vp-c-brand-1);
  color: var(--vp-c-bg);
  cursor: pointer;
}
.cm-cv-btn:hover { background: var(--vp-c-brand-2); border-color: var(--vp-c-brand-2); }
</style>
