# Portafolio VitePress "Create Mod" — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Also load the `vitepress` skill before editing config/theme — VitePress 2.0 is alpha and some Default Theme names differ from v1.

**Goal:** Build Mauricio Rodriguez's bilingual (ES/EN) personal portfolio in VitePress with a custom "Create Mod" brown/bronze theme, a curated projects grid, a print-to-PDF CV, and Cloudflare Pages deploy config.

**Architecture:** Extend the VitePress Default Theme via `.vitepress/theme/index.ts` (CSS-variable re-skin in `custom.css` + a handful of Vue components). Content lives as Markdown pages, mirrored under `/en/` using VitePress `locales`. Curated project/stack data are plain typed TS modules (unit-testable) imported by components. The CV page carries a `@media print` stylesheet and a button that calls `window.print()`.

**Tech Stack:** VitePress `2.0.0-alpha.20`, Vue 3, pnpm, `@fontsource/inter` + `@fontsource/jetbrains-mono`, Vitest (data unit test), Playwright (`@playwright/test`, one smoke spec), Wrangler (Cloudflare Pages).

**Spec:** `docs/superpowers/specs/2026-09-24-portfolio-vitepress-design.md`

## Global Constraints

- VitePress pinned at `2.0.0-alpha.20`; package manager is **pnpm** (a `pnpm-lock.yaml` already exists — use `pnpm`, never npm/yarn).
- Bilingual: **Spanish is the root locale** (`lang: 'es-CO'`), **English lives under `/en/`** (`lang: 'en'`). Every ES page has an EN mirror with the same slug.
- `cleanUrls: true` (routes without `.html`).
- Exact palette tokens (copy verbatim):
  - Dark: bg `#17120d`, bg-alt `#1f1710`, surface `#241a12`, brown-primary `#3d2b1f`, **bronze accent `#c8a05a`**, copper `#c46a3f`, text-1 `#f0e6d2`, text-2 `#c9b89a`, divider `#5c4326`.
  - Light: bg `#f4ecd8`, bg-alt `#eaddc2`, surface `#efe4cd`, brown-primary `#6b4f34`, **bronze accent `#a9762f`**, copper `#b0562a`, text-1 `#2a1e14`, text-2 `#6b5a42`, divider `#c9a86f`.
- Fonts: body **Inter**, monospace **JetBrains Mono** (self-hosted via `@fontsource`, with system fallbacks).
- Accessibility: contrast AA both modes; all decorative SVG/motifs `aria-hidden="true"`; every animation wrapped so `@media (prefers-reduced-motion: reduce)` disables it.
- No external animation libraries; no live GitHub API calls (data is curated and static).
- Build output dir: `.vitepress/dist`. Deploy target: Cloudflare Pages, custom domain `maurrod.dev` (no `base`).
- Site owner / attribution: name "Mauricio Rodriguez", GitHub `marr-cloud`, domain `maurrod.dev`.

## Review Focus

These behaviors are implied by the spec but a plain `pnpm build` won't catch them; each has a pinned test in the task that owns the code.

1. **Reduced motion** — with `prefers-reduced-motion: reduce`, the hero gear must not animate. → Task 4 (Playwright: emulate reduced motion, assert `animation-name: none`).
2. **Print/PDF** — printing `/sobre-mi` must hide navbar, sidebar, footer, gears and buttons, leaving a clean A4 sheet. → Task 8 (Playwright `emulateMedia({ media: 'print' })`, assert chrome hidden, `.cv-sheet` visible).
3. **Theme accent both modes** — the bronze brand color must apply in dark AND light. → Task 2 (Playwright reads computed `--vp-c-brand-1` in each mode).
4. **Language parity / no dead links** — every ES page resolves its EN mirror and the locale switch works. → Task 7 (build dead-link check + Playwright navigates `/` → `/en/`).
5. **Narrow viewport (~375px)** — home and projects grid must not overflow horizontally. → Task 6 (Playwright sets 375px viewport, asserts `scrollWidth <= clientWidth`).

---

### Task 1: Project baseline — cleanup, dependencies, tooling config

**Files:**
- Delete: `api-examples.md`, `markdown-examples.md`
- Create: `.gitignore`
- Create: `playwright.config.ts`
- Create: `vitest.config.ts`
- Modify: `package.json` (scripts + devDependencies)

**Interfaces:**
- Produces: pnpm scripts `dev`, `build`, `preview`, `test:unit`, `test:e2e`; a `.vitepress/dist` build served by `pnpm preview` on port 4173 (used by Playwright `webServer`).

- [ ] **Step 1: Remove scaffold example files and reset the home so the build has no dead links**

```bash
rm "api-examples.md" "markdown-examples.md"
```

Overwrite `index.md` with a minimal valid page (Task 4/6 build the real hero on top of this). This keeps `pnpm build` green from now on, which every later task's Playwright `webServer` depends on:

```md
---
title: Mauricio Rodriguez
---

# Mauricio Rodriguez

Portafolio en construcción.
```

- [ ] **Step 2: Create `.gitignore`**

```gitignore
node_modules/
.vitepress/dist/
.vitepress/cache/
test-results/
playwright-report/
.DS_Store
*.log
```

- [ ] **Step 3: Add dependencies**

```bash
pnpm add -D @fontsource/inter @fontsource/jetbrains-mono vitest @playwright/test wrangler
pnpm exec playwright install chromium
```

- [ ] **Step 4: Update `package.json` scripts**

Merge these into the `scripts` block (keep `dev`/`build`/`preview`):

