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
    name: 'aijcriltda',
    repo: 'https://github.com/marr-cloud/aijcriltda',
    language: 'Vue',
    description: 'Sitio web corporativo para Asesorías Integrales Juan Carlos Rodríguez Iglesias Ltda., hecho con Vue/Nuxt y desplegado en Netlify.',
    description_en: 'Corporate website for Asesorías Integrales Juan Carlos Rodríguez Iglesias Ltda., built with Vue/Nuxt and deployed on Netlify.',
    tags: ['vue', 'nuxt', 'web'],
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
    featured: true
  },
  {
    name: 'github-profile-trophy',
    repo: 'https://github.com/marr-cloud/github-profile-trophy',
    language: 'TypeScript',
    description: 'Port Nitro vendor-agnostic de github-profile-trophy: desplegable a Cloudflare, Vercel, Deno o Node.',
    description_en: 'Vendor-agnostic Nitro port of github-profile-trophy: deployable to Cloudflare, Vercel, Deno or Node.',
    tags: ['nitro', 'cloudflare'],
    featured: true
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
