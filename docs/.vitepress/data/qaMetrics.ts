/**
 * QA Metrics Data Module
 *
 * Provides quality assurance helpers for auditing candidate and talking point data.
 * These functions analyze the structured data to detect missing fields, duplicates,
 * and coverage gaps for content maintainers.
 */

import { getAllCandidates, countAllFollowUps, type Candidate, type TalkingPoint } from './candidates'

/**
 * Represents a single QA metric for display
 */
export interface QaMetric {
  /** Unique identifier for the metric */
  id: string
  /** Display label for the metric */
  label: string
  /** Calculated value (number or string) */
  value: number | string
  /** Optional target value for comparison */
  target?: string
  /** Status indicator */
  status: 'ok' | 'warning' | 'critical'
  /** Optional description providing context */
  description?: string
}

/**
 * Per-candidate QA statistics
 */
export interface CandidateQaStat {
  /** Candidate ID */
  id: string
  /** Candidate name */
  name: string
  /** Number of talking points */
  talkingPointCount: number
  /** Whether summary field is missing */
  missingSummary: boolean
  /** Whether headshot field is missing */
  missingHeadshot: boolean
  /** Whether headshot uses a placeholder URL */
  usesPlaceholderHeadshot: boolean
  /** Count of talking points missing details */
  missingDetailsCount: number
  /** Count of talking points missing sources */
  missingSourcesCount: number
}

/**
 * Represents a data quality issue
 */
export interface QaIssue {
  /** Unique identifier for the issue */
  id: string
  /** Short label for the issue */
  label: string
  /** Detailed description */
  description: string
  /** Issue severity */
  severity: 'warning' | 'critical'
}

/**
 * Helper to check if a string is effectively empty (null, undefined, or whitespace-only)
 */
function isBlank(value: string | undefined | null): boolean {
  return !value || value.trim() === ''
}

/**
 * Helper to check if a headshot URL is a placeholder
 */
function isPlaceholderHeadshot(url: string | undefined | null): boolean {
  if (isBlank(url)) {
    return true
  }
  return url!.toLowerCase().includes('placeholder.com')
}

/**
 * Get summary metrics for the entire dataset
 */
export function getQaSummaryMetrics(): QaMetric[] {
  const candidates = getAllCandidates()
  const totalCandidates = candidates.length

  // Calculate total talking points
  let totalTalkingPoints = 0
  let candidatesWithoutTalkingPoints = 0
  let talkingPointsWithSources = 0

  candidates.forEach(candidate => {
    const talkingPoints = candidate.talkingPoints || []
    totalTalkingPoints += talkingPoints.length

    if (talkingPoints.length === 0) {
      candidatesWithoutTalkingPoints++
    }

    talkingPoints.forEach(tp => {
      if (tp.sources && tp.sources.length > 0) {
        talkingPointsWithSources++
      }
    })
  })

  const avgTalkingPointsPerCandidate = totalCandidates > 0
    ? (totalTalkingPoints / totalCandidates).toFixed(1)
    : '0.0'

  // Count total follow-ups across all candidates
  const totalFollowUps = countAllFollowUps()

  return [
    {
      id: 'total-candidates',
      label: 'Total Candidates',
      value: totalCandidates,
      status: totalCandidates > 0 ? 'ok' : 'warning',
      description: 'Total number of candidates in the system'
    },
    {
      id: 'total-talking-points',
      label: 'Total Talking Points',
      value: totalTalkingPoints,
      status: totalTalkingPoints > 0 ? 'ok' : 'warning',
      description: 'Total number of talking points across all candidates'
    },
    {
      id: 'total-follow-ups',
      label: 'Total Follow-Up Questions',
      value: totalFollowUps,
      status: 'ok',
      description: 'Total number of follow-up questions across all topics (recursive count)'
    },
    {
      id: 'avg-talking-points',
      label: 'Avg Talking Points',
      value: avgTalkingPointsPerCandidate,
      target: '3+ per candidate',
      status: parseFloat(avgTalkingPointsPerCandidate) >= 3 ? 'ok' : 'warning',
      description: 'Average number of talking points per candidate'
    },
    {
      id: 'candidates-no-talking-points',
      label: 'Candidates w/o Talking Points',
      value: candidatesWithoutTalkingPoints,
      status: candidatesWithoutTalkingPoints === 0 ? 'ok' : 'critical',
      description: 'Candidates with zero talking points'
    },
    {
      id: 'talking-points-with-sources',
      label: 'Talking Points w/ Sources',
      value: talkingPointsWithSources,
      target: `${totalTalkingPoints} total`,
      status: talkingPointsWithSources === totalTalkingPoints ? 'ok' : 'warning',
      description: 'Number of talking points that have at least one source'
    }
  ]
}

