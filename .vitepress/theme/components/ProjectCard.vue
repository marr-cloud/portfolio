<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import type { Project } from '../../data/projects'
import TechChip from './TechChip.vue'

const props = defineProps<{ project: Project }>()
const { lang } = useData()
const isEn = computed(() => lang.value.startsWith('en'))
const desc = computed(() => (isEn.value ? props.project.description_en : props.project.description))
// Drop tags that just repeat the language chip (e.g. "Rust" + "rust").
const extraTags = computed(() =>
  props.project.tags.filter((t) => t.toLowerCase() !== props.project.language.toLowerCase())
)
</script>

<template>
  <a class="cm-card" :href="project.repo" target="_blank" rel="noopener">
    <span class="cm-card__rivet" aria-hidden="true"></span>
    <h3 class="cm-card__name">{{ project.name }}</h3>
    <p class="cm-card__desc">{{ desc }}</p>
    <div class="cm-card__tags">
      <TechChip :label="project.language" />
      <TechChip v-for="t in extraTags" :key="t" :label="t" />
    </div>
  </a>
</template>

<style scoped>
.cm-card {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.1rem 1.1rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-left: 3px solid var(--vp-c-brand-1);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  text-decoration: none;
  color: inherit;
  transition: transform 0.15s ease, border-color 0.15s ease;
}
.cm-card:hover { transform: translateY(-2px); border-color: var(--vp-c-brand-1); }
.cm-card__rivet {
  position: absolute; top: 8px; right: 8px;
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--vp-c-brand-1); opacity: 0.6;
}
.cm-card__name { font-family: var(--vp-font-family-mono); margin: 0 0 0.4rem; padding-right: 0.9rem; font-size: 1.05rem; color: var(--vp-c-brand-1); word-break: break-word; }
.cm-card__desc { margin: 0 0 0.9rem; color: var(--vp-c-text-2); font-size: 0.92rem; line-height: 1.5; }
.cm-card__tags { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: auto; }
</style>
