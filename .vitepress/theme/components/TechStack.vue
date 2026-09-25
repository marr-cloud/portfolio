<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { stack } from '../../data/stack'
import TechChip from './TechChip.vue'

const { lang } = useData()
const isEn = computed(() => lang.value.startsWith('en'))
</script>

<template>
  <div class="cm-stack">
    <section v-for="g in stack" :key="g.title" class="cm-stack__group">
      <h3 class="cm-stack__title">{{ isEn ? g.title_en : g.title }}</h3>
      <div class="cm-stack__chips">
        <TechChip v-for="i in g.items" :key="i" :label="i" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.cm-stack { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.25rem; }
.cm-stack__group { border-top: 2px solid var(--vp-c-brand-1); padding-top: 0.75rem; }
.cm-stack__title { font-family: var(--vp-font-family-mono); font-size: 0.95rem; margin: 0 0 0.6rem; }
.cm-stack__chips { display: flex; flex-wrap: wrap; gap: 0.35rem; }
</style>
