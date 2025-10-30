---
title: All Talking Points
layout: page
---

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { getAllCandidates, getAllCandidateTalkingPoints, findCandidateTalkingPoint, type CandidateTalkingPointEntry } from '../.vitepress/data/candidates'
import TalkingPointModal from '../.vitepress/theme/components/TalkingPointModal.vue'

// Get all candidates
const candidates = getAllCandidates()

// Process candidates to ensure valid talking points with safer filtering
const processedCandidates = computed(() => {
  return candidates.map(candidate => {
    const validPoints = []
    const points = candidate.talkingPoints || []

    for (let i = 0; i < points.length; i++) {
      const tp = points[i]
      if (tp && typeof tp === 'object' && tp.id && tp.title) {
        validPoints.push(tp)
      }
    }

    return {
      ...candidate,
      talkingPoints: validPoints
    }
  })
})

// Modal state
const isModalOpen = ref(false)
const activeEntry = ref<CandidateTalkingPointEntry | null>(null)

/**
 * Open modal for a specific talking point
 */
function openModalForTalkingPoint(candidate: any, talkingPoint: any, targetButton?: HTMLElement) {
  // Create entry object
  const entry: CandidateTalkingPointEntry = {
    candidateId: candidate.id,
    candidateName: candidate.name,
    candidateParty: candidate.party,
    candidateSummary: candidate.summary,
    talkingPoint: talkingPoint,
    anchorId: `${candidate.id}-${talkingPoint.id}`
  }

  activeEntry.value = entry
  isModalOpen.value = true

  // Store the target button for focus restoration if provided
  if (targetButton) {
    // Store in a ref or data attribute for modal to restore focus
    targetButton.dataset.shouldRestoreFocus = 'true'
  }

  // Update URL hash
  if (typeof window !== 'undefined') {
    window.location.hash = entry.anchorId
  }
}

/**
 * Close modal and clear hash
 */
function closeModal() {
  isModalOpen.value = false

  // Clear hash from URL
  if (typeof window !== 'undefined') {
    history.replaceState(null, '', window.location.pathname + window.location.search)

    // Restore focus to the button that opened the modal (if it was marked)
    // Wait for next tick to ensure modal has finished closing
    nextTick(() => {
      const buttonToFocus = document.querySelector('[data-should-restore-focus="true"]') as HTMLElement
      if (buttonToFocus) {
        buttonToFocus.focus()
        delete buttonToFocus.dataset.shouldRestoreFocus
      }
    })
  }
}

/**
 * Handle deep link on mount
 */
