import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import HeroCreate from './components/HeroCreate.vue'
import ProjectGrid from './components/ProjectGrid.vue'
import TechStack from './components/TechStack.vue'
import CvSkills from './components/CvSkills.vue'
import CertBadges from './components/CertBadges.vue'
import CvActions from './components/CvActions.vue'
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import './custom.css'
import './styles/print.css'

// Only components used directly in Markdown are registered globally.
// Gear, TechChip, ProjectCard and CategoryIcon are imported locally by the
// components that use them, so they don't need global registration.
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HeroCreate', HeroCreate)
    app.component('ProjectGrid', ProjectGrid)
    app.component('TechStack', TechStack)
    app.component('CvSkills', CvSkills)
    app.component('CertBadges', CertBadges)
    app.component('CvActions', CvActions)
  }
} satisfies Theme