/**
 * Get per-candidate QA statistics
 */
export function getCandidateQaStats(): CandidateQaStat[] {
  const candidates = getAllCandidates()

  return candidates.map(candidate => {
    const talkingPoints = candidate.talkingPoints || []

    let missingDetailsCount = 0
    let missingSourcesCount = 0

    talkingPoints.forEach(tp => {
      if (isBlank(tp.details)) {
        missingDetailsCount++
      }
      if (!tp.sources || tp.sources.length === 0) {
        missingSourcesCount++
      }
    })

    return {
      id: candidate.id,
      name: candidate.name,
      talkingPointCount: talkingPoints.length,
      missingSummary: isBlank(candidate.summary),
      missingHeadshot: isBlank(candidate.headshot),
      usesPlaceholderHeadshot: isPlaceholderHeadshot(candidate.headshot),
      missingDetailsCount,
      missingSourcesCount
    }
  })
}

/**
 * Get grouped QA issues
 */
export function getQaIssueGroups(): Record<string, QaIssue[]> {
  const candidates = getAllCandidates()

  const candidatesWithoutTalkingPoints: QaIssue[] = []
  const talkingPointsMissingDetails: QaIssue[] = []
  const talkingPointsMissingSources: QaIssue[] = []
  const duplicateTalkingPointIds: QaIssue[] = []
  const placeholderHeadshots: QaIssue[] = []

  // Track all talking point IDs to detect duplicates
  const talkingPointIdMap = new Map<string, string[]>() // id -> candidate names

  candidates.forEach(candidate => {
    const talkingPoints = candidate.talkingPoints || []

    // Check for candidates without talking points
    if (talkingPoints.length === 0) {
      candidatesWithoutTalkingPoints.push({
        id: `no-tp-${candidate.id}`,
        label: candidate.name,
        description: `${candidate.name} has no talking points defined`,
        severity: 'critical'
      })
    }

    // Check for placeholder headshots
    if (isPlaceholderHeadshot(candidate.headshot)) {
      placeholderHeadshots.push({
        id: `placeholder-${candidate.id}`,
        label: candidate.name,
        description: `${candidate.name} uses a placeholder headshot (${candidate.headshot || 'empty'})`,
        severity: 'warning'
      })
    }

    // Check talking point issues
    talkingPoints.forEach(tp => {
      // Track for duplicate detection
      if (!talkingPointIdMap.has(tp.id)) {
        talkingPointIdMap.set(tp.id, [])
      }
      talkingPointIdMap.get(tp.id)!.push(candidate.name)

      // Check for missing details
      if (isBlank(tp.details)) {
        talkingPointsMissingDetails.push({
          id: `missing-details-${tp.id}`,
          label: tp.title,
          description: `"${tp.title}" (${candidate.name}) is missing details field`,
          severity: 'warning'
        })
      }

      // Check for missing sources
      if (!tp.sources || tp.sources.length === 0) {
        talkingPointsMissingSources.push({
          id: `missing-sources-${tp.id}`,
          label: tp.title,
          description: `"${tp.title}" (${candidate.name}) has no sources`,
          severity: 'warning'
        })
      }
    })
  })

  // Detect duplicate talking point IDs
  talkingPointIdMap.forEach((candidateNames, tpId) => {
    if (candidateNames.length > 1) {
      duplicateTalkingPointIds.push({
        id: `duplicate-${tpId}`,
        label: tpId,
        description: `Talking point ID "${tpId}" is used by multiple candidates: ${candidateNames.join(', ')}`,
        severity: 'critical'
      })
    }
  })

  return {
    candidatesWithoutTalkingPoints,
    talkingPointsMissingDetails,
    talkingPointsMissingSources,
    duplicateTalkingPointIds,
    placeholderHeadshots
  }
}
