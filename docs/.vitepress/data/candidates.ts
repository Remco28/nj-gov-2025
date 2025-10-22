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
 * Represents a candidate's talking point or position
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
 * Get all talking points for a specific candidate
 * @param candidateId - The candidate's unique identifier
 * @returns Array of talking points, or empty array if candidate not found or has no talking points
 */
export function getTalkingPointsByCandidate(candidateId: string): TalkingPoint[] {
  const candidate = getCandidateById(candidateId)
  return candidate?.talkingPoints || []
}

/**
 * Get a random talking point for a candidate, optionally excluding a specific one
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
