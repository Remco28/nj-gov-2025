<script setup lang="ts">
/**
 * QaIssueList Component
 *
 * Displays a list of data quality issues with severity badges.
 * Shows an empty state message when no issues are present.
 */

import type { QaIssue } from '../../../data/qaMetrics'

interface Props {
  /** Section title */
  title: string
  /** Array of issues to display */
  items: QaIssue[]
  /** Message to show when items array is empty */
  emptyMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  emptyMessage: 'No issues detected'
})
</script>

<template>
  <div class="qa-issue-list">
    <h3 class="qa-issue-list-title">{{ title }}</h3>

    <!-- Empty state -->
    <div v-if="items.length === 0" class="qa-issue-empty">
      {{ emptyMessage }}
    </div>

    <!-- Issues table -->
    <div v-else class="qa-issue-table">
      <div
        v-for="issue in items"
        :key="issue.id"
        class="qa-issue-row"
        :class="`qa-issue-row--${issue.severity}`"
      >
        <div class="qa-issue-content">
          <span class="qa-issue-label">{{ issue.label }}</span>
          <span class="qa-issue-description">{{ issue.description }}</span>
        </div>
        <span
          class="qa-issue-badge"
          :class="`qa-issue-badge--${issue.severity}`"
          :aria-label="`Severity: ${issue.severity}`"
        >
          {{ issue.severity }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.qa-issue-list {
  margin: 1.5rem 0;
}

.qa-issue-list-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 1rem 0;
}

.qa-issue-empty {
  padding: 1.5rem;
  text-align: center;
  color: var(--vp-c-text-3);
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  font-style: italic;
}

.qa-issue-table {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}

.qa-issue-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
  transition: background-color 0.2s;
}

.qa-issue-row:last-child {
  border-bottom: none;
}

.qa-issue-row:hover {
  background-color: var(--vp-c-bg-soft);
}

.qa-issue-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.qa-issue-label {
  font-weight: 600;
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
}

.qa-issue-description {
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  line-height: 1.5;
}

.qa-issue-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  flex-shrink: 0;
}

.qa-issue-badge--warning {
  background-color: #fef3c7; /* Amber background */
  color: #92400e; /* Dark amber text - WCAG AA compliant */
}

.qa-issue-badge--critical {
  background-color: #fee2e2; /* Red background */
  color: #991b1b; /* Dark red text - WCAG AA compliant */
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .qa-issue-badge--warning {
    background-color: #78350f;
    color: #fcd34d;
  }

  .qa-issue-badge--critical {
    background-color: #7f1d1d;
    color: #fca5a5;
  }
}

/* Responsive: stack badge below content on small screens */
@media (max-width: 640px) {
  .qa-issue-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .qa-issue-badge {
    align-self: flex-start;
  }
}
</style>
