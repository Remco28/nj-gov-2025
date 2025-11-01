/**
 * Navigation Stack State Management Composable
 *
 * Manages hierarchical navigation through topics and follow-up questions.
 * Maintains a stack of navigation nodes to support back button behavior.
 */

import { ref, computed, type Ref } from 'vue'
import type { TalkingPoint, FollowUp } from '../candidates'

/**
 * Represents a node in the navigation stack
 * Discriminated union to distinguish between topics and follow-ups
 */
export type NavigationNode =
  | { type: 'topic'; node: TalkingPoint }
  | { type: 'followUp'; node: FollowUp }

/**
 * Composable for managing navigation stack through topics and follow-ups
 * @returns Navigation state and methods
 */
export function useNavigationStack() {
  /**
   * The navigation stack (path from root topic to current node)
   * Index 0 is always the root topic, subsequent indices are follow-ups
   */
  const navigationStack = ref<NavigationNode[]>([])

  /**
   * Get the current depth in the navigation hierarchy
   * 0 = at root topic, 1+ = in follow-ups
   */
  const depth = computed(() => navigationStack.value.length - 1)

  /**
   * Get the currently active node (last item in stack)
   */
  const currentNode = computed(() => {
    const stack = navigationStack.value
    return stack.length > 0 ? stack[stack.length - 1] : null
  })

  /**
   * Get the root topic (first item in stack)
   */
  const rootTopic = computed(() => {
    const stack = navigationStack.value
    return stack.length > 0 && stack[0].type === 'topic' ? stack[0].node : null
  })

  /**
   * Get the previous node in the stack (for back button context)
   */
  const previousNode = computed(() => {
    const stack = navigationStack.value
    return stack.length > 1 ? stack[stack.length - 2] : null
  })

  /**
   * Open a top-level topic (clears stack and sets new root)
   * @param topic - The talking point to open
   */
  function openTopic(topic: TalkingPoint): void {
    navigationStack.value = [{ type: 'topic', node: topic }]
  }

  /**
   * Open a follow-up question (pushes onto stack)
   * @param followUp - The follow-up to open
   */
  function openFollowUp(followUp: FollowUp): void {
    // Only push if we have a valid stack
    if (navigationStack.value.length === 0) {
      console.warn('Cannot open follow-up without an active topic')
      return
    }

    navigationStack.value = [...navigationStack.value, { type: 'followUp', node: followUp }]
  }

  /**
   * Navigate back to the previous level
   * Returns true if navigation occurred, false if already at root
   */
  function goBack(): boolean {
    if (navigationStack.value.length <= 1) {
      // Already at root topic, cannot go back further
      return false
    }

    // Remove the last item from the stack
    navigationStack.value = navigationStack.value.slice(0, -1)
    return true
  }

  /**
   * Reset the entire navigation stack
   * Clears all state
   */
  function reset(): void {
    navigationStack.value = []
  }

  /**
   * Get the title/prompt of a node for display purposes
   * @param node - The navigation node
   * @returns Display string for the node
   */
  function getNodeTitle(node: NavigationNode | null): string {
    if (!node) return ''
    return node.type === 'topic' ? node.node.title : node.node.prompt
  }

  /**
   * Get the summary of the current node
   */
  const currentSummary = computed(() => {
    const node = currentNode.value
    if (!node) return ''
    return node.node.summary
  })

  /**
   * Get the details of the current node
   */
  const currentDetails = computed(() => {
    const node = currentNode.value
    if (!node) return undefined
    return node.node.details
  })

  /**
   * Get the sources of the current node
   */
  const currentSources = computed(() => {
    const node = currentNode.value
    if (!node) return undefined
    return node.node.sources
  })

  /**
   * Get the follow-ups of the current node
   */
  const currentFollowUps = computed(() => {
    const node = currentNode.value
    if (!node) return undefined
    return node.node.followUps
  })

  return {
    // State
    navigationStack: navigationStack as Ref<readonly NavigationNode[]>,
    depth,
    currentNode,
    rootTopic,
    previousNode,
    currentSummary,
    currentDetails,
    currentSources,
    currentFollowUps,

    // Methods
    openTopic,
    openFollowUp,
    goBack,
    reset,
    getNodeTitle
  }
}
