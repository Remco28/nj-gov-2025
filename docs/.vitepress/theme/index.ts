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
import CandidateInteractive from './components/CandidateInteractive.vue'
import SpinnerButton from './components/SpinnerButton.vue'
import TalkingPointBubble from './components/TalkingPointBubble.vue'
import TalkingPointModal from './components/TalkingPointModal.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Register components globally so they can be used in Markdown
    app.component('CandidateCard', CandidateCard)
    app.component('CandidateGrid', CandidateGrid)
    app.component('CandidateInteractive', CandidateInteractive)
    app.component('SpinnerButton', SpinnerButton)
    app.component('TalkingPointBubble', TalkingPointBubble)
    app.component('TalkingPointModal', TalkingPointModal)
  }
} satisfies Theme
