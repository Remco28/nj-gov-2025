/**
 * VitePress Theme Configuration
 *
 * This file extends the default VitePress theme and registers
 * custom components that can be used in Markdown files.
 */

import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import CandidateCard from './components/CandidateCard.vue'
import CandidateGrid from './components/CandidateGrid.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Register components globally so they can be used in Markdown
    app.component('CandidateCard', CandidateCard)
    app.component('CandidateGrid', CandidateGrid)
  }
} satisfies Theme
