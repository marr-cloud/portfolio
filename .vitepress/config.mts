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
