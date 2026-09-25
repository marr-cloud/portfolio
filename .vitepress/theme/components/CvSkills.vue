<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { stack } from '../../data/stack'
import CategoryIcon from './CategoryIcon.vue'

const { lang } = useData()
const isEn = computed(() => lang.value.startsWith('en'))

function itemsOf(g: (typeof stack)[number]): string[] {
  return isEn.value && g.items_en ? g.items_en : g.items
}
</script>

<template>
  <div class="cm-skills">
    <div v-for="g in stack" :key="g.title" class="cm-skill-group">
      <CategoryIcon :name="g.icon" />
      <p class="cm-skill-body">
        <span class="cm-skill-cat">{{ isEn ? g.title_en : g.title }}:</span>
        {{ itemsOf(g).join(' · ') }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.cm-skills {
  display: grid;
  gap: 0.5rem;
  margin: 0.25rem 0 0.5rem;
}
.cm-skill-group {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
}
.cm-skill-group .cm-cat-icon {
  margin-top: 3px;
}
.cm-skill-body {
  margin: 0;
  line-height: 1.5;
}
.cm-skill-cat {
  font-weight: 600;
  color: inherit; /* matches body ink on screen and print (#111) */
}
</style>
