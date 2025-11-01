/**
 * Candidate data access layer
 *
 * This module provides typed access to the candidate data stored in
 * docs/content/candidates.json. It's used by both Markdown pages and
 * Vue components to maintain a single source of truth for candidate information.
 */

import candidatesData from '../../content/candidates.json'

/**
 * Represents a source citation for a talking point
 */
export interface TalkingPointSource {
  /** Display label for the source */
  label: string
  /** URL to the source */
  url: string
}

/**
 * Represents a follow-up question/answer node in a recursive chain
 * Follow-ups use 'prompt' instead of 'title' to distinguish them from top-level topics
 */
export interface FollowUp {
  /** Unique identifier for the follow-up */
  id: string
  /** Question prompt displayed as a button (e.g., "How does this work?") */
  prompt: string
  /** 1-2 sentence answer summary */
  summary: string
  /** Optional longer explanation */
  details?: string
  /** Optional source citations */
  sources?: TalkingPointSource[]
  /** Optional nested follow-up questions (recursive structure) */
  followUps?: FollowUp[]
}

/**
 * Represents a candidate's talking point or position (top-level topic)
 */
export interface TalkingPoint {
  /** Unique identifier for the talking point */
  id: string
  /** Short headline for the talking point */
  title: string
  /** 1-2 sentence summary for display in speech bubble */
  summary: string
  /** Longer detailed explanation for modal display */
  details?: string
  /** Array of source citations */
  sources?: TalkingPointSource[]
  /** Optional nested follow-up questions */
  followUps?: FollowUp[]
}

/**
 * Represents a single political candidate
 */
export interface Candidate {
  /** Unique identifier for the candidate (kebab-case) */
  id: string
  /** Full name of the candidate */
  name: string
  /** Political party affiliation */
  party: string
  /** URL to candidate's headshot image */
  headshot: string
  /** Brief summary or bio of the candidate */
  summary: string
  /** Array of issue positions (for future use) */
  issues: string[]
  /** Array of talking points */
  talkingPoints?: TalkingPoint[]
}

/**
 * Get all candidates in the system
 * @returns Array of all candidate objects
 */
export function getAllCandidates(): Candidate[] {
  return candidatesData.candidates as Candidate[]
}

/**
 * Get a specific candidate by their ID
 * @param id - The candidate's unique identifier
 * @returns The candidate object, or undefined if not found
 */
export function getCandidateById(id: string): Candidate | undefined {
  return candidatesData.candidates.find(candidate => candidate.id === id) as Candidate | undefined
}

/**
 * Get the total number of candidates
 * @returns Count of all candidates
 */
export function getCandidateCount(): number {
  return candidatesData.candidates.length
}

/**
 * Get all top-level talking points for a specific candidate
 * Note: This returns only top-level topics, not nested follow-ups
 * @param candidateId - The candidate's unique identifier
 * @returns Array of talking points, or empty array if candidate not found or has no talking points
 */
export function getTalkingPointsByCandidate(candidateId: string): TalkingPoint[] {
  const candidate = getCandidateById(candidateId)
  return candidate?.talkingPoints || []
}

/**
 * Get a random talking point for a candidate, optionally excluding a specific one
 * Note: This selects only from top-level topics, not nested follow-ups
 * @param candidateId - The candidate's unique identifier
 * @param excludeId - Optional talking point ID to exclude from selection
 * @returns A random talking point, or null if none available
 */
export function getRandomTalkingPoint(candidateId: string, excludeId?: string): TalkingPoint | null {
  const talkingPoints = getTalkingPointsByCandidate(candidateId)

  if (talkingPoints.length === 0) {
    return null
  }

  // Filter out the excluded talking point if specified
  const availablePoints = excludeId
    ? talkingPoints.filter(point => point.id !== excludeId)
    : talkingPoints

  // If all points are filtered out, return any point
  if (availablePoints.length === 0) {
    return talkingPoints[Math.floor(Math.random() * talkingPoints.length)]
  }

  // Return a random point from available points
  return availablePoints[Math.floor(Math.random() * availablePoints.length)]
}

/**
 * Represents a flattened candidate talking point entry for aggregation views
 */
