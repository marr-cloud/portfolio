<script setup lang="ts">
import CategoryIcon from './CategoryIcon.vue'

const certs = [
  { name: 'AWS Solutions Architect – Associate', code: 'SAA-C03' },
  { name: 'AWS Cloud Practitioner', code: 'CLF-C02' }
]
</script>

<template>
  <div class="cm-certs">
    <div v-for="c in certs" :key="c.code" class="cm-cert">
      <CategoryIcon name="award" class="cm-cert__icon" />
      <div class="cm-cert__body">
        <p class="cm-cert__name">{{ c.name }}</p>
        <p class="cm-cert__code">{{ c.code }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cm-certs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}
.cm-cert {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 1rem 1.1rem;
  border: 1px solid var(--vp-c-divider);
  border-left: 3px solid var(--vp-c-brand-1);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}
.cm-cert__icon {
  width: 26px;
  height: 26px;
  color: var(--vp-c-brand-1);
  flex: 0 0 auto;
}
.cm-cert__body { min-width: 0; }
.cm-cert__name { margin: 0; font-weight: 600; line-height: 1.3; }
.cm-cert__code {
  margin: 0.15rem 0 0;
  font-family: var(--vp-font-family-mono);
  font-size: 0.8rem;
  color: var(--vp-c-brand-1);
}
</style>
