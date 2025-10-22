<script setup lang="ts">
/**
 * TalkingPointBubble Component
 *
 * Displays a talking point in a speech bubble style.
 * Clickable to open the full details modal.
 * Includes keyboard support and subtle animations.
 */

interface Props {
  /** The talking point title */
  title: string
  /** Brief summary text */
  summary: string
  /** Whether the bubble is visible */
  visible?: boolean
}

withDefaults(defineProps<Props>(), {
  visible: true
})

interface Emits {
  /** Emitted when the bubble is clicked to open details */
  (e: 'open'): void
}

const emit = defineEmits<Emits>()

function handleClick() {
  emit('open')
}

function handleKeyDown(event: KeyboardEvent) {
  // Support Enter and Space keys for accessibility
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('open')
  }
}
</script>

<template>
  <div
    v-if="visible"
    class="talking-point-bubble"
    role="button"
    tabindex="0"
    :aria-label="`View details about ${title}`"
    @click="handleClick"
    @keydown="handleKeyDown"
  >
    <div class="bubble-content">
      <h3 class="bubble-title">{{ title }}</h3>
      <p class="bubble-summary">{{ summary }}</p>
      <span class="bubble-hint">Click for details →</span>
    </div>
    <div class="bubble-tail"></div>
  </div>
</template>

<style scoped>
.talking-point-bubble {
  position: relative;
  max-width: 500px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-brand-soft);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: bubble-in 0.4s ease-out;
}

@keyframes bubble-in {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.talking-point-bubble:hover {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.talking-point-bubble:focus-visible {
  outline: 3px solid var(--vp-c-brand);
  outline-offset: 4px;
}

.talking-point-bubble:active {
  transform: translateY(0) scale(0.98);
}

.bubble-content {
  position: relative;
  z-index: 1;
}

.bubble-title {
  margin: 0 0 0.75rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-brand);
  line-height: 1.3;
}

.bubble-summary {
  margin: 0 0 1rem 0;
  color: var(--vp-c-text-1);
  line-height: 1.6;
  font-size: 1rem;
}

.bubble-hint {
  display: inline-block;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
  transition: transform 0.2s ease;
}

.talking-point-bubble:hover .bubble-hint {
  transform: translateX(4px);
  color: var(--vp-c-brand);
}

.bubble-tail {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid var(--vp-c-bg-soft);
  transition: border-top-color 0.3s ease;
}

.talking-point-bubble:hover .bubble-tail {
  border-top-color: var(--vp-c-brand-soft);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .talking-point-bubble {
    max-width: 100%;
    padding: 1.25rem;
    margin: 1.5rem 0;
  }

  .bubble-title {
    font-size: 1.125rem;
  }

  .bubble-summary {
    font-size: 0.9375rem;
  }
}
</style>