export interface CandidateTalkingPointEntry {
  /** Candidate unique identifier */
  candidateId: string
  /** Candidate full name */
  candidateName: string
  /** Candidate party affiliation */
  candidateParty: string
  /** Candidate summary/bio */
  candidateSummary: string
  /** The talking point data */
  talkingPoint: TalkingPoint
  /** Composite anchor ID for deep-linking (candidateId-talkingPointId) */
  anchorId: string
}

/**
 * Get all candidate talking points flattened into a single array
 * Ordered by candidate (preserving input order), then by talking point order within each candidate
 * @returns Array of flattened candidate talking point entries
 */
export function getAllCandidateTalkingPoints(): CandidateTalkingPointEntry[] {
  const entries: CandidateTalkingPointEntry[] = []
  const candidates = getAllCandidates()

  for (const candidate of candidates) {
    // Skip candidates with no talking points
    if (!candidate.talkingPoints || candidate.talkingPoints.length === 0) {
      continue
    }

    for (const talkingPoint of candidate.talkingPoints) {
      // Guard against missing IDs
      if (!candidate.id || !talkingPoint.id) {
        continue
      }

      // Create composite anchor ID (kebab-safe)
      const anchorId = `${candidate.id.trim()}-${talkingPoint.id.trim()}`

      entries.push({
        candidateId: candidate.id,
        candidateName: candidate.name,
        candidateParty: candidate.party,
        candidateSummary: candidate.summary,
        talkingPoint,
        anchorId
      })
    }
  }

  return entries
}

/**
 * Find a specific candidate talking point entry by anchor ID
 * @param anchorId - The composite anchor ID (candidateId-talkingPointId)
 * @returns The matching entry, or undefined if not found
 */
export function findCandidateTalkingPoint(anchorId: string): CandidateTalkingPointEntry | undefined {
  const entries = getAllCandidateTalkingPoints()
  return entries.find(entry => entry.anchorId === anchorId)
}

/**
 * Maximum depth for follow-up traversal to prevent infinite loops
 */
const MAX_FOLLOWUP_DEPTH = 10

/**
 * Recursively count all follow-ups in a follow-up tree
 * Includes depth limit to prevent infinite loops from circular references
 * @param followUps - Array of follow-ups to count
 * @param currentDepth - Current recursion depth (used internally)
 * @returns Total count of all follow-ups in the tree
 */
export function countFollowUps(followUps: FollowUp[] | undefined, currentDepth = 0): number {
  if (!followUps || followUps.length === 0 || currentDepth >= MAX_FOLLOWUP_DEPTH) {
    return 0
  }

  let count = followUps.length

  for (const followUp of followUps) {
    if (followUp.followUps && followUp.followUps.length > 0) {
      count += countFollowUps(followUp.followUps, currentDepth + 1)
    }
  }

  return count
}

/**
 * Flatten a follow-up tree into a single array
 * Includes depth limit to prevent infinite loops from circular references
 * @param followUps - Array of follow-ups to flatten
 * @param currentDepth - Current recursion depth (used internally)
 * @returns Flattened array of all follow-ups
 */
export function flattenFollowUps(followUps: FollowUp[] | undefined, currentDepth = 0): FollowUp[] {
  if (!followUps || followUps.length === 0 || currentDepth >= MAX_FOLLOWUP_DEPTH) {
    return []
  }

  const flattened: FollowUp[] = []

  for (const followUp of followUps) {
    flattened.push(followUp)

    if (followUp.followUps && followUp.followUps.length > 0) {
      flattened.push(...flattenFollowUps(followUp.followUps, currentDepth + 1))
    }
  }

  return flattened
}

/**
 * Count all follow-ups across all candidates
 * Useful for QA metrics and content auditing
 * @returns Total count of all follow-ups in the system
 */
export function countAllFollowUps(): number {
  const candidates = getAllCandidates()
  let totalCount = 0

  for (const candidate of candidates) {
    const talkingPoints = candidate.talkingPoints || []

    for (const talkingPoint of talkingPoints) {
      totalCount += countFollowUps(talkingPoint.followUps)
    }
  }

  return totalCount
}
