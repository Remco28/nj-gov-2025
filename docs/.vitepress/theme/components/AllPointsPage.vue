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
  headshot: string
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
    headshot: candidate.headshot,
    entries
  })
}

const isModalOpen = ref(false)
const activeEntry = ref<CandidateSectionEntry | null>(null)
const lastTriggerButton = ref<HTMLElement | null>(null)
const activeCandidateId = ref<string>('')

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

function scrollToCandidate(candidateId: string, event?: Event) {
  if (event) {
    event.preventDefault()
  }

  const element = document.getElementById(candidateId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    activeCandidateId.value = candidateId
  }
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

onMounted(async () => {
  if (typeof window === 'undefined') return

  // Set up IntersectionObserver for active navigation tracking
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  }

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const candidateId = entry.target.id
        activeCandidateId.value = candidateId

        // Scroll the active chip horizontally within its container without affecting page scroll
        const activeChip = document.querySelector(`.quick-nav-link[href="#${candidateId}"]`) as HTMLElement
        const navContainer = document.querySelector('.quick-nav-links') as HTMLElement

        if (activeChip && navContainer) {
          const chipRect = activeChip.getBoundingClientRect()
          const containerRect = navContainer.getBoundingClientRect()
          const chipOffsetLeft = activeChip.offsetLeft
          const chipWidth = chipRect.width
          const containerWidth = containerRect.width

          // Calculate the scroll position to center the chip
          const scrollLeft = chipOffsetLeft - (containerWidth / 2) + (chipWidth / 2)

          navContainer.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
          })
        }
        break
      }
    }
  }, observerOptions)

  // Observe all candidate sections
  await nextTick()
  const candidateSections = document.querySelectorAll('.candidate-section')
  candidateSections.forEach(section => observer.observe(section))

  // Handle deep-link from hash
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
          :class="['quick-nav-link', { 'is-active': activeCandidateId === candidate.id }]"
          :aria-current="activeCandidateId === candidate.id ? 'true' : undefined"
          @click="scrollToCandidate(candidate.id, $event)"
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
          <div class="candidate-header-main">
            <div class="candidate-avatar">
              <img
                v-if="candidate.headshot"
                :src="candidate.headshot"
                :alt="candidate.name"
                class="candidate-headshot-img"
                @error="(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden') }"
              />
              <div class="candidate-headshot-fallback hidden">
                {{ getInitials(candidate.name) }}
              </div>
            </div>
            <div class="candidate-info">
              <h2 class="candidate-name">{{ candidate.name }}</h2>
              <p class="candidate-party">{{ candidate.party }}</p>
            </div>
          </div>
          <p v-if="candidate.summary" class="candidate-summary">{{ candidate.summary }}</p>
          <p class="talking-points-count">
            <span class="count-icon">●</span> {{ candidate.entries.length }} talking point{{ candidate.entries.length !== 1 ? 's' : '' }}
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
                <span v-if="entry.sourceCount > 0">
                  <span class="source-icon">●</span> Sources · {{ entry.sourceCount }}
                </span>
                <span v-else class="sources-pending">
                  <span class="source-icon">○</span> Sources pending
                </span>
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

        <div v-else class="no-talking-points">
          <span class="empty-icon">○</span>
          <p>No talking points available for this candidate yet.</p>
        </div>
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
  padding: 0 var(--space-lg) var(--space-3xl);
}

h1 {
  font-size: 2.25rem;
  margin-bottom: var(--space-md);
  font-weight: 700;
  color: var(--vp-c-text-1);
}

h2 {
  font-size: 1.5rem;
  margin: var(--space-2xl) 0 var(--space-md);
  font-weight: 600;
  color: var(--vp-c-text-1);
}

p {
  color: var(--vp-c-text-2);
  line-height: 1.65;
}

.quick-nav-container {
  margin: var(--space-lg) 0 var(--space-2xl);
  padding: var(--space-lg);
  background: var(--vp-c-bg-soft);
  border-radius: var(--radius-md);
  border: 1px solid var(--vp-c-divider);
  box-shadow: var(--shadow-lg);
}

.quick-nav-links {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: 0;
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: var(--vp-c-divider) transparent;
  padding-bottom: var(--space-xs);
}

.quick-nav-links::-webkit-scrollbar {
  height: 6px;
}

