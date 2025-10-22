<script setup lang="ts">
/**
 * CandidateCard Component
 *
 * Displays a single candidate in a card format with their
 * headshot, name, party, and summary information.
 */

interface Props {
  /** Candidate's full name */
  name: string
  /** Political party affiliation */
  party?: string
  /** URL to candidate's headshot image */
  headshot: string
  /** Brief summary or bio */
  summary?: string
}

defineProps<Props>()
</script>

<template>
  <div class="candidate-card">
    <img
      :src="headshot"
      :alt="name"
      class="candidate-headshot"
    >
    <div class="candidate-name">{{ name }}</div>
    <div v-if="party" class="candidate-party">{{ party }}</div>
    <div v-if="summary" class="candidate-summary">{{ summary }}</div>
  </div>
</template>

<style scoped>
.candidate-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  transition: background-color 0.25s, transform 0.2s;
}

.candidate-card:hover {
  background-color: var(--vp-c-bg-soft);
  transform: translateY(-2px);
}

.candidate-headshot {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
}

.candidate-name {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.candidate-party {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.candidate-summary {
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  line-height: 1.5;
  margin-top: 0.5rem;
}

/* Responsive: Ensure images don't overflow on small screens */
@media (max-width: 640px) {
  .candidate-headshot {
    width: 80px;
    height: 80px;
  }
}
</style>
