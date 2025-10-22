<script setup lang="ts">
/**
 * CandidateGrid Component
 *
 * Displays a responsive grid of candidate cards.
 * Automatically adapts to screen size and number of candidates.
 */

import CandidateCard from './CandidateCard.vue'
import type { Candidate } from '../../data/candidates'

interface Props {
  /** Array of candidate objects to display */
  candidates: Candidate[]
}

defineProps<Props>()
</script>

<template>
  <div class="candidate-grid">
    <CandidateCard
      v-for="candidate in candidates"
      :key="candidate.id"
      :name="candidate.name"
      :party="candidate.party"
      :headshot="candidate.headshot"
      :summary="candidate.summary"
    />
  </div>
</template>

<style scoped>
.candidate-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .candidate-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}

@media (min-width: 641px) and (max-width: 960px) {
  .candidate-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
}
</style>
