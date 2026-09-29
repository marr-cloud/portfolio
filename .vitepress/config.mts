import { defineConfig } from 'vitepress'

export default defineConfig({
  cleanUrls: true,
  lang: 'es-CO',
  title: 'Mauricio Rodriguez',
  description: 'DevOps Engineer — AWS, contenedores y automatización de despliegues.',
  // Keep planning/spec docs and README out of the built site + search index.
  srcExclude: ['docs/**', '**/README.md', '.superpowers/**'],
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'author', content: 'Mauricio Rodriguez' }],
    ['meta', { name: 'theme-color', content: '#c8a05a' }],
    // Open Graph (Facebook, LinkedIn, Slack, WhatsApp…)
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Mauricio Rodriguez' }],
    ['meta', { property: 'og:title', content: 'Mauricio Rodriguez — DevOps Engineer' }],
    ['meta', { property: 'og:description', content: 'DevOps Engineer — AWS, contenedores y automatización de despliegues.' }],
    ['meta', { property: 'og:url', content: 'https://maurrod.dev' }],
    ['meta', { property: 'og:image', content: 'https://maurrod.dev/og-image.png' }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:image:alt', content: 'Mauricio Rodriguez — DevOps Engineer · maurrod.dev' }],
    ['meta', { property: 'og:locale', content: 'es_CO' }],
    // Twitter / X
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Mauricio Rodriguez — DevOps Engineer' }],
    ['meta', { name: 'twitter:description', content: 'DevOps Engineer — AWS, contenedores y automatización de despliegues.' }],
    ['meta', { name: 'twitter:image', content: 'https://maurrod.dev/og-image.png' }]
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
