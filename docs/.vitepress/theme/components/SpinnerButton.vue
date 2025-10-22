<script setup lang="ts">
/**
 * SpinnerButton Component
 *
 * A circular button that triggers the "spin" action to select a random talking point.
 * Includes proper accessibility attributes and keyboard support.
 */

interface Props {
  /** Button label text */
  label?: string
  /** Whether the button is in a loading/spinning state */
  loading?: boolean
  /** Whether the button is disabled */
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  label: 'Spin for a Talking Point',
  loading: false,
  disabled: false
})

interface Emits {
  /** Emitted when the button is clicked or activated */
  (e: 'spin'): void
}

const emit = defineEmits<Emits>()

function handleClick() {
  emit('spin')
}

function handleKeyDown(event: KeyboardEvent) {
  // Support Enter and Space keys for accessibility
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('spin')
  }
}
</script>

<template>
  <button
    class="spinner-button"
    role="button"
    :aria-label="label"
    :aria-busy="loading"
    :disabled="disabled || loading"
    @click="handleClick"
    @keydown="handleKeyDown"
  >
    <span class="spinner-icon" :class="{ spinning: loading }">
      {{ loading ? '⟳' : '🎲' }}
    </span>
    <span class="spinner-label">{{ label }}</span>
  </button>
</template>

<style scoped>
.spinner-button {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  border: 2px solid var(--vp-c-brand);
  border-radius: 50%;
  background: var(--vp-c-bg);
  color: var(--vp-c-brand);
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  min-height: 120px;
  font-family: inherit;
}

.spinner-button:hover:not(:disabled) {
  background: var(--vp-c-brand-soft);
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.spinner-button:focus-visible {
  outline: 3px solid var(--vp-c-brand);
  outline-offset: 4px;
}

.spinner-button:active:not(:disabled) {
  transform: scale(0.95);
}

.spinner-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: var(--vp-c-text-3);
  color: var(--vp-c-text-3);
}

.spinner-icon {
  font-size: 2.5rem;
  line-height: 1;
  transition: transform 0.3s ease;
}

.spinner-icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spinner-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  max-width: 100px;
  line-height: 1.2;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .spinner-button {
    min-width: 100px;
    min-height: 100px;
    padding: 1rem;
  }

  .spinner-icon {
    font-size: 2rem;
  }

  .spinner-label {
    font-size: 0.7rem;
  }
}
</style>