.quick-nav-links::-webkit-scrollbar-track {
  background: transparent;
  margin: var(--space-xs);
}

.quick-nav-links::-webkit-scrollbar-thumb {
  background: var(--vp-c-divider);
  border-radius: var(--radius-full);
}

.quick-nav-links::-webkit-scrollbar-thumb:hover {
  background: var(--vp-c-text-3);
}

.quick-nav-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-xs) var(--space-md);
  background: var(--vp-c-bg);
  color: var(--vp-c-brand);
  text-decoration: none;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  border: 1px solid var(--vp-c-divider);
  white-space: nowrap;
  flex-shrink: 0;
}

.quick-nav-link:hover,
.quick-nav-link:focus-visible {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand);
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.quick-nav-link.is-active {
  background: var(--brand-strong);
  color: white;
  border-color: var(--brand-strong);
  box-shadow: var(--shadow-md);
}

.quick-nav-select {
  display: block;
  margin-top: var(--space-md);
}

.candidate-select {
  width: 100%;
  padding: var(--space-sm);
  border-radius: var(--radius-sm);
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.9375rem;
  font-family: inherit;
}

.all-points-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xl);
}

.candidate-section {
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  background: var(--vp-c-bg);
  box-shadow: var(--shadow-lg);
  scroll-margin-top: 2rem;
}

.candidate-header {
  margin-bottom: var(--space-xl);
}

.candidate-header-main {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}

.candidate-avatar {
  position: relative;
  width: 60px;
  height: 60px;
  flex-shrink: 0;
}

.candidate-headshot-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--vp-c-divider);
  box-shadow: var(--shadow-sm);
}

.candidate-headshot-fallback {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  border: 2px solid var(--vp-c-divider);
}

.candidate-headshot-fallback.hidden {
  display: none;
}

.candidate-info {
  flex: 1;
  min-width: 0;
}

.candidate-name {
  margin: 0 0 0.25rem 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.candidate-party {
  margin: 0;
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.candidate-summary {
  margin: 0 0 var(--space-md) 0;
  color: var(--vp-c-text-2);
  line-height: 1.65;
}

.talking-points-count {
  margin: 0;
  font-size: 0.9375rem;
  color: var(--vp-c-text-3);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.count-icon {
  color: var(--vp-c-brand);
  font-size: 0.625rem;
}

.talking-points-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-lg);
}

.talking-point-card {
  background: var(--gradient-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  transition: all 0.2s ease;
  scroll-margin-top: 2rem;
}

.talking-point-card:hover,
.talking-point-card:focus-within {
  background: var(--gradient-medium);
  border-color: var(--vp-c-brand-light);
  box-shadow: var(--shadow-md);
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
  gap: var(--space-md);
  padding-top: var(--space-sm);
  border-top: 1px solid var(--vp-c-divider);
}

.card-sources {
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  margin: 0;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.source-icon {
  font-size: 0.5rem;
  color: var(--vp-c-brand);
}

.sources-pending {
  font-style: italic;
  opacity: 0.75;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.view-details-btn {
  padding: var(--space-xs) var(--space-md);
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
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
  box-shadow: var(--shadow-sm);
}

.view-details-btn:focus-visible {
  outline: 2px solid var(--vp-c-brand);
  outline-offset: 2px;
}

.view-details-btn:active {
  transform: translateY(0);
}

.no-talking-points {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  padding: var(--space-2xl);
  border: 2px dashed var(--vp-c-divider);
  border-radius: var(--radius-md);
  background: var(--vp-c-bg-soft);
  text-align: center;
}

.empty-icon {
  font-size: 2rem;
  color: var(--vp-c-text-3);
  opacity: 0.5;
}

.no-talking-points p {
  font-size: 1rem;
  color: var(--vp-c-text-3);
  font-style: italic;
  margin: 0;
}

@media (max-width: 768px) {
  .all-points-doc {
    padding: 0 var(--space-md) var(--space-2xl);
  }

  .candidate-section {
    padding: var(--space-lg);
  }

  .candidate-header-main {
    flex-direction: row;
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

  .talking-points-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .all-points-doc {
    padding: 0 var(--space-sm) var(--space-xl);
  }

  .quick-nav-container {
    padding: var(--space-md);
  }

  .talking-point-card {
    padding: var(--space-md);
  }

  .candidate-avatar {
    width: 50px;
    height: 50px;
  }
}
</style>
