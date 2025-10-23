<script setup lang="ts">
/**
 * QaMetricGrid Component
 *
 * Displays a responsive grid of QA metric cards.
 * Adapts from 3 columns on desktop to 1 column on mobile.
 */

import QaMetricCard from './QaMetricCard.vue'
import type { QaMetric } from '../../../data/qaMetrics'

interface Props {
  /** Array of metrics to display */
  metrics: QaMetric[]
}

defineProps<Props>()
</script>

<template>
  <div class="qa-metric-grid">
    <QaMetricCard
      v-for="metric in metrics"
      :key="metric.id"
      :title="metric.label"
      :value="metric.value"
      :status="metric.status"
      :description="metric.description"
      :target="metric.target"
    />
  </div>
</template>

<style scoped>
.qa-metric-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

/* Ensure minimum 3 columns on wider screens when space allows */
@media (min-width: 960px) {
  .qa-metric-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Single column on mobile */
@media (max-width: 640px) {
  .qa-metric-grid {
    grid-template-columns: 1fr;
  }
}
</style>