onMounted(async () => {
  if (typeof window === 'undefined') return

  const hash = window.location.hash.slice(1)
  if (!hash) return

  // Use the centralized helper to find the talking point entry
  const entry = findCandidateTalkingPoint(hash)
  if (!entry) return

  // Wait for DOM to render
  await nextTick()

  // Find the card and button elements
  const cardElement = document.getElementById(hash)
  const buttonElement = cardElement?.querySelector(`button[aria-label*="${entry.talkingPoint.title}"]`) as HTMLElement

  // Scroll to the card
  if (cardElement) {
    cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  // Open modal after scrolling, passing the button for focus restoration
  setTimeout(() => {
    // Find the candidate object for openModalForTalkingPoint
    const candidate = candidates.find(c => c.id === entry.candidateId)
    if (candidate) {
      openModalForTalkingPoint(candidate, entry.talkingPoint, buttonElement)
    }
  }, 300)
})

/**
 * Jump to candidate section
 */
function jumpToCandidate(event: Event) {
  const select = event.target as HTMLSelectElement
  const candidateId = select.value
  if (candidateId) {
    const element = document.getElementById(candidateId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}
</script>

# All Talking Points

This page provides a complete, deterministic index of every talking point from all candidates. Use this to audit content, compare positions side-by-side, or share links to specific claims.

## Quick Navigation

<div class="quick-nav-container">
  <div class="quick-nav-links">
    <a v-for="candidate in processedCandidates.value" :key="candidate.id" :href="`#${candidate.id}`" class="quick-nav-link">
      {{ candidate.name }}
    </a>
  </div>

  <div class="quick-nav-select">
    <label for="candidate-jump" class="sr-only">Jump to candidate</label>
    <select id="candidate-jump" @change="jumpToCandidate" class="candidate-select">
      <option value="">Jump to candidate...</option>
      <option v-for="candidate in processedCandidates.value" :key="candidate.id" :value="candidate.id">
        {{ candidate.name }}
      </option>
    </select>
  </div>
</div>

<div class="all-points-container">
  <section
    v-for="candidate in processedCandidates.value"
    :key="candidate.id"
    :id="candidate.id"
    class="candidate-section"
  >
    <div class="candidate-header">
      <h2 class="candidate-name">{{ candidate.name }}</h2>
      <p class="candidate-party">{{ candidate.party }}</p>
      <p v-if="candidate.summary" class="candidate-summary">{{ candidate.summary }}</p>
      <p class="talking-points-count">
        {{ candidate.talkingPoints.length }} talking points
      </p>
    </div>

    <div v-if="candidate.talkingPoints.length > 0" class="talking-points-grid">
      <article
        v-for="(tp, index) in candidate.talkingPoints"
        :key="`${candidate.id}-${tp.id}`"
        :id="`${candidate.id}-${tp.id}`"
        class="talking-point-card"
        :data-anchor="`${candidate.id}-${tp.id}`"
      >
        <h3 class="card-title">{{ tp.title }}</h3>
        <p class="card-summary">{{ tp.summary }}</p>

        <div class="card-footer">
          <p class="card-sources">
            <span v-if="tp.sources && tp.sources.length > 0">
              Sources: {{ tp.sources.length }}
            </span>
            <span v-else class="sources-pending">
              Sources pending
            </span>
          </p>

          <button
            @click="(event) => openModalForTalkingPoint(candidate, tp, event.currentTarget as HTMLElement)"
            class="view-details-btn"
            :aria-label="`View details for ${tp.title}`"
          >
            View details
          </button>
        </div>
      </article>
    </div>

    <p v-else class="no-talking-points">
      No talking points available for this candidate yet.
    </p>
  </section>
</div>

<TalkingPointModal
  :talking-point="activeEntry?.talkingPoint ?? null"
  :open="isModalOpen"
  :context-label="activeEntry ? `${activeEntry.candidateName} · ${activeEntry.candidateParty}` : undefined"
  @close="closeModal"
/>

<style scoped>
.quick-nav-container {
  margin: 2rem 0;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
}

.quick-nav-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.quick-nav-link {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: var(--vp-c-bg);
  color: var(--vp-c-brand);
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  border: 1px solid var(--vp-c-divider);
}

.quick-nav-link:hover {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand);
  transform: translateY(-1px);
}

.quick-nav-link:focus-visible {
  outline: 2px solid var(--vp-c-brand);
  outline-offset: 2px;
}

.quick-nav-select {
  display: none;
}

.candidate-select {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  cursor: pointer;
}

.candidate-select:focus-visible {
  outline: 2px solid var(--vp-c-brand);
  outline-offset: 2px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.all-points-container {
  margin: 2rem 0;
}

.candidate-section {
  margin-bottom: 4rem;
  scroll-margin-top: 2rem;
}

.candidate-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--vp-c-divider);
}

.candidate-name {
  font-size: 2rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

.candidate-party {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--vp-c-brand);
  margin: 0 0 0.75rem 0;
}

.candidate-summary {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  margin: 0 0 0.75rem 0;
  line-height: 1.6;
}

.talking-points-count {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.talking-points-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.talking-point-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: all 0.2s ease;
  scroll-margin-top: 2rem;
}

.talking-point-card:hover {
  border-color: var(--vp-c-brand-light);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--vp-c-brand);
  margin: 0;
  line-height: 1.4;
}

.card-summary {
  font-size: 0.9375rem;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.6;
  flex: 1;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--vp-c-divider);
}

.card-sources {
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  margin: 0;
  font-weight: 500;
}

.sources-pending {
  font-style: italic;
  opacity: 0.7;
}

.view-details-btn {
  padding: 0.5rem 1rem;
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  white-space: nowrap;
}

.view-details-btn:hover {
  background: var(--vp-c-brand-dark);
  transform: translateY(-1px);
}

.view-details-btn:focus-visible {
  outline: 2px solid var(--vp-c-brand);
  outline-offset: 2px;
}

.view-details-btn:active {
  transform: translateY(0);
}

.no-talking-points {
  font-size: 1rem;
  color: var(--vp-c-text-3);
  font-style: italic;
  margin: 2rem 0;
  text-align: center;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .quick-nav-links {
    display: none;
  }

  .quick-nav-select {
    display: block;
  }

  .talking-points-grid {
    grid-template-columns: 1fr;
  }

  .candidate-name {
    font-size: 1.5rem;
  }

  .card-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .view-details-btn {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .quick-nav-container {
    padding: 1rem;
  }

  .talking-point-card {
    padding: 1rem;
  }
}
</style>
