<script setup lang="ts">
/**
 * QaMetricCard Component
 *
 * Displays a single QA metric with value, status indicator, and optional target.
 * Uses semantic colors based on status (green/amber/red) with WCAG AA compliance.
 */

interface Props {
  /** Display title for the metric */
  title: string
  /** Metric value (number or string) */
  value: number | string
  /** Status indicator affecting visual style */
  status: 'ok' | 'warning' | 'critical'
  /** Optional description providing context */
  description?: string
  /** Optional target value for comparison */
  target?: string
}

defineProps<Props>()
</script>

<template>
  <div
    class="qa-metric-card"
    :class="`qa-metric-card--${status}`"
    :aria-label="`${title}: ${value}, status: ${status}`"
  >
    <h3 class="qa-metric-title">{{ title }}</h3>
    <div class="qa-metric-value">{{ value }}</div>
    <div v-if="target" class="qa-metric-target">Target: {{ target }}</div>
    <div v-if="description" class="qa-metric-description">{{ description }}</div>
  </div>
</template>

<style scoped>
.qa-metric-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1.25rem;
  transition: background-color 0.25s, border-color 0.25s;
  position: relative;
}

.qa-metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  border-radius: 8px 8px 0 0;
}

.qa-metric-card--ok::before {
  background-color: #10b981; /* Green - WCAG AA compliant */
}

.qa-metric-card--warning::before {
  background-color: #f59e0b; /* Amber - WCAG AA compliant */
}

.qa-metric-card--critical::before {
  background-color: #ef4444; /* Red - WCAG AA compliant */
}

.qa-metric-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.qa-metric-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 0.25rem;
  line-height: 1.2;
}

.qa-metric-target {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  margin-top: 0.25rem;
}

.qa-metric-description {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  margin-top: 0.5rem;
  line-height: 1.4;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .qa-metric-card {
    padding: 1rem;
  }

  .qa-metric-value {
    font-size: 1.5rem;
  }
}
</style>
