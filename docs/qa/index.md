---
title: "QA Dashboard"
---

<script setup lang="ts">
import { getQaSummaryMetrics, getCandidateQaStats, getQaIssueGroups } from '../.vitepress/data/qaMetrics'
import QaMetricGrid from '../.vitepress/theme/components/qa/QaMetricGrid.vue'
import QaIssueList from '../.vitepress/theme/components/qa/QaIssueList.vue'

const summaryMetrics = getQaSummaryMetrics()
const candidateStats = getCandidateQaStats()
const issueGroups = getQaIssueGroups()
</script>

# QA Dashboard

**Internal Quality Assurance Tool** — This dashboard provides automated data quality checks for content editors and maintainers. Use it to identify missing data, incomplete talking points, and other issues before publishing.

## Summary Metrics

<QaMetricGrid :metrics="summaryMetrics" />

## Candidate Coverage

<table class="qa-candidate-table">
  <thead>
    <tr>
      <th>Candidate</th>
      <th>Talking Points</th>
      <th>Missing Details</th>
      <th>Missing Sources</th>
      <th>Placeholder Headshot</th>
    </tr>
  </thead>
  <tbody>
    <tr
      v-for="stat in candidateStats"
      :key="stat.id"
      :class="{
        'qa-row--warning': stat.talkingPointCount === 0 || stat.usesPlaceholderHeadshot
      }"
    >
      <td class="qa-cell-candidate">{{ stat.name }}</td>
      <td class="qa-cell-number">{{ stat.talkingPointCount }}</td>
      <td class="qa-cell-number">{{ stat.missingDetailsCount }}</td>
      <td class="qa-cell-number">{{ stat.missingSourcesCount }}</td>
      <td class="qa-cell-boolean">{{ stat.usesPlaceholderHeadshot ? 'Yes' : 'No' }}</td>
    </tr>
  </tbody>
</table>

## Data Quality Warnings

<QaIssueList
  title="Candidates Missing Talking Points"
  :items="issueGroups.candidatesWithoutTalkingPoints"
/>

<QaIssueList
  title="Talking Points Missing Details"
  :items="issueGroups.talkingPointsMissingDetails"
/>

<QaIssueList
  title="Talking Points Missing Sources"
  :items="issueGroups.talkingPointsMissingSources"
/>

<QaIssueList
  title="Duplicate Talking Point IDs"
  :items="issueGroups.duplicateTalkingPointIds"
/>

<QaIssueList
  title="Placeholder Headshots"
  :items="issueGroups.placeholderHeadshots"
/>

## Next Steps

**Before Publishing:** Resolve all `critical` issues (candidates without talking points, duplicate IDs). Address `warning` issues (missing details, sources, placeholder images) to ensure high-quality content.

Refer to the [Content Management Guide](../content/README.md) for instructions on updating candidate data.

<style scoped>
.qa-candidate-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  font-size: 0.9rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}

.qa-candidate-table thead {
  background-color: var(--vp-c-bg-soft);
}

.qa-candidate-table th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--vp-c-text-1);
  border-bottom: 2px solid var(--vp-c-divider);
}

.qa-candidate-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
}

.qa-candidate-table tbody tr:last-child td {
  border-bottom: none;
}

.qa-candidate-table tbody tr:hover {
  background-color: var(--vp-c-bg-soft);
}

.qa-row--warning {
  background-color: rgba(245, 158, 11, 0.05);
}

.qa-row--warning:hover {
  background-color: rgba(245, 158, 11, 0.1);
}

.qa-cell-candidate {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.qa-cell-number {
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.qa-cell-boolean {
  text-align: center;
}

/* Responsive table */
@media (max-width: 768px) {
  .qa-candidate-table {
    font-size: 0.8rem;
  }

  .qa-candidate-table th,
  .qa-candidate-table td {
    padding: 0.5rem 0.75rem;
  }
}

@media (max-width: 640px) {
  .qa-candidate-table {
    display: block;
    overflow-x: auto;
  }
}
</style>