```json
{
  "scripts": {
    "dev": "vitepress dev",
    "build": "vitepress build",
    "preview": "vitepress preview --port 4173",
    "test:unit": "vitest run",
    "test:e2e": "playwright test",
    "test": "pnpm test:unit && pnpm test:e2e"
  }
}
```

- [ ] **Step 5: Create `vitest.config.ts`** (scope unit tests so they don't collide with Playwright)

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node'
  }
})
```

- [ ] **Step 6: Create `playwright.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  webServer: {
    command: 'pnpm build && pnpm preview',
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000
  },
  use: { baseURL: 'http://localhost:4173' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
})
```

- [ ] **Step 7: Verify install + build works (green baseline)**

Run: `pnpm build`
Expected: **success**, no dead-link warnings (examples deleted, `index.md` reset in Step 1). This green build is the baseline every later task relies on.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: clean scaffold, add fonts/test/deploy tooling"
```

---

### Task 2: Theme extension + Create Mod design tokens

**Files:**
- Create: `.vitepress/theme/index.ts`
- Create: `.vitepress/theme/custom.css`
- Create: `tests/e2e/theme.spec.ts`

**Interfaces:**
- Produces: a theme module `export default { extends: DefaultTheme, enhanceApp }` that later tasks extend to register components; CSS custom properties `--vp-c-brand-1/2/3`, `--vp-c-bg`, etc. set to the palette; utility classes `.cm-kinetic-divider`, `.no-print`.

- [ ] **Step 1: Write the failing test** — `tests/e2e/theme.spec.ts`

```ts
import { test, expect } from '@playwright/test'

async function brand(page) {
  return page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--vp-c-brand-1').trim()
  )
}

test('bronze accent applies in dark and light modes', async ({ page }) => {
  await page.goto('/')
  // Force dark
  await page.evaluate(() => document.documentElement.classList.add('dark'))
  expect((await brand(page)).toLowerCase()).toBe('#c8a05a')
  // Force light
  await page.evaluate(() => document.documentElement.classList.remove('dark'))
  expect((await brand(page)).toLowerCase()).toBe('#a9762f')
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test:e2e theme.spec.ts`
Expected: FAIL — the `--vp-c-brand-1` var is still VitePress's default green (no `custom.css` yet). The build itself is green (Task 1 reset `index.md`), so the `webServer` starts fine.

- [ ] **Step 3: Create `.vitepress/theme/custom.css`** (fonts are imported from JS in Step 4, not here)

```css
/* ---- Light (default) ---- */
:root {
  --vp-c-bg: #f4ecd8;
  --vp-c-bg-alt: #eaddc2;
  --vp-c-bg-soft: #efe4cd;
  --vp-c-bg-elv: #efe4cd;

  --vp-c-text-1: #2a1e14;
  --vp-c-text-2: #6b5a42;
  --vp-c-text-3: #8a785c;

  --vp-c-divider: #c9a86f;
  --vp-c-border: #c9a86f;
  --vp-c-gutter: #d9c69a;

  --vp-c-brand-1: #a9762f;   /* bronze — links/primary text */
  --vp-c-brand-2: #b0562a;   /* copper — hover */
  --vp-c-brand-3: #a9762f;   /* button bg */
  --vp-c-brand-soft: rgba(169, 118, 47, 0.16);

  --cm-brown: #6b4f34;
  --cm-copper: #b0562a;

  --vp-font-family-base: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --vp-font-family-mono: 'JetBrains Mono', ui-monospace, 'Cascadia Code', monospace;

  /* home hero */
  --vp-home-hero-name-color: var(--vp-c-brand-1);
  --vp-button-brand-bg: var(--vp-c-brand-3);
  --vp-button-brand-hover-bg: var(--vp-c-brand-2);
  --vp-button-brand-border: var(--vp-c-brand-3);
}

/* ---- Dark ---- */
.dark {
  --vp-c-bg: #17120d;
  --vp-c-bg-alt: #1f1710;
  --vp-c-bg-soft: #241a12;
  --vp-c-bg-elv: #241a12;

  --vp-c-text-1: #f0e6d2;
  --vp-c-text-2: #c9b89a;
  --vp-c-text-3: #9c8b6f;

  --vp-c-divider: #5c4326;
  --vp-c-border: #5c4326;
  --vp-c-gutter: #2a1f16;

  --vp-c-brand-1: #c8a05a;   /* bronze */
  --vp-c-brand-2: #c46a3f;   /* copper */
  --vp-c-brand-3: #c8a05a;
  --vp-c-brand-soft: rgba(200, 160, 90, 0.18);

  --cm-brown: #3d2b1f;
  --cm-copper: #c46a3f;
}

/* Kinetic bronze divider */
.cm-kinetic-divider {
  height: 3px;
  border: 0;
  margin: 2.5rem 0;
  background: repeating-linear-gradient(
    90deg,
    var(--vp-c-brand-1) 0 14px,
    transparent 14px 22px
  );
  opacity: 0.7;
}

.no-print { }
```

- [ ] **Step 4: Create `.vitepress/theme/index.ts`** (imports the self-hosted fonts + tokens)

```ts
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import './custom.css'

export default {
  extends: DefaultTheme
  // components registered in later tasks
} satisfies Theme
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `pnpm test:e2e theme.spec.ts`
Expected: PASS (both assertions).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(theme): Create Mod palette + Default Theme extension"
```

---

### Task 3: Bilingual site config (locales, nav, sidebar)

**Files:**
- Modify: `.vitepress/config.mts`

**Interfaces:**
- Produces: `locales.root` (ES, `lang: 'es-CO'`) and `locales.en` (EN, `link: '/en/'`, `lang: 'en'`), each with its own `nav`; shared `socialLinks` (GitHub `marr-cloud`); `cleanUrls: true`. Establishes the routes `/`, `/proyectos`, `/sobre-mi`, `/stack` and their `/en/...` mirrors that later tasks fill with content.

