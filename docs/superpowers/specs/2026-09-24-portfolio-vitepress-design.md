# Portafolio personal — VitePress + tema "Create Mod" — Diseño

- **Fecha:** 2026-09-24
- **Autor:** Mauricio Rodriguez (marr-cloud)
- **Estado:** Aprobado el diseño en chat; pendiente revisión del spec escrito.

## 1. Intención y contexto

Mauricio Rodriguez es **DevOps Engineer** en ADO-TECH (Barranquilla, Colombia), con
certificaciones AWS SAA-C03 y CLF-C02. Quiere un **portafolio personal** que:

1. Refleje su perfil (cloud/DevOps/automatización) con una identidad visual propia
   inspirada en el **Create Mod de Minecraft**: marrón cálido + acento bronce/latón,
   estética industrial-rústica de "engranajes que despliegan cosas".
2. Muestre sus proyectos reales de GitHub y su stack técnico.
3. Permita **descargar su CV en PDF** desde el propio sitio.

El sitio será **bilingüe (ES raíz + EN en `/en/`)** y se desplegará en **Cloudflare Pages**
sobre su dominio `maurrod.dev`.

**Éxito =** sitio VitePress que compila sin errores, con tema Create Mod aplicado en
claro/oscuro, 4 secciones por idioma, proyectos curados renderizados desde un data
loader, y una página de CV que genera un PDF limpio A4 vía `window.print()`.

### Decisiones tomadas en brainstorming
- Idioma: **Bilingüe** (ES raíz, EN `/en/`) con `locales` de VitePress.
- CV → PDF: **botón `window.print()`** + hoja de estilo `@media print` (sin dependencias de build).
- Secciones: **Home, Proyectos, Sobre mí/CV, Stack**.
- Deploy: **Cloudflare Pages**.
- Tema: **extender el Default Theme** (no tema desde cero).
- Proyectos: **lista curada** en un data loader, sembrada con repos reales.

## 2. Objetivos y no-objetivos

**Objetivos**
- Tema Create Mod reutilizable vía CSS variables + pocos componentes Vue.
- 4 secciones × 2 idiomas, navegables, responsive y con toggle claro/oscuro.
- Galería de proyectos con filtro por lenguaje/tema desde datos curados.
- Página CV imprimible a PDF A4.
- Config de build/deploy para Cloudflare Pages y repo git inicializado.

**No-objetivos (YAGNI)**
- Blog, formulario de contacto, comentarios, analytics.
- Llamadas en vivo a la API de GitHub en runtime/build.
- Librerías de animación externas (GSAP, Framer, etc.).
- Tema Vue construido desde cero (se extiende el Default Theme).

## 3. Arquitectura

### 3.1 Estrategia de tema (Enfoque A — extender Default Theme)
`.vitepress/theme/index.ts` extiende `DefaultTheme`, importa `custom.css` (tokens y
overrides) y registra componentes globales. Se conservan navbar, sidebar, búsqueda,
i18n y responsive del tema por defecto; solo se re-pinta y se añaden bloques visuales.

```
.vitepress/
  config.mts            # site config + locales (ES/EN) + nav/sidebar por locale
  theme/
    index.ts            # extends DefaultTheme, registra componentes, importa css
    custom.css          # design tokens (light/dark) + overrides del default theme
    components/
      HeroCreate.vue    # hero de la home con engranaje SVG animado
      ProjectCard.vue   # tarjeta "placa metálica" de proyecto
      ProjectGrid.vue   # grid + filtros por tag/lenguaje
      TechChip.vue      # chip monospace de tecnología
      TechStack.vue     # agrupa chips por categoría
      Gear.vue          # engranaje SVG reutilizable (decorativo, aria-hidden)
    styles/
      print.css         # @media print para el CV (A4)
  data/
    projects.data.ts    # data loader: lista curada de proyectos
```

### 3.2 Datos de proyectos (data loader)
`data/projects.data.ts` exporta, vía `defineLoader` de VitePress, un arreglo estático
de proyectos curados. Cada item:

