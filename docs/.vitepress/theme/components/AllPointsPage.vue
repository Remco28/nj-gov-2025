<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import {
  getAllCandidates,
  findCandidateTalkingPoint,
  type CandidateTalkingPointEntry
} from '../../data/candidates'
import TalkingPointModal from './TalkingPointModal.vue'

interface CandidateSectionEntry extends CandidateTalkingPointEntry {
  sourceCount: number
}

interface CandidateSection {
  id: string
  name: string
  party: string
  summary: string
  entries: CandidateSectionEntry[]
}

const candidates = getAllCandidates()

const sections = ref<CandidateSection[]>([])

for (const candidate of candidates) {
  const rawPoints = Array.isArray(candidate.talkingPoints) ? candidate.talkingPoints : []
  const entries: CandidateSectionEntry[] = []

  for (const talkingPoint of rawPoints) {
    if (!talkingPoint || !talkingPoint.id || !talkingPoint.title) continue

    entries.push({
      candidateId: candidate.id,
      candidateName: candidate.name,
      candidateParty: candidate.party,
      candidateSummary: candidate.summary,
      talkingPoint,
      anchorId: `${candidate.id}-${talkingPoint.id}`,
      sourceCount: Array.isArray(talkingPoint.sources) ? talkingPoint.sources.length : 0
    })
  }

  sections.value.push({
    id: candidate.id,
    name: candidate.name,
    party: candidate.party,
    summary: candidate.summary,
    entries
  })
}

const isModalOpen = ref(false)
const activeEntry = ref<CandidateSectionEntry | null>(null)
const lastTriggerButton = ref<HTMLElement | null>(null)

function openModal(entry: CandidateSectionEntry, trigger?: HTMLElement) {
  activeEntry.value = entry
  isModalOpen.value = true
  lastTriggerButton.value = trigger ?? null

  if (typeof window !== 'undefined') {
    window.location.hash = entry.anchorId
  }
}

function closeModal() {
  isModalOpen.value = false

  if (typeof window !== 'undefined') {
    history.replaceState(null, '', window.location.pathname + window.location.search)

    nextTick(() => {
      if (lastTriggerButton.value) {
        lastTriggerButton.value.focus()
        lastTriggerButton.value = null
      }
    })
  }
}