- [ ] **Step 1: Replace `.vitepress/config.mts`**

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  cleanUrls: true,
  lang: 'es-CO',
  title: 'Mauricio Rodriguez',
  description: 'DevOps Engineer — AWS, contenedores y automatización de despliegues.',
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'author', content: 'Mauricio Rodriguez' }]
  ],
  themeConfig: {
    socialLinks: [{ icon: 'github', link: 'https://github.com/marr-cloud' }],
    search: { provider: 'local' }
  },
  locales: {
    root: {
      label: 'Español',
      lang: 'es-CO',
      themeConfig: {
        nav: [
          { text: 'Inicio', link: '/' },
          { text: 'Proyectos', link: '/proyectos' },
          { text: 'Stack', link: '/stack' },
          { text: 'Sobre mí', link: '/sobre-mi' }
        ]
      }
    },
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Projects', link: '/en/proyectos' },
          { text: 'Stack', link: '/en/stack' },
          { text: 'About', link: '/en/sobre-mi' }
        ]
      }
    }
  }
})
```

> Note: EN slugs stay `proyectos`/`sobre-mi`/`stack` to keep mirrors 1:1 with ES files; only the nav labels are translated. This is intentional and keeps routing simple.

- [ ] **Step 2: Verify config compiles**

Run: `pnpm exec vitepress build 2>&1 | head -40`
Expected: config loads (may still warn about missing `/en/` pages / dead links — those pages arrive in Tasks 6–7). No config/syntax errors.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(config): bilingual locales, nav, local search"
```

---

### Task 4: Decorative gear + hero component

**Files:**
- Create: `.vitepress/theme/components/Gear.vue`
- Create: `.vitepress/theme/components/HeroCreate.vue`
- Modify: `.vitepress/theme/index.ts` (register both)
- Modify: `tests/e2e/theme.spec.ts` (add reduced-motion test)

**Interfaces:**
- Consumes: theme registration from Task 2.
- Produces: global components `<Gear :size :teeth :speed />` (decorative, `aria-hidden`, `class="cm-gear"`) and `<HeroCreate name role tagline ctaText ctaLink altText altLink />` for use in home Markdown (Task 6).

- [ ] **Step 1: Write the failing reduced-motion test** — append to `tests/e2e/theme.spec.ts`

```ts
test('hero gear does not animate under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const gear = page.locator('.cm-gear').first()
  await expect(gear).toBeVisible()
  const anim = await gear.evaluate((el) => getComputedStyle(el).animationName)
  expect(anim).toBe('none')
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test:e2e theme.spec.ts`
Expected: FAIL — no `.cm-gear` element on the page yet.

- [ ] **Step 3: Create `Gear.vue`**

```vue
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
```

- [ ] **Step 4: Create `HeroCreate.vue`**

```vue
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
```

- [ ] **Step 5: Register components** — replace `.vitepress/theme/index.ts`

```ts
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Gear from './components/Gear.vue'
import HeroCreate from './components/HeroCreate.vue'
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Gear', Gear)
    app.component('HeroCreate', HeroCreate)
  }
} satisfies Theme
```

> Later tasks add more components to this `enhanceApp` block; keep the font + css imports at the top.

- [ ] **Step 6: Add a temporary hero to `index.md` so the test can find `.cm-gear`**

Replace `index.md` with (Task 6 finalizes copy):

```md
---
layout: page
---

<HeroCreate
  role="DevOps Engineer · Barranquilla, CO"
  name="Mauricio Rodriguez"
  tagline="Automatizo infraestructura en AWS y despliego contenedores como quien arma una fábrica de engranajes."
  ctaText="Ver proyectos" ctaLink="/proyectos"
  altText="Sobre mí" altLink="/sobre-mi" />
```

- [ ] **Step 7: Run the reduced-motion + accent tests to verify they pass**

Run: `pnpm test:e2e theme.spec.ts`
Expected: PASS (all 3 tests).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(theme): gear + Create Mod hero components"
```

---

### Task 5: Projects data + project components

**Files:**
- Create: `.vitepress/data/projects.ts`
- Create: `.vitepress/theme/components/TechChip.vue`
- Create: `.vitepress/theme/components/ProjectCard.vue`
- Create: `.vitepress/theme/components/ProjectGrid.vue`
- Modify: `.vitepress/theme/index.ts` (register the 3 components)
- Create: `tests/unit/projects.test.ts`

**Interfaces:**
- Produces:
  - `interface Project { name: string; repo: string; language: string; description: string; description_en: string; tags: string[]; featured: boolean }`
  - `export const projects: Project[]`
  - `<TechChip :label="string" />`
  - `<ProjectCard :project="Project" />` (auto-localizes description via `useData().lang`)
  - `<ProjectGrid :featuredOnly="boolean" />` (renders cards + tag filter buttons)

- [ ] **Step 1: Write the failing unit test** — `tests/unit/projects.test.ts`

```ts
import { describe, it, expect } from 'vitest'
import { projects } from '../../.vitepress/data/projects'

