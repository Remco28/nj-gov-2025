<script setup lang="ts">
/**
 * CandidateInteractive Component
 *
 * Orchestrates the interactive talking point experience:
 * - Spinner button to select random talking points
 * - Speech bubble to display selected talking point
 * - Modal to show full details
 *
 * Handles the full flow from spin to bubble to modal.
 */

import { ref, computed } from 'vue'
import { getCandidateById, getTalkingPointsByCandidate, type Candidate } from '../../data/candidates'
import { useTalkingPointState } from '../../data/state/useTalkingPointState'
import SpinnerButton from './SpinnerButton.vue'
import TalkingPointBubble from './TalkingPointBubble.vue'
import TalkingPointModal from './TalkingPointModal.vue'

interface Props {
  /** Candidate ID or full Candidate object */
  candidate: string | Candidate
}

const props = defineProps<Props>()

// Get the candidate object
const candidateData = computed(() => {
  if (typeof props.candidate === 'string') {
    return getCandidateById(props.candidate)
  }
  return props.candidate
})

// Get the candidate ID
const candidateId = computed(() => {
  return candidateData.value?.id || ''
})

// Get talking points for this candidate
const talkingPoints = computed(() => {
  return getTalkingPointsByCandidate(candidateId.value)
})

// Check if candidate has talking points
const hasTalkingPoints = computed(() => {
  return talkingPoints.value.length > 0
})

// Initialize state management
const { currentTalkingPoint, spin } = useTalkingPointState(candidateId.value)

// Modal state
const isModalOpen = ref(false)

// Spinner loading state
const isSpinning = ref(false)

/**
 * Handle spin button click
 */
function handleSpin() {
  // Add a brief spinning animation
  isSpinning.value = true

  setTimeout(() => {
    spin()
    isSpinning.value = false
  }, 500)
}

/**
 * Open the modal to show full details
 */
function openModal() {
  isModalOpen.value = true
}

/**
 * Close the modal
 */
function closeModal() {
  isModalOpen.value = false
}
</script>

<template>
  <div class="candidate-interactive">
    <div class="interactive-header">
      <h2 class="interactive-title">
        {{ candidateData?.name }}
      </h2>
      <p v-if="candidateData" class="interactive-party">
        {{ candidateData.party }} Party
      </p>
      <p v-if="hasTalkingPoints" class="interactive-description">
        Spin to explore a random talking point from this candidate
      </p>
      <p v-else class="interactive-no-points">
        No talking points available for this candidate yet.
      </p>
    </div>

    <div class="interactive-content">
      <div class="spinner-section">
        <SpinnerButton
          :disabled="!hasTalkingPoints"
          :loading="isSpinning"
          :headshot="candidateData?.headshot"
          :candidate-name="candidateData?.name || ''"
          label="Spin for a Talking Point"
          @spin="handleSpin"
        />
      </div>

      <Transition name="bubble" mode="out-in">
        <div v-if="currentTalkingPoint" :key="currentTalkingPoint.id" class="bubble-section">
          <TalkingPointBubble
            :title="currentTalkingPoint.title"
            :summary="currentTalkingPoint.summary"
            @open="openModal"
          />
        </div>
      </Transition>
    </div>

    <TalkingPointModal
      :talking-point="currentTalkingPoint"
      :open="isModalOpen"
      :context-label="candidateData ? `${candidateData.name} · ${candidateData.party}` : undefined"
      @close="closeModal"
    />
  </div>
</template>

<style scoped>
.candidate-interactive {
  max-width: 1040px;
  margin: 0 auto;
  padding: var(--space-xl) 0;
}

.interactive-header {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.interactive-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0;
  line-height: 1.3;
}

.interactive-party {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: var(--space-xs) 0 var(--space-md) 0;
}

.interactive-description {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.5;
}

.interactive-no-points {
  font-size: 1rem;
  color: var(--vp-c-text-3);
  margin: 0;
  font-style: italic;
}

.interactive-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  align-items: center;
}

@media (min-width: 1024px) {
  .interactive-content {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--space-3xl);
    align-items: center;
    background: var(--vp-c-bg-soft);
    border: 1px solid var(--vp-c-divider);
    border-radius: var(--radius-lg);
    padding: var(--space-2xl);
    box-shadow: var(--shadow-lg);
  }
}

.spinner-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.bubble-section {
  width: 100%;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 1024px) {
  .bubble-section {
    min-height: 300px;
    justify-content: flex-start;
  }
}

/* Bubble transition animations */
.bubble-enter-active,
.bubble-leave-active {
  transition: all 0.3s ease;
}

.bubble-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.bubble-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .candidate-interactive {
    padding: var(--space-lg) 0;
  }

  .interactive-title {
    font-size: 1.5rem;
  }

  .interactive-description {
    font-size: 0.9375rem;
  }

  .interactive-content {
    gap: var(--space-lg);
  }
}
</style>