function handleJump(event: Event) {
  const select = event.target as HTMLSelectElement
  const targetId = select.value

  if (!targetId) return

  const element = document.getElementById(targetId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

onMounted(async () => {
  if (typeof window === 'undefined') return

  const hash = window.location.hash.slice(1)
  if (!hash) return

  const entry = findCandidateTalkingPoint(hash)
  if (!entry) return

  await nextTick()

  const cardElement = document.getElementById(hash)
  const buttonElement = cardElement?.querySelector('button.view-details-btn') as HTMLElement | undefined

  if (cardElement) {
    cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  setTimeout(() => {
    const candidateSection = sections.value.find(section => section.id === entry.candidateId)
    const matchedEntry = candidateSection?.entries.find(item => item.anchorId === entry.anchorId)

    if (matchedEntry) {
      openModal(matchedEntry, buttonElement)
    }
  }, 300)
})
</script>

<template>
  <div class="all-points-doc">
    <h1 id="all-talking-points" tabindex="-1">
      All Talking Points
      <a
        class="header-anchor"
        href="#all-talking-points"
        aria-label='Permalink to "All Talking Points"'
      >&#8203;</a>
    </h1>

    <p>
      This page provides a complete, deterministic index of every talking point from all candidates.
      Use this to audit content, compare positions side-by-side, or share links to specific claims.
    </p>

    <h2 id="quick-navigation" tabindex="-1">
      Quick Navigation
      <a class="header-anchor" href="#quick-navigation" aria-label='Permalink to "Quick Navigation"'>
        &#8203;
      </a>
    </h2>

    <div class="quick-nav-container">
      <div class="quick-nav-links">
        <a
          v-for="candidate in sections"
          :key="candidate.id"
          :href="`#${candidate.id}`"
          class="quick-nav-link"
        >
          {{ candidate.name }}
        </a>
      </div>

      <div class="quick-nav-select">
        <label for="candidate-jump" class="sr-only">Jump to candidate</label>
        <select id="candidate-jump" class="candidate-select" @change="handleJump">
          <option value="">Jump to candidate...</option>
          <option v-for="candidate in sections" :key="candidate.id" :value="candidate.id">
            {{ candidate.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="all-points-container">
      <section
        v-for="candidate in sections"
        :key="candidate.id"
        :id="candidate.id"
        class="candidate-section"
      >
        <div class="candidate-header">
          <h2 class="candidate-name">{{ candidate.name }}</h2>
          <p class="candidate-party">{{ candidate.party }}</p>
          <p v-if="candidate.summary" class="candidate-summary">{{ candidate.summary }}</p>
          <p class="talking-points-count">
            {{ candidate.entries.length }} talking points
          </p>
        </div>

        <div v-if="candidate.entries.length > 0" class="talking-points-grid">
          <article
            v-for="entry in candidate.entries"
            :key="entry.anchorId"
            :id="entry.anchorId"
            class="talking-point-card"
            :data-anchor="entry.anchorId"
          >
            <h3 class="card-title">{{ entry.talkingPoint.title }}</h3>
            <p class="card-summary">{{ entry.talkingPoint.summary }}</p>

            <div class="card-footer">
              <p class="card-sources">
                <span v-if="entry.sourceCount > 0">Sources: {{ entry.sourceCount }}</span>
                <span v-else class="sources-pending">Sources pending</span>
              </p>

              <button
                class="view-details-btn"
                :aria-label="`View details for ${entry.talkingPoint.title}`"
                @click="event => openModal(entry, event.currentTarget as HTMLElement)"
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
      :context-label="
        activeEntry ? `${activeEntry.candidateName} · ${activeEntry.candidateParty}` : undefined
      "
      @close="closeModal"
    />
  </div>
</template>

<style scoped>
.all-points-doc {
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 1.5rem 3rem;
}

h1 {
  font-size: 2.25rem;
  margin-bottom: 1rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

h2 {
  font-size: 1.5rem;
  margin: 3rem 0 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

p {
  color: var(--vp-c-text-2);
  line-height: 1.65;
}

.quick-nav-container {
  margin: 1.5rem 0 2.5rem;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

.quick-nav-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.quick-nav-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1.15rem;
  background: var(--vp-c-bg);
  color: var(--vp-c-brand);
  text-decoration: none;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  border: 1px solid var(--vp-c-divider);
}

.quick-nav-link:hover,
.quick-nav-link:focus-visible {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand);
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
}

.quick-nav-select {
  display: none;
  margin-top: 0;
}

.candidate-select {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.9375rem;
}

.all-points-container {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.candidate-section {
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 2.25rem;
  background: var(--vp-c-bg);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

.candidate-header {
  margin-bottom: 1.75rem;
}

.candidate-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.85rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.candidate-party {
  margin: 0;
  font-size: 1rem;
  color: var(--vp-c-text-3);
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.candidate-summary {
  margin: 0.75rem 0 0;
  color: var(--vp-c-text-2);
  line-height: 1.65;
}

.talking-points-count {
  margin: 1rem 0 0;
  font-size: 0.9375rem;
  color: var(--vp-c-text-3);
  font-weight: 500;
}

.talking-points-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

.talking-point-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: all 0.2s ease;
  scroll-margin-top: 2rem;
}

.talking-point-card:hover,
.talking-point-card:focus-within {
  border-color: var(--vp-c-brand-light);
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.12);
  transform: translateY(-2px);
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
  opacity: 0.75;
}

.view-details-btn {
  padding: 0.5rem 1.1rem;
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
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

@media (max-width: 1024px) {
  .all-points-doc {
    padding: 0 1.25rem 2.5rem;
  }

  .candidate-section {
    padding: 2rem;
  }
}

@media (max-width: 768px) {
  .quick-nav-links {
    display: none;
  }

  .quick-nav-select {
    display: block;
  }

  .candidate-name {
    font-size: 1.6rem;
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
  .all-points-doc {
    padding: 0 1rem 2.25rem;
  }

  .quick-nav-container {
    padding: 1rem;
  }

  .talking-point-card {
    padding: 1rem;
  }
}
</style>
