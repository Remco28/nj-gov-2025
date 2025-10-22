<script setup lang="ts">
/**
 * TalkingPointModal Component
 *
 * Modal dialog for displaying full talking point details.
 * Includes focus trapping, escape key handling, and overlay click to close.
 * Follows accessible dialog pattern with ARIA attributes.
 */

import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import type { TalkingPoint } from '../../data/candidates'

interface Props {
  /** The talking point to display */
  talkingPoint: TalkingPoint | null
  /** Whether the modal is open */
  open: boolean
}

const props = defineProps<Props>()

interface Emits {
  /** Emitted when the modal should be closed */
  (e: 'close'): void
}

const emit = defineEmits<Emits>()

const modalRef = ref<HTMLElement | null>(null)
const closeButtonRef = ref<HTMLButtonElement | null>(null)
const focusableElements = ref<HTMLElement[]>([])
const lastActiveElement = ref<HTMLElement | null>(null)

function close() {
  emit('close')
}

function handleOverlayClick(event: MouseEvent) {
  // Close only if clicking the overlay itself, not its children
  if (event.target === event.currentTarget) {
    close()
  }
}

function handleEscapeKey(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.open) {
    close()
  }
}

function handleTabKey(event: KeyboardEvent) {
  if (!props.open || !modalRef.value) return

  // Get all focusable elements within the modal
  const focusable = Array.from(
    modalRef.value.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ) as HTMLElement[]

  if (focusable.length === 0) return

  const firstElement = focusable[0]
  const lastElement = focusable[focusable.length - 1]

  // Trap focus within modal
  if (event.key === 'Tab') {
    if (event.shiftKey) {
      // Shift + Tab: if on first element, move to last
      if (document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      }
    } else {
      // Tab: if on last element, move to first
      if (document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }
  }
}

// Lock/unlock body scroll
function lockBodyScroll() {
  document.body.style.overflow = 'hidden'
}

function unlockBodyScroll() {
  document.body.style.overflow = ''
}

// Watch for open state changes
watch(() => props.open, async (isOpen) => {
  if (isOpen) {
    // Save the currently focused element to restore later
    lastActiveElement.value = document.activeElement as HTMLElement
    lockBodyScroll()

    // Focus the close button after the modal is rendered
    await nextTick()
    closeButtonRef.value?.focus()
  } else {
    unlockBodyScroll()

    // Restore focus to the element that opened the modal
    if (lastActiveElement.value && typeof lastActiveElement.value.focus === 'function') {
      lastActiveElement.value.focus()
    }
  }
})

// Setup keyboard listeners
onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey)
  document.addEventListener('keydown', handleTabKey)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey)
  document.removeEventListener('keydown', handleTabKey)
  unlockBodyScroll()
})
</script>

<template>
  <Transition name="modal">
    <div
      v-if="open && talkingPoint"
      class="modal-overlay"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="`modal-title-${talkingPoint.id}`"
      @click="handleOverlayClick"
    >
      <div ref="modalRef" class="modal-container">
        <div class="modal-header">
          <h2 :id="`modal-title-${talkingPoint.id}`" class="modal-title">
            {{ talkingPoint.title }}
          </h2>
          <button
            ref="closeButtonRef"
            class="modal-close"
            aria-label="Close talking point"
            @click="close"
          >
            ✕
          </button>
        </div>

        <div class="modal-body">
          <p class="modal-summary">{{ talkingPoint.summary }}</p>

          <div v-if="talkingPoint.details" class="modal-details">
            <h3 class="details-heading">Details</h3>
            <p>{{ talkingPoint.details }}</p>
          </div>

          <div v-if="talkingPoint.sources && talkingPoint.sources.length > 0" class="modal-sources">
            <h3 class="sources-heading">Sources</h3>
            <ul class="sources-list">
              <li v-for="(source, index) in talkingPoint.sources" :key="index">
                <a
                  :href="source.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="source-link"
                >
                  {{ source.label }}
                  <span class="external-icon">↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="modal-footer">
          <button class="modal-action-close" @click="close">
            Close
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
  overflow-y: auto;
}

.modal-container {
  background: var(--vp-c-bg);
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.modal-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--vp-c-brand);
  line-height: 1.3;
  flex: 1;
}

.modal-close {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border: none;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
}

.modal-close:focus-visible {
  outline: 2px solid var(--vp-c-brand);
  outline-offset: 2px;
}

.modal-body {
  padding: 1.5rem;
}

.modal-summary {
  font-size: 1.125rem;
  color: var(--vp-c-text-1);
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  font-weight: 500;
}

.modal-details {
  margin-bottom: 1.5rem;
}

.details-heading,
.sources-heading {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 0.75rem 0;
}

.modal-details p {
  color: var(--vp-c-text-2);
  line-height: 1.7;
  margin: 0;
}

.sources-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.source-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--vp-c-brand);
  text-decoration: none;
  transition: all 0.2s ease;
  font-weight: 500;
}

.source-link:hover {
  color: var(--vp-c-brand-dark);
  text-decoration: underline;
}

.source-link:focus-visible {
  outline: 2px solid var(--vp-c-brand);
  outline-offset: 2px;
  border-radius: 2px;
}

.external-icon {
  font-size: 0.875em;
  opacity: 0.7;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--vp-c-divider);
  display: flex;
  justify-content: flex-end;
}

.modal-action-close {
  padding: 0.625rem 1.5rem;
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  font-size: 0.9375rem;
}

.modal-action-close:hover {
  background: var(--vp-c-brand-dark);
  transform: translateY(-1px);
}

.modal-action-close:focus-visible {
  outline: 2px solid var(--vp-c-brand);
  outline-offset: 2px;
}

.modal-action-close:active {
  transform: translateY(0);
}

/* Transition animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
  opacity: 0;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .modal-overlay {
    padding: 0;
    align-items: flex-end;
  }

  .modal-container {
    max-height: 95vh;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .modal-summary {
    font-size: 1rem;
  }
}
</style>
