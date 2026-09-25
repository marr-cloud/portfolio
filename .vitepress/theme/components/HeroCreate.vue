<script setup lang="ts">
import Gear from './Gear.vue'
defineProps<{
  name: string
  role: string
  tagline: string
  ctaText: string
  ctaLink: string
  altText: string
  altLink: string
}>()
</script>

<template>
  <section class="cm-hero">
    <div class="cm-hero__gears" aria-hidden="true">
      <Gear :size="180" :teeth="10" :speed="34" class="cm-hero__gear-a" />
      <Gear :size="110" :teeth="8" :speed="22" class="cm-hero__gear-b" />
    </div>
    <div class="cm-hero__body">
      <p class="cm-hero__role">{{ role }}</p>
      <h1 class="cm-hero__name">{{ name }}</h1>
      <p class="cm-hero__tagline">{{ tagline }}</p>
      <div class="cm-hero__actions">
        <a class="cm-btn cm-btn--brand" :href="ctaLink">{{ ctaText }}</a>
        <a class="cm-btn cm-btn--alt" :href="altLink">{{ altText }}</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cm-hero {
  position: relative;
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 3.5rem 0 2rem;
  overflow: hidden;
}
.cm-hero__gears {
  position: relative;
  flex: 0 0 auto;
  width: 220px;
  height: 220px;
}
.cm-hero__gear-a { position: absolute; top: 0; left: 0; opacity: 0.85; }
.cm-hero__gear-b { position: absolute; bottom: 6px; right: 4px; color: var(--cm-copper); opacity: 0.8; }
.cm-hero__role {
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-brand-1);
  letter-spacing: 0.06em;
  margin: 0 0 0.5rem;
  text-transform: uppercase;
  font-size: 0.85rem;
}
.cm-hero__name { font-size: clamp(2rem, 6vw, 3.4rem); line-height: 1.05; margin: 0; }
.cm-hero__tagline { color: var(--vp-c-text-2); font-size: 1.15rem; max-width: 46ch; margin: 0.75rem 0 1.5rem; }
.cm-hero__actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
.cm-btn {
  display: inline-block;
  padding: 0.55rem 1.25rem;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  border: 1px solid var(--vp-c-brand-1);
}
.cm-btn--brand { background: var(--vp-c-brand-1); color: var(--vp-c-bg); }
.cm-btn--alt { color: var(--vp-c-brand-1); background: transparent; }
@media (max-width: 720px) {
  .cm-hero { flex-direction: column; text-align: center; }
  .cm-hero__actions { justify-content: center; }
}
</style>
