/**
 * VitePress Theme Configuration
 *
 * This file extends the default VitePress theme and registers
 * custom components that can be used in Markdown files.
 */

import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './styles/foundations.css'
import CandidateCard from './components/CandidateCard.vue'
import CandidateGrid from './components/CandidateGrid.vue'
import CandidateInteractive from './components/CandidateInteractive.vue'
import SpinnerButton from './components/SpinnerButton.vue'
import TalkingPointBubble from './components/TalkingPointBubble.vue'
import TalkingPointModal from './components/TalkingPointModal.vue'
import AllPointsPage from './components/AllPointsPage.vue'
import QaMetricCard from './components/qa/QaMetricCard.vue'
import QaMetricGrid from './components/qa/QaMetricGrid.vue'
import QaIssueList from './components/qa/QaIssueList.vue'

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
    app.component('AllPointsPage', AllPointsPage)
    app.component('QaMetricCard', QaMetricCard)
    app.component('QaMetricGrid', QaMetricGrid)
    app.component('QaIssueList', QaIssueList)
  }
} satisfies Theme