```ts
interface Project {
  name: string
  repo: string          // URL a github.com/marr-cloud/<repo>
  description: string    // curada (ES) — el loader también puede llevar description_en
  description_en: string
  language: string       // "Go" | "TypeScript" | "Rust" | ...
  tags: string[]         // ["cli","cloudflare","devops","aws",...]
  featured: boolean      // aparece en la home
}
```

Semilla inicial (curada de sus repos reales; editable después):
- **kiro-gateway-go** (Go) — proxy OpenAI/Anthropic de binario único para Kiro. tags: go, cli, proxy. featured
- **scurl-mngr** (PowerShell) — CLI para gestionar instalaciones de static-curl. tags: cli, windows. featured
- **ofetch-action** (TypeScript) — GitHub Action para requests HTTP con ofetch. tags: ci-cd, github-actions. featured
- **cloudflare-workers-template** (TypeScript) — starter de Workers con TS, Vitest, oxlint y CI. tags: cloudflare, template, ci-cd. featured
- **ch-utils** (Rust) — chmod/chown estilo POSIX que traduce rwx a ACLs NTFS. tags: rust, windows, cli. featured
- **serve** (Go) — servidor de archivos estáticos compatible con `serve` de npm. tags: go, cli
- **identicon** (Rust) — algoritmo de identicon de GitHub en Rust. tags: rust, lib
- **cors-test** (TypeScript) — probador de cabeceras CORS como Cloudflare Worker. tags: cloudflare, tooling
- **github-profile-trophy** (TypeScript) — port Nitro vendor-agnostic de github-profile-trophy. tags: nitro, cloudflare
- **Keycloak-ECS** (Dockerfile) — guía para desplegar Keycloak en AWS ECS Fargate. tags: aws, ecs, docker
- **geoip** (TypeScript) — Worker que devuelve ubicación por IP. tags: cloudflare
- **stellar-debris** (TypeScript) — playground HTTP compatible con httpbin en Workers (Hono). tags: cloudflare, hono

> La lista de "featured" (5–6) alimenta la home; el resto aparece en `/proyectos`.

### 3.3 i18n
`config.mts` define `locales`:
- `root`: `label: 'Español'`, `lang: 'es-CO'` → contenido en la raíz.
- `en`: `label: 'English'`, `lang: 'en'`, `link: '/en/'` → contenido en `en/`.

Cada locale tiene su propio `nav`, `sidebar` y textos del tema (buscar, "en esta página",
etc.). El selector de idioma lo aporta el Default Theme automáticamente.

### 3.4 Estructura de contenido
```
index.md              # ES Home (layout: home o custom con HeroCreate)
proyectos.md          # ES Proyectos (usa <ProjectGrid/>)
sobre-mi.md           # ES Sobre mí + CV imprimible
stack.md              # ES Stack (usa <TechStack/>)
en/
  index.md            # EN Home
  proyectos.md        # EN Projects
  sobre-mi.md         # EN About + CV
  stack.md            # EN Stack
public/
  favicon / og image / banner (assets del tema)
```
> Nota: se eliminan los archivos de ejemplo del scaffold (`api-examples.md`,
> `markdown-examples.md`) y se reescribe `index.md`.

## 4. Diseño visual — paleta Create Mod

Tokens CSS en `:root` (dark por defecto) y override en modo claro. VitePress usa
`.dark` en `<html>` para el tema oscuro; se mapean las variables `--vp-c-*`.

| Token | Dark | Light |
|---|---|---|
| Fondo (`--vp-c-bg`) | `#17120d` | `#f4ecd8` |
| Fondo alt/soft | `#1f1710` | `#eaddc2` |
| Superficie/tarjeta | `#241a12` | `#efe4cd` |
| Marrón primario | `#3d2b1f` | `#6b4f34` |
| **Acento bronce/latón** (`--vp-c-brand`) | `#c8a05a` | `#a9762f` |
| Acento cobre (2º) | `#c46a3f` | `#b0562a` |
| Texto (`--vp-c-text-1`) | `#f0e6d2` | `#2a1e14` |
| Texto tenue (`--vp-c-text-2`) | `#c9b89a` | `#6b5a42` |
| Bordes (`--vp-c-divider`) | `#5c4326` | `#c9a86f` |

