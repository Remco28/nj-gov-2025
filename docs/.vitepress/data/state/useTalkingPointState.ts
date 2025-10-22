/**
 * Talking Point State Management Composable
 *
 * Provides reactive state management for the interactive talking point experience.
 * Tracks the active talking point and prevents showing the same point twice in a row.
 */

import { ref } from 'vue'
import { getRandomTalkingPoint, type TalkingPoint } from '../candidates'

/**
 * Composable for managing talking point state for a specific candidate
 * @param candidateId - The candidate's unique identifier
 * @returns State and methods for managing talking points
 */
export function useTalkingPointState(candidateId: string) {
  /**
   * The currently active talking point ID, or null if none active
   */
  const activeTalkingPointId = ref<string | null>(null)

  /**
   * The last talking point ID shown, used to prevent showing the same point twice
   */
  const lastTalkingPointId = ref<string | null>(null)

  /**
   * The current talking point object, or null if none active
   */
  const currentTalkingPoint = ref<TalkingPoint | null>(null)

  /**
   * Spin for a random talking point
   * Avoids showing the same talking point twice in a row
   * @returns The selected talking point, or null if none available
   */
  function spin(): TalkingPoint | null {
    // Get a random talking point, excluding the last one shown
    const point = getRandomTalkingPoint(candidateId, lastTalkingPointId.value || undefined)

    if (point) {
      // Update state with the new talking point
      activeTalkingPointId.value = point.id
      lastTalkingPointId.value = point.id
      currentTalkingPoint.value = point
    } else {
      // No talking points available
      activeTalkingPointId.value = null
      currentTalkingPoint.value = null
    }

    return point
  }

  /**
   * Reset the talking point state
   * Clears the active talking point but preserves last shown to prevent repeats
   */
  function reset(): void {
    activeTalkingPointId.value = null
    currentTalkingPoint.value = null
  }

  /**
   * Clear all state including the last shown tracking
   * Use this to allow the same point to be shown again
   */
  function clearAll(): void {
    activeTalkingPointId.value = null
    lastTalkingPointId.value = null
    currentTalkingPoint.value = null
  }

  return {
    activeTalkingPointId,
    lastTalkingPointId,
    currentTalkingPoint,
    spin,
    reset,
    clearAll
  }
}
