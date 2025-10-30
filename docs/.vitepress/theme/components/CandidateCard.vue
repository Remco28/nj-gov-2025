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
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  text-align: center;
  transition: all 0.2s ease;
  background: var(--vp-c-bg);
  box-shadow: var(--shadow-sm);
}

.candidate-card:hover {
  background-color: var(--vp-c-bg-soft);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--vp-c-brand-light);
}

.candidate-card:focus-within {
  outline: 2px solid var(--vp-c-brand);
  outline-offset: 2px;
}

.candidate-headshot {
  width: 128px;
  height: 128px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto var(--space-md);
  display: block;
  border: 3px solid var(--vp-c-divider);
  box-shadow: var(--shadow-sm);
  aspect-ratio: 1;
}

.candidate-name {
  font-weight: 600;
  font-size: 1.125rem;
  margin-bottom: var(--space-xs);
  color: var(--vp-c-text-1);
}

.candidate-party {
  color: var(--vp-c-text-3);
  font-size: 0.875rem;
  margin-bottom: var(--space-sm);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.candidate-summary {
  color: var(--vp-c-text-2);
  font-size: 0.9375rem;
  line-height: 1.6;
  margin-top: var(--space-sm);
}

/* Responsive: Ensure images scale on small screens */
@media (max-width: 640px) {
  .candidate-headshot {
    width: 100px;
    height: 100px;
  }

  .candidate-card {
    padding: var(--space-md);
  }
}
</style>
