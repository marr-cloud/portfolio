import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Gear from './components/Gear.vue'
import HeroCreate from './components/HeroCreate.vue'
import TechChip from './components/TechChip.vue'
import ProjectCard from './components/ProjectCard.vue'
import ProjectGrid from './components/ProjectGrid.vue'
import TechStack from './components/TechStack.vue'
import CategoryIcon from './components/CategoryIcon.vue'
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

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Gear', Gear)
    app.component('HeroCreate', HeroCreate)
    app.component('TechChip', TechChip)
    app.component('ProjectCard', ProjectCard)
    app.component('ProjectGrid', ProjectGrid)
    app.component('TechStack', TechStack)
    app.component('CategoryIcon', CategoryIcon)
    app.component('CvSkills', CvSkills)
    app.component('CertBadges', CertBadges)
    app.component('CvActions', CvActions)
  }
} satisfies Theme
