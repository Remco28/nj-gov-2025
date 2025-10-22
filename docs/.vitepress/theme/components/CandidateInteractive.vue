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
        {{ candidateData?.name }}'s Talking Points
      </h2>
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
      @close="closeModal"
    />
  </div>
</template>

<style scoped>
.candidate-interactive {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0;
}

.interactive-header {
  text-align: center;
  margin-bottom: 2rem;
}

.interactive-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 0.75rem 0;
  line-height: 1.3;
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
  align-items: center;
  gap: 2rem;
}

.spinner-section {
  display: flex;
  justify-content: center;
}

.bubble-section {
  width: 100%;
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
    padding: 1.5rem 0;
  }

  .interactive-title {
    font-size: 1.5rem;
  }

  .interactive-description {
    font-size: 0.9375rem;
  }
}
</style>
