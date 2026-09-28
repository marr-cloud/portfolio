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

Cloudflare Workers (Static Assets) — Cloudflare fusionó Pages dentro de Workers, y los sitios estáticos se despliegan como un Worker que sirve `.vitepress/dist` (configurado en `wrangler.jsonc`).

**En producción:** <https://maurrod.dev> (respaldo: <https://portfolio.meitrix8208.workers.dev>)

Manualmente:

```bash
pnpm build && pnpm exec wrangler deploy
```

Automático: configura los secrets `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID` en el repo y cada push a `main` despliega vía GitHub Actions (`.github/workflows/deploy.yml`). El `CLOUDFLARE_API_TOKEN` necesita permisos de *Workers Scripts: Edit*.

## Editar contenido

- Proyectos: `.vitepress/data/projects.ts`
- Stack: `.vitepress/data/stack.ts`
- CV: `sobre-mi.md` y `en/sobre-mi.md`
