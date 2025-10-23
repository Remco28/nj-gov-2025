# Task: QA Dashboards for Content Coverage

## Context
- Phase 3 delivered the interactive “spin → bubble → modal” flow, and content editors can now add talking points via `docs/content/candidates.json`.
- As we scale the data set, we need an internal quality-assurance surface that tells us where coverage is thin (e.g., candidates missing talking points) or where required fields are incomplete (no details, no sources, placeholder imagery, duplicated IDs).
- This dashboard will be an internal tool surfaced inside VitePress so maintainers can audit the structured data before publishing new content.

## Objectives
- Provide a dedicated `/qa/` page that summarizes candidate/talking point coverage and highlights actionable data issues.
- Automate QA checks (counts, missing fields, duplicate IDs, placeholder assets) so editors can resolve gaps without manual scraping of JSON files.
- Keep everything in the existing static stack (VitePress + Vue) with zero runtime dependencies.

## Deliverables
1. **QA Metrics Data Module**
   - Create `docs/.vitepress/data/qaMetrics.ts` exporting typed helpers:
     - `QaMetric`: `{ id: string; label: string; value: number | string; target?: string; status: 'ok' | 'warning' | 'critical'; description?: string }`.
     - `CandidateQaStat`: `{ id: string; name: string; talkingPointCount: number; missingSummary: boolean; missingHeadshot: boolean; usesPlaceholderHeadshot: boolean; missingDetailsCount: number; missingSourcesCount: number }`.
     - `QaIssue`: `{ id: string; label: string; description: string; severity: 'warning' | 'critical' }`.
   - Export functions (pure, synchronous):
     - `getQaSummaryMetrics(): QaMetric[]` — totals/averages (total candidates, total talking points, average per candidate, candidates with zero talking points, talking points with sources).
     - `getCandidateQaStats(): CandidateQaStat[]` — per-candidate coverage + counts of missing fields.
     - `getQaIssueGroups(): Record<string, QaIssue[]>` — keyed groups for: `candidatesWithoutTalkingPoints`, `talkingPointsMissingDetails`, `talkingPointsMissingSources`, `duplicateTalkingPointIds`, `placeholderHeadshots`.
   - Rules:
     - Treat blank or whitespace-only strings as missing.
     - “Placeholder headshot” = URL containing `placeholder.com` (case-insensitive) or empty.
     - Identify duplicate talking point IDs globally (across all candidates) and include both candidate name + ID in the issue description.
     - Flag talking points without at least one source entry (`sources` missing or empty array).
     - Ensure helpers gracefully handle candidates lacking `talkingPoints`.

2. **QA Vue Components (place under `docs/.vitepress/theme/components/qa/`)**
   - `QaMetricCard.vue`
     - Props: `{ title: string; value: number | string; status: 'ok' | 'warning' | 'critical'; description?: string; target?: string }`.
     - Render a responsive card with semantic heading, large value, optional target line (`Target: ...`), and status-based accent (green/amber/red). Include `aria-label` so screen readers hear status.
   - `QaMetricGrid.vue`
     - Props: `{ metrics: QaMetric[] }`.
     - Displays a CSS grid (min 3 columns on desktop, 1 column on mobile) of `QaMetricCard`.
   - `QaIssueList.vue`
     - Props: `{ title: string; items: QaIssue[]; emptyMessage?: string }`.
     - Renders a bordered list (or table) with each issue showing label, description, and severity badge (warning = amber, critical = red).
     - If `items.length === 0`, show `emptyMessage` (“No issues detected”) with muted styling.
   - Export the components via `docs/.vitepress/theme/index.ts` so they are globally usable.
   - Keep styling consistent with existing theme variables; ensure accessible contrast (WCAG AA).

3. **QA Dashboard Page**
   - Add `docs/qa/index.md`:
     - YAML frontmatter with `title: "QA Dashboard"`.
     - `<script setup lang="ts">` block that imports the helpers (`getQaSummaryMetrics`, `getCandidateQaStats`, `getQaIssueGroups`) and computes:
       ```ts
       const summaryMetrics = getQaSummaryMetrics()
       const candidateStats = getCandidateQaStats()
       const issueGroups = getQaIssueGroups()
       ```
     - Sections:
       1. `# QA Dashboard` hero text clarifying it’s an internal tooling page.
       2. `## Summary Metrics` using `<QaMetricGrid :metrics="summaryMetrics" />`.
       3. `## Candidate Coverage` table (plain `<table>`) with columns: Candidate, Talking Points, Missing Details, Missing Sources, Placeholder Headshot. Highlight rows with zero talking points or placeholder headshots (e.g., add `.qa-row--warning` class).
       4. `## Data Quality Warnings` — for each key in `issueGroups`, render `<QaIssueList>` with human-friendly titles:
          - `Candidates Missing Talking Points`
          - `Talking Points Missing Details`
          - `Talking Points Missing Sources`
          - `Duplicate Talking Point IDs`
          - `Placeholder Headshots`
       - When a group is empty, the component should show “No issues detected”.
     - Add a “Next Steps” note reminding editors to resolve `critical` issues before publishing.
   - Ensure the page works with SPA navigation (no SSR-only APIs).

4. **Navigation & Theme Updates**
   - Update `docs/.vitepress/config.mjs` `nav` array to include `{ text: 'QA Dashboard', link: '/qa/' }` after Candidates.
   - Do not expose the QA page in the sidebar (keep sidebar unchanged).

5. **Documentation Updates**
   - `docs/ARCHITECTURE.md`: Append a new subsection under “Runtime & Operations Notes” titled “Quality Assurance Dashboard” describing:
     - Purpose of the QA page.
     - High-level overview of the metrics/issue groups.
     - Guidance that it’s for maintainers and relies solely on static data inspection.
   - `docs/content/README.md`: Add a short “QA Checklist” section advising editors to review `/qa/` after data updates and what common warnings mean.

6. **Quality Checks**
   - Run `npm run build` and ensure it succeeds.
   - Manual verification in dev server (`npm run dev`) that `/qa/` renders, navigation works, and issue badges behave as expected.
   - No linting or formatting regressions; keep new TypeScript code strongly typed.

## Acceptance Criteria
- Visiting `/qa/` displays summary cards, candidate table, and issue lists populated from live `candidates.json` data.
- Duplicate talking point IDs and missing data are accurately surfaced; empty states render correctly.
- Navigation includes “QA Dashboard” and remains functional in SPA mode.
- Architecture and content docs reference the QA dashboard.
- `npm run build` passes without new warnings or errors.

## Non-Goals
- No authentication or role-based gating (public visibility is acceptable for now).
- No charts or external visualization libraries; stick to lightweight Vue/HTML components.
- No mutation of data; dashboard is read-only and purely diagnostic.

## Follow-Up
- Once implementation is merged and reviewed, archive this spec to `comms/tasks/archive/`.
- Future iteration: expand QA checks to include issue taxonomy once issue-level content exists.
