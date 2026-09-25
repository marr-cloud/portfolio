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
