/**
 * Candidate data access layer
 *
 * This module provides typed access to the candidate data stored in
 * docs/content/candidates.json. It's used by both Markdown pages and
 * Vue components to maintain a single source of truth for candidate information.
 */

import candidatesData from '../../content/candidates.json'

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
}

/**
 * Get all candidates in the system
 * @returns Array of all candidate objects
 */
export function getAllCandidates(): Candidate[] {
  return candidatesData.candidates
}

/**
 * Get a specific candidate by their ID
 * @param id - The candidate's unique identifier
 * @returns The candidate object, or undefined if not found
 */
export function getCandidateById(id: string): Candidate | undefined {
  return candidatesData.candidates.find(candidate => candidate.id === id)
}

/**
 * Get the total number of candidates
 * @returns Count of all candidates
 */
export function getCandidateCount(): number {
  return candidatesData.candidates.length
}