- **Tipografía:** cuerpo **Inter**; monospace **JetBrains Mono** para chips de tech,
  labels, kbd y bloques de código. Cargadas vía `@fontsource` o `<link>` a fuentes web;
  con fallback del sistema.
- **Motivos (SVG/CSS inline, sin librerías):**
  - Engranaje girando lento en el hero (`Gear.vue`, respeta `prefers-reduced-motion`).
  - Separadores "línea cinética" en bronce.
  - `ProjectCard` con borde tipo placa metálica y esquina de "remache".
  - Chips monospace con borde bronce.
- Accesibilidad: contraste AA en ambos modos; motivos decorativos con `aria-hidden`;
  animaciones desactivadas con `prefers-reduced-motion: reduce`.

## 5. CV / PDF

- `sobre-mi.md` (y `en/sobre-mi.md`) contienen la trayectoria/experiencia/certs en un
  contenedor con clase `cv-sheet`.
- `styles/print.css` (importado en `theme/index.ts`) define `@media print`:
  oculta navbar, sidebar, footer, gears y botones; fondo blanco, tinta oscura, márgenes
  A4, tipografía compacta, evita cortes en secciones (`break-inside: avoid`).
- Botón **"Descargar CV (PDF)"** (`<button @click="window.print()">`, con `class="no-print"`)
  al inicio de la página. El navegador ofrece "Guardar como PDF".
- Contenido del CV sembrado desde el perfil real (rol, ADO-TECH, certs AWS, stack,
  proyectos destacados, ubicación, enlaces GitHub/dominio).

## 6. Deploy — Cloudflare Pages

- Build: `pnpm build` → `vitepress build` → salida en `.vitepress/dist`.
- `wrangler.jsonc` para Pages (`pages_build_output_dir: ".vitepress/dist"`).
- Workflow opcional `.github/workflows/deploy.yml` (build + `wrangler pages deploy`),
  documentado en README pero no bloqueante.
- Sin `base` custom (dominio propio `maurrod.dev`).
- `git init` + `.gitignore` (node_modules, `.vitepress/dist`, `.vitepress/cache`).

## 7. Dependencias

- Runtime/build: `vitepress` (ya en `2.0.0-alpha.20`), `vue` (peer).
- Fuentes: `@fontsource/inter`, `@fontsource/jetbrains-mono` (o `<link>` a CDN de fuentes).
- Dev (deploy, opcional): `wrangler`.
- Gestor de paquetes: **pnpm** (ya hay `pnpm-lock.yaml`).

## 8. Verificación

1. `pnpm build` compila sin errores ni warnings de links rotos.
2. `pnpm dev` sirve el sitio; se navegan las 4 secciones en ES y EN.
3. Toggle claro/oscuro aplica la paleta correctamente en ambos.
4. Selector de idioma cambia ES ⇄ EN manteniendo la sección.
5. `/proyectos` renderiza tarjetas desde el data loader y los filtros funcionan.
6. En `/sobre-mi`, "Descargar CV" abre el diálogo de impresión y la vista previa
   muestra un A4 limpio (sin navbar/sidebar/gears).
7. Responsive verificado a ~375px sin scroll horizontal.
8. `prefers-reduced-motion` detiene el engranaje.

## 9. Riesgos / notas

- VitePress 2.0 está en **alpha**; algún nombre de API del Default Theme podría variar.
  Mitigación: apoyarse en la skill `vitepress` y en tokens `--vp-c-*` estables.
- `window.print()` depende del navegador para el resultado final del PDF (aceptado por
  el usuario). El print-CSS minimiza diferencias.
- i18n duplica contenido: mantener ES/EN en sync es responsabilidad de edición.

## 10. Fuera de alcance

Blog, contacto/formulario, analytics, comentarios, i18n de más idiomas, integración en
vivo con GitHub API, y CMS. Ampliables en iteraciones futuras.
