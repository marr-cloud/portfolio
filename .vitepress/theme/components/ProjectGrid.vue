<script setup lang="ts">
import { computed, ref } from 'vue'
import { useData } from 'vitepress'
import { projects } from '../../data/projects'
import ProjectCard from './ProjectCard.vue'

const props = defineProps<{ featuredOnly?: boolean }>()
const { lang } = useData()
const isEn = computed(() => lang.value.startsWith('en'))

const base = computed(() => (props.featuredOnly ? projects.filter((p) => p.featured) : projects))

const allTags = computed(() => {
  const s = new Set<string>()
  base.value.forEach((p) => p.tags.forEach((t) => s.add(t)))
  return ['*', ...Array.from(s).sort()]
})
const active = ref('*')
const shown = computed(() =>
  active.value === '*' ? base.value : base.value.filter((p) => p.tags.includes(active.value))
)
const allLabel = computed(() => (isEn.value ? 'all' : 'todos'))
</script>

<template>
  <div class="cm-grid-wrap">
    <div v-if="!featuredOnly" class="cm-filters">
      <button
        v-for="t in allTags"
        :key="t"
        class="cm-filter"
        :class="{ 'cm-filter--on': active === t }"
        :aria-pressed="active === t"
        @click="active = t"
      >{{ t === '*' ? allLabel : t }}</button>
    </div>
    <div class="cm-grid">
      <ProjectCard v-for="p in shown" :key="p.name" :project="p" />
    </div>
  </div>
</template>

<style scoped>
.cm-filters { display: flex; flex-wrap: wrap; gap: 0.4rem; margin: 0 0 1.25rem; }
.cm-filter {
  font-family: var(--vp-font-family-mono);
  font-size: 0.78rem;
  padding: 0.2rem 0.6rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
}
.cm-filter--on { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); }
.cm-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}
</style>