describe('projects data', () => {
  it('has at least 10 curated projects', () => {
    expect(projects.length).toBeGreaterThanOrEqual(10)
  })
  it('has 5 or 6 featured projects for the home page', () => {
    const featured = projects.filter((p) => p.featured)
    expect(featured.length).toBeGreaterThanOrEqual(5)
    expect(featured.length).toBeLessThanOrEqual(6)
  })
  it('every project is well-formed', () => {
    for (const p of projects) {
      expect(p.name).toBeTruthy()
      expect(p.repo).toMatch(/^https:\/\/github\.com\/marr-cloud\//)
      expect(p.language).toBeTruthy()
      expect(p.description).toBeTruthy()
      expect(p.description_en).toBeTruthy()
      expect(Array.isArray(p.tags)).toBe(true)
      expect(p.tags.length).toBeGreaterThan(0)
    }
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test:unit`
Expected: FAIL — cannot resolve `../../.vitepress/data/projects`.

- [ ] **Step 3: Create `.vitepress/data/projects.ts`**

```ts
export interface Project {
  name: string
  repo: string
  language: string
  description: string
  description_en: string
  tags: string[]
  featured: boolean
}

export const projects: Project[] = [
  {
    name: 'kiro-gateway-go',
    repo: 'https://github.com/marr-cloud/kiro-gateway-go',
    language: 'Go',
    description: 'Proxy OpenAI/Anthropic de binario único para Kiro. Port en Go de jwadow/kiro-gateway.',
    description_en: 'Single-binary OpenAI/Anthropic proxy for Kiro. Go port of jwadow/kiro-gateway.',
    tags: ['go', 'proxy', 'cli'],
    featured: true
  },
  {
    name: 'scurl-mngr',
    repo: 'https://github.com/marr-cloud/scurl-mngr',
    language: 'PowerShell',
    description: 'CLI para gestionar instalaciones de static-curl en Windows.',
    description_en: 'CLI to manage static-curl installations on Windows.',
    tags: ['cli', 'windows'],
    featured: true
  },
  {
    name: 'ofetch-action',
    repo: 'https://github.com/marr-cloud/ofetch-action',
    language: 'TypeScript',
    description: 'GitHub Action para requests HTTP con ofetch: multipart, reintentos, auth y manejo de respuestas.',
    description_en: 'GitHub Action for HTTP requests powered by ofetch: multipart, retries, auth and response handling.',
    tags: ['ci-cd', 'github-actions'],
    featured: true
  },
  {
    name: 'cloudflare-workers-template',
    repo: 'https://github.com/marr-cloud/cloudflare-workers-template',
    language: 'TypeScript',
    description: 'Starter de Cloudflare Workers con TypeScript, Vitest en workerd, oxlint, Prettier y CI verde desde el primer clon.',
    description_en: 'Production-minded Cloudflare Workers starter: TypeScript, Vitest in workerd, oxlint, Prettier and CI — green from the first clone.',
    tags: ['cloudflare', 'template', 'ci-cd'],
    featured: true
  },
  {
    name: 'ch-utils',
    repo: 'https://github.com/marr-cloud/ch-utils',
    language: 'Rust',
    description: 'chmod/chown estilo POSIX para Windows: traduce rwx a ACLs NTFS reales.',
    description_en: 'POSIX-style chmod/chown for Windows: translate rwx into real NTFS ACLs.',
    tags: ['rust', 'windows', 'cli'],
    featured: true
  },
  {
    name: 'serve',
    repo: 'https://github.com/marr-cloud/serve',
    language: 'Go',
    description: 'Servidor de archivos estáticos compatible con la CLI `serve` de npm, escrito en Go.',
    description_en: 'Static file server compatible with the npm `serve` CLI, implemented in Go.',
    tags: ['go', 'cli'],
    featured: false
  },
  {
    name: 'identicon',
    repo: 'https://github.com/marr-cloud/identicon',
    language: 'Rust',
    description: 'Implementación en Rust (binario y librería) del algoritmo de identicon de GitHub.',
    description_en: 'Rust binary and library implementation of the GitHub identicon algorithm.',
    tags: ['rust', 'lib'],
    featured: false
  },
  {
    name: 'cors-test',
    repo: 'https://github.com/marr-cloud/cors-test',
    language: 'TypeScript',
    description: 'Probador de cabeceras CORS desplegado como Cloudflare Worker.',
    description_en: 'CORS header tester running as a Cloudflare Worker.',
    tags: ['cloudflare', 'tooling'],
    featured: false
  },
  {
    name: 'github-profile-trophy',
    repo: 'https://github.com/marr-cloud/github-profile-trophy',
    language: 'TypeScript',
    description: 'Port Nitro vendor-agnostic de github-profile-trophy: desplegable a Cloudflare, Vercel, Deno o Node.',
    description_en: 'Vendor-agnostic Nitro port of github-profile-trophy: deployable to Cloudflare, Vercel, Deno or Node.',
    tags: ['nitro', 'cloudflare'],
    featured: false
  },
  {
    name: 'Keycloak-ECS',
    repo: 'https://github.com/marr-cloud/Keycloak-ECS',
    language: 'Docker',
    description: 'Guía para desplegar Keycloak en AWS ECS con Fargate.',
    description_en: 'Guide to deploy Keycloak on AWS ECS with Fargate.',
    tags: ['aws', 'ecs', 'docker'],
    featured: false
  },
  {
    name: 'geoip',
    repo: 'https://github.com/marr-cloud/geoip',
    language: 'TypeScript',
    description: 'Cloudflare Worker que devuelve la ubicación del usuario a partir de su IP.',
    description_en: 'A simple Cloudflare Worker that returns the user location from their IP.',
    tags: ['cloudflare'],
    featured: false
  },
  {
    name: 'stellar-debris',
    repo: 'https://github.com/marr-cloud/stellar-debris',
    language: 'TypeScript',
    description: 'Playground HTTP compatible con httpbin sobre Cloudflare Workers (Hono).',
    description_en: 'httpbin-compatible HTTP testing playground on Cloudflare Workers (Hono).',
    tags: ['cloudflare', 'hono'],
    featured: false
  }
]
```

- [ ] **Step 4: Run the unit test to verify it passes**

Run: `pnpm test:unit`
Expected: PASS (3 tests). 12 projects, 5 featured.

- [ ] **Step 5: Create `TechChip.vue`**

```vue
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
```

- [ ] **Step 6: Create `ProjectCard.vue`**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import type { Project } from '../../data/projects'
import TechChip from './TechChip.vue'

const props = defineProps<{ project: Project }>()
const { lang } = useData()
const isEn = computed(() => lang.value.startsWith('en'))
const desc = computed(() => (isEn.value ? props.project.description_en : props.project.description))
</script>

<template>
  <a class="cm-card" :href="project.repo" target="_blank" rel="noopener">
    <span class="cm-card__rivet" aria-hidden="true"></span>
    <h3 class="cm-card__name">{{ project.name }}</h3>
    <p class="cm-card__desc">{{ desc }}</p>
    <div class="cm-card__tags">
      <TechChip :label="project.language" />
      <TechChip v-for="t in project.tags" :key="t" :label="t" />
    </div>
  </a>
</template>

<style scoped>
.cm-card {
  position: relative;
  display: block;
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
.cm-card__name { font-family: var(--vp-font-family-mono); margin: 0 0 0.4rem; font-size: 1.05rem; color: var(--vp-c-brand-1); }
.cm-card__desc { margin: 0 0 0.8rem; color: var(--vp-c-text-2); font-size: 0.92rem; line-height: 1.5; }
.cm-card__tags { display: flex; flex-wrap: wrap; gap: 0.35rem; }
</style>
```

- [ ] **Step 7: Create `ProjectGrid.vue`**

```vue
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
```

- [ ] **Step 8: Register the 3 components** — update `enhanceApp` in `.vitepress/theme/index.ts`

Add imports and registrations alongside Gear/HeroCreate:

```ts
import TechChip from './components/TechChip.vue'
import ProjectCard from './components/ProjectCard.vue'
import ProjectGrid from './components/ProjectGrid.vue'
// ...inside enhanceApp({ app }):
app.component('TechChip', TechChip)
app.component('ProjectCard', ProjectCard)
app.component('ProjectGrid', ProjectGrid)
```

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat(projects): curated data + card/grid/chip components"
```

---

### Task 6: Stack component + Spanish content pages

**Files:**
- Create: `.vitepress/data/stack.ts`
- Create: `.vitepress/theme/components/TechStack.vue`
- Modify: `.vitepress/theme/index.ts` (register TechStack)
- Modify: `index.md` (finalize ES home)
- Create: `proyectos.md`, `stack.md`, `sobre-mi.md`
- Create: `public/favicon.svg`
- Create: `tests/e2e/responsive.spec.ts`

**Interfaces:**
- Consumes: `HeroCreate`, `ProjectGrid`, `TechChip` (Tasks 4–5).
- Produces: `<TechStack />` (renders grouped chips from `stack.ts`, headings localized); `interface StackGroup { title: string; title_en: string; items: string[] }` + `export const stack: StackGroup[]`; the four ES routes fully rendered.

- [ ] **Step 1: Write the failing responsive test** — `tests/e2e/responsive.spec.ts`

```ts
import { test, expect } from '@playwright/test'

for (const path of ['/', '/proyectos']) {
  test(`no horizontal overflow at 375px on ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto(path)
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    )
    expect(overflow).toBeLessThanOrEqual(1) // allow sub-pixel rounding
  })
}
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test:e2e responsive.spec.ts`
Expected: FAIL — `/proyectos` doesn't exist yet (or build dead-link error).

- [ ] **Step 3: Create `.vitepress/data/stack.ts`**

```ts
export interface StackGroup {
  title: string
  title_en: string
  items: string[]
}

export const stack: StackGroup[] = [
  { title: 'Cloud (AWS)', title_en: 'Cloud (AWS)',
    items: ['VPC', 'ALB', 'CloudFront', 'Route 53', 'WAF', 'Aurora', 'ECS Fargate', 'Lambda'] },
  { title: 'Contenedores', title_en: 'Containers',
    items: ['Docker', 'Docker Compose', 'Kubernetes', 'ECS Fargate'] },
  { title: 'CI/CD', title_en: 'CI/CD',
    items: ['GitHub Actions', 'Pipelines multi-entorno'] },
  { title: 'IaC & Scripting', title_en: 'IaC & Scripting',
    items: ['Bash', 'PowerShell', 'Automatización de infraestructura'] },
  { title: 'Observabilidad', title_en: 'Monitoring',
    items: ['Prometheus', 'Grafana', 'CloudWatch', 'Amazon Managed Prometheus'] },
  { title: 'Bases de datos', title_en: 'Databases',
    items: ['PostgreSQL', 'RDS', 'Aurora', 'LibSQL/Turso', 'Redis/MemoryDB', 'RabbitMQ'] },
  { title: 'Web', title_en: 'Web',
    items: ['Hono', 'Astro', 'Vue/Nuxt', 'Tailwind CSS', 'Cloudflare Workers'] },
  { title: 'Lenguajes', title_en: 'Languages',
    items: ['TypeScript', 'Go', 'Rust', 'Shell'] },
  { title: 'Identidad', title_en: 'Identity',
    items: ['Keycloak'] }
]
```

- [ ] **Step 4: Create `TechStack.vue`**

```vue
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
```

- [ ] **Step 5: Register TechStack** — add to `.vitepress/theme/index.ts` imports + `enhanceApp`:

```ts
import TechStack from './components/TechStack.vue'
// inside enhanceApp:
app.component('TechStack', TechStack)
```

- [ ] **Step 6: Create `public/favicon.svg`** (a bronze gear)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" rx="16" fill="#17120d"/>
  <g fill="#c8a05a" transform="translate(50 50)">
    <g>
      <rect x="-5" y="-47" width="10" height="18" rx="2"/>
      <rect x="-5" y="-47" width="10" height="18" rx="2" transform="rotate(45)"/>
      <rect x="-5" y="-47" width="10" height="18" rx="2" transform="rotate(90)"/>
      <rect x="-5" y="-47" width="10" height="18" rx="2" transform="rotate(135)"/>
      <rect x="-5" y="-47" width="10" height="18" rx="2" transform="rotate(180)"/>
      <rect x="-5" y="-47" width="10" height="18" rx="2" transform="rotate(225)"/>
      <rect x="-5" y="-47" width="10" height="18" rx="2" transform="rotate(270)"/>
      <rect x="-5" y="-47" width="10" height="18" rx="2" transform="rotate(315)"/>
    </g>
    <circle r="34"/>
  </g>
  <circle cx="50" cy="50" r="12" fill="#17120d"/>
</svg>
```

- [ ] **Step 7: Finalize `index.md` (ES home)**

```md
---
layout: page
title: Mauricio Rodriguez — DevOps Engineer
---

<HeroCreate
  role="DevOps Engineer · Barranquilla, CO"
  name="Mauricio Rodriguez"
  tagline="Automatizo infraestructura en AWS y despliego contenedores como quien arma una fábrica de engranajes: cada pieza engrana con la siguiente."
  ctaText="Ver proyectos" ctaLink="/proyectos"
  altText="Descargar CV" altLink="/sobre-mi" />

<div class="cm-home">

<hr class="cm-kinetic-divider" />

## Proyectos destacados

<ProjectGrid :featuredOnly="true" />

<hr class="cm-kinetic-divider" />

## Certificaciones

- **AWS Solutions Architect – Associate** (SAA-C03)
- **AWS Cloud Practitioner** (CLF-C02)

</div>

<style>
.cm-home { max-width: 1152px; margin: 0 auto; padding: 0 24px 4rem; }
</style>
```

- [ ] **Step 8: Create `proyectos.md`**

```md
---
title: Proyectos
---

# Proyectos

Herramientas y experimentos que construyo — CLIs, Workers en el edge y automatización. Todo el código está en [GitHub](https://github.com/marr-cloud).

<ProjectGrid />
```

- [ ] **Step 9: Create `stack.md`**

```md
---
title: Stack
---

# Stack técnico

Las herramientas con las que trabajo a diario para diseñar, desplegar y operar infraestructura.

<TechStack />
```

- [ ] **Step 10: Create `sobre-mi.md`** (CV content; the print button + `.cv-sheet` styling arrive in Task 8)

```md
---
title: Sobre mí
---

<div class="cv-sheet">

# Mauricio Rodriguez

**DevOps Engineer** · Barranquilla, Colombia
[github.com/marr-cloud](https://github.com/marr-cloud) · [maurrod.dev](https://maurrod.dev)

## Perfil

DevOps Engineer en **ADO-TECH**. Diseño y opero entornos AWS multi-cuenta, clústeres ECS Fargate y despliegues de cara al cliente. Construyo pipelines de CI/CD que funcionan de verdad y automatizo todo lo que se pueda automatizar.

## Certificaciones

- **AWS Solutions Architect – Associate** (SAA-C03)
- **AWS Cloud Practitioner** (CLF-C02)

## Experiencia

### DevOps Engineer — ADO-TECH
Gestión de entornos AWS multi-cuenta, clústeres Fargate y despliegues de cara al cliente. VPC, ALB, CloudFront, Route 53, WAF, Aurora, Lambda. Contenedores con Docker y Kubernetes. CI/CD con GitHub Actions. Observabilidad con Prometheus, Grafana y CloudWatch.

## Habilidades

**Cloud:** AWS (VPC · ALB · CloudFront · Route 53 · WAF · Aurora · ECS Fargate · Lambda)
**Contenedores:** Docker · Docker Compose · Kubernetes
**CI/CD:** GitHub Actions · pipelines multi-entorno
**Lenguajes:** TypeScript · Go · Rust · Bash · PowerShell
**Datos:** PostgreSQL · RDS · Aurora · Turso · Redis · RabbitMQ
**Identidad:** Keycloak

</div>
```

- [ ] **Step 11: Run the responsive test + build to verify they pass**

Run: `pnpm test:e2e responsive.spec.ts`
Expected: PASS both. (This runs `pnpm build` via `webServer`, so a green run also proves the ES pages build with no dead links.)

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat(content): ES pages, stack component, favicon, home"
```

---

### Task 7: English mirror pages + i18n navigation test

**Files:**
- Create: `en/index.md`, `en/proyectos.md`, `en/stack.md`, `en/sobre-mi.md`
- Create: `tests/e2e/i18n.spec.ts`

**Interfaces:**
- Consumes: same components (auto-localize via `useData().lang`), locale config from Task 3.
- Produces: `/en/`, `/en/proyectos`, `/en/stack`, `/en/sobre-mi`.

- [ ] **Step 1: Write the failing i18n test** — `tests/e2e/i18n.spec.ts`

```ts
import { test, expect } from '@playwright/test'

test('English home renders and localizes', async ({ page }) => {
  await page.goto('/en/')
  await expect(page.locator('.cm-hero__name')).toHaveText('Mauricio Rodriguez')
  await expect(page.locator('.cm-hero__role')).toContainText('DevOps Engineer')
  // project card descriptions use the English text
  await page.goto('/en/proyectos')
  await expect(page.locator('.cm-card__desc').first()).toContainText(/proxy|Worker|CLI|starter|POSIX/i)
})

test('locale switch link exists from ES to EN', async ({ page }) => {
  await page.goto('/en/proyectos')
  await expect(page).toHaveURL(/\/en\/proyectos/)
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test:e2e i18n.spec.ts`
Expected: FAIL — `/en/` pages 404.

- [ ] **Step 3: Create `en/index.md`**

```md
---
layout: page
title: Mauricio Rodriguez — DevOps Engineer
---

<HeroCreate
  role="DevOps Engineer · Barranquilla, CO"
  name="Mauricio Rodriguez"
  tagline="I automate AWS infrastructure and ship containers the way you'd build a factory of gears — every part meshes with the next."
  ctaText="View projects" ctaLink="/en/proyectos"
  altText="Download CV" altLink="/en/sobre-mi" />

<div class="cm-home">

<hr class="cm-kinetic-divider" />

## Featured projects

<ProjectGrid :featuredOnly="true" />

<hr class="cm-kinetic-divider" />

## Certifications

- **AWS Solutions Architect – Associate** (SAA-C03)
- **AWS Cloud Practitioner** (CLF-C02)

</div>

<style>
.cm-home { max-width: 1152px; margin: 0 auto; padding: 0 24px 4rem; }
</style>
```

- [ ] **Step 4: Create `en/proyectos.md`**

```md
---
title: Projects
---

# Projects

Tools and experiments I build — CLIs, edge Workers and automation. All the code lives on [GitHub](https://github.com/marr-cloud).

<ProjectGrid />
```

- [ ] **Step 5: Create `en/stack.md`**

```md
---
title: Stack
---

# Tech stack

The tools I work with day to day to design, deploy and operate infrastructure.

<TechStack />
```

- [ ] **Step 6: Create `en/sobre-mi.md`**

```md
---
title: About
---

<div class="cv-sheet">

# Mauricio Rodriguez

**DevOps Engineer** · Barranquilla, Colombia
[github.com/marr-cloud](https://github.com/marr-cloud) · [maurrod.dev](https://maurrod.dev)

## Profile

DevOps Engineer at **ADO-TECH**. I design and operate multi-account AWS environments, ECS Fargate clusters and client-facing deployments. I build CI/CD pipelines that actually work and automate everything that can be automated.

## Certifications

- **AWS Solutions Architect – Associate** (SAA-C03)
- **AWS Cloud Practitioner** (CLF-C02)

## Experience

### DevOps Engineer — ADO-TECH
Managing multi-account AWS environments, Fargate clusters and client-facing deployments. VPC, ALB, CloudFront, Route 53, WAF, Aurora, Lambda. Containers with Docker and Kubernetes. CI/CD with GitHub Actions. Observability with Prometheus, Grafana and CloudWatch.

## Skills

**Cloud:** AWS (VPC · ALB · CloudFront · Route 53 · WAF · Aurora · ECS Fargate · Lambda)
**Containers:** Docker · Docker Compose · Kubernetes
**CI/CD:** GitHub Actions · multi-environment pipelines
**Languages:** TypeScript · Go · Rust · Bash · PowerShell
**Data:** PostgreSQL · RDS · Aurora · Turso · Redis · RabbitMQ
**Identity:** Keycloak

</div>
```

- [ ] **Step 7: Run the i18n test to verify it passes**

Run: `pnpm test:e2e i18n.spec.ts`
Expected: PASS both.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(i18n): English mirror pages"
```

---

### Task 8: CV print stylesheet + download button

**Files:**
- Create: `.vitepress/theme/styles/print.css`
- Create: `.vitepress/theme/components/CvActions.vue`
- Modify: `.vitepress/theme/index.ts` (import print.css, register CvActions)
- Modify: `sobre-mi.md`, `en/sobre-mi.md` (add `<CvActions />`)
- Create: `tests/e2e/cv-print.spec.ts`

**Interfaces:**
- Consumes: `.cv-sheet` wrapper (Tasks 6–7).
- Produces: `<CvActions label="..." />` button (`class="no-print"`, calls `window.print()`); print rules hiding site chrome.

- [ ] **Step 1: Write the failing print test** — `tests/e2e/cv-print.spec.ts`

```ts
import { test, expect } from '@playwright/test'

test('print media hides site chrome and shows the CV sheet', async ({ page }) => {
  await page.goto('/sobre-mi')
  await page.emulateMedia({ media: 'print' })
  await expect(page.locator('.cv-sheet')).toBeVisible()
  // Navbar hidden in print
  const navDisplay = await page.locator('.VPNav').first().evaluate(
    (el) => getComputedStyle(el).display
  ).catch(() => 'none')
  expect(navDisplay).toBe('none')
  // Download button hidden in print
  const btn = page.locator('.cm-cv-btn')
  await expect(btn).toHaveCount(1)
  const btnDisplay = await btn.evaluate((el) => getComputedStyle(el).display)
  expect(btnDisplay).toBe('none')
})

test('download button is visible on screen', async ({ page }) => {
  await page.goto('/sobre-mi')
  await expect(page.locator('.cm-cv-btn')).toBeVisible()
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test:e2e cv-print.spec.ts`
Expected: FAIL — no `.cm-cv-btn`, chrome not hidden in print.

- [ ] **Step 3: Create `.vitepress/theme/components/CvActions.vue`**

```vue
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
```

- [ ] **Step 4: Create `.vitepress/theme/styles/print.css`**

```css
@media print {
  /* Hide all site chrome */
  .VPNav, .VPLocalNav, .VPSidebar, .VPFooter, .VPDocFooter,
  .VPDocAsideOutline, .aside, .cm-gear, .cm-hero__gears,
  .no-print, .cm-cv-actions {
    display: none !important;
  }

  html, body, .VPContent, .VPDoc, .content, .container {
    background: #fff !important;
    color: #111 !important;
    margin: 0 !important;
    padding: 0 !important;
    max-width: none !important;
  }

  .cv-sheet {
    color: #111;
    font-size: 11pt;
    line-height: 1.4;
    max-width: 720px;
    margin: 0 auto;
  }
  .cv-sheet h1 { font-size: 20pt; margin: 0 0 2pt; }
  .cv-sheet h2 { font-size: 13pt; border-bottom: 1px solid #999; padding-bottom: 2pt; margin-top: 14pt; }
  .cv-sheet h3 { font-size: 11.5pt; margin: 8pt 0 2pt; }
  .cv-sheet a { color: #111 !important; text-decoration: none; }
  .cv-sheet section, .cv-sheet h2, .cv-sheet h3 { break-inside: avoid; }

  @page { size: A4; margin: 16mm 14mm; }
}
```

- [ ] **Step 5: Wire into theme** — update `.vitepress/theme/index.ts`

```ts
import CvActions from './components/CvActions.vue'
import './custom.css'
import './styles/print.css'
// inside enhanceApp:
app.component('CvActions', CvActions)
```

- [ ] **Step 6: Add the button to both CV pages**

In `sobre-mi.md`, immediately after `<div class="cv-sheet">` and before `# Mauricio Rodriguez`:

```md
<CvActions label="Descargar CV (PDF)" />
```

In `en/sobre-mi.md`, same spot:

```md
<CvActions label="Download CV (PDF)" />
```

- [ ] **Step 7: Run the print tests to verify they pass**

Run: `pnpm test:e2e cv-print.spec.ts`
Expected: PASS both.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(cv): print stylesheet + download-to-PDF button"
```

---

### Task 9: Cloudflare Pages deploy config + README + full verification

**Files:**
- Create: `wrangler.jsonc`
- Create: `.github/workflows/deploy.yml`
- Create: `README.md`

**Interfaces:**
- Consumes: build output `.vitepress/dist` (all prior tasks).
- Produces: deployable Cloudflare Pages config; documentation.

- [ ] **Step 1: Create `wrangler.jsonc`**

```jsonc
{
  "name": "portfolio",
  "compatibility_date": "2026-09-24",
  "pages_build_output_dir": ".vitepress/dist"
}
```

- [ ] **Step 2: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to Cloudflare Pages
on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - name: Deploy
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy .vitepress/dist --project-name=portfolio
```

- [ ] **Step 3: Create `README.md`**

```md
# maurrod.dev — Portafolio

Portafolio personal de Mauricio Rodriguez, construido con [VitePress](https://vitepress.dev) y un tema propio estilo *Create Mod* (marrón/bronce). Bilingüe (ES/EN).

## Desarrollo

```bash
pnpm install
pnpm dev            # servidor local
pnpm build          # build estático en .vitepress/dist
pnpm preview        # previsualiza el build (puerto 4173)
```

## Tests

```bash
pnpm test:unit      # datos de proyectos (Vitest)
pnpm test:e2e       # tema, i18n, impresión de CV, responsive (Playwright)
```

## CV en PDF

La página **Sobre mí** tiene un botón *Descargar CV (PDF)* que abre el diálogo de impresión con una hoja A4 limpia. Elige "Guardar como PDF".

## Deploy

Cloudflare Pages. Configura los secrets `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID` en el repo; cada push a `main` despliega vía GitHub Actions. Manualmente: `pnpm build && pnpm exec wrangler pages deploy .vitepress/dist --project-name=portfolio`.

## Editar contenido

- Proyectos: `.vitepress/data/projects.ts`
- Stack: `.vitepress/data/stack.ts`
- CV: `sobre-mi.md` y `en/sobre-mi.md`
```

- [ ] **Step 4: Full verification — unit + all e2e + clean build**

Run: `pnpm test:unit && pnpm test:e2e && pnpm build`
Expected: unit PASS; all e2e specs (theme, responsive, i18n, cv-print) PASS; build completes with **no dead-link warnings**.

- [ ] **Step 5: Manual smoke (documented, run by implementer)**

Run: `pnpm dev` and confirm in a browser:
- Home hero shows spinning gears (bronze), CTA buttons work.
- Theme toggle switches brown/parchment ↔ dark; bronze accent in both.
- Language switch (top-right) toggles ES ⇄ EN.
- `/proyectos` filter buttons narrow the grid.
- `/sobre-mi` → "Descargar CV" opens print dialog; preview is a clean A4 (no navbar/gears).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore(deploy): Cloudflare Pages config, CI workflow, README"
```

---

## Notes for the implementer

- **VitePress 2.0 alpha:** if a Default Theme selector (`.VPNav`, `.VPSidebar`, `.VPFooter`) has been renamed, adjust `print.css` and the `cv-print` test selectors together. Load the `vitepress` skill to confirm current class names.
- **`window` in SSR:** never reference `window` at module top level — only inside event handlers or `onMounted`. `CvActions.vue` already guards with `typeof window !== 'undefined'`.
- **Data edits** don't need code changes: editing `.vitepress/data/projects.ts` / `stack.ts` and rebuilding is enough. Keep `featured` between 5 and 6 items (unit test enforces this).
- **Playwright first run** downloads Chromium (Task 1 step 3). In CI, add `pnpm exec playwright install --with-deps chromium`.
