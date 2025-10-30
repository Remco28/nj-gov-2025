# Task: Phase 4 All-Points Overview Page

## Context
- Phase 3 delivered the interactive “spin → bubble → modal” flow on `/candidates/`, but discovery is still random. Editors and power users need a deterministic index of every talking point so they can audit content, link to specific claims, and compare candidates side by side.
- The underlying data (`docs/content/candidates.json`) already stores structured `talkingPoints`, and the QA dashboard surfaces coverage gaps. Phase 4 unlocks a browsable catalog that reuses existing modal details without duplicating logic.
- This feature should sit alongside the QA dashboard in the information architecture, uses the same static stack (VitePress + Vue), and must respect accessibility patterns already established for the modal.

## Objectives
- Provide a dedicated `/all-points/` page that aggregates every candidate talking point in a scannable layout grouped by candidate.
- Allow users to open the existing talking point modal from the overview, with clear candidate context and deep-link support (`#candidate-id-talking-point-id`) for sharing specific claims.
- Ensure the solution stays within the static data pipeline—no new build-time tooling or external services—and leaves space for future filters (issues, tags) without major rewrites.

## Deliverables

1. **Data Aggregation Helpers (`docs/.vitepress/data/candidates.ts`)**
   - Introduce a typed helper to flatten candidate/talking point data:
     ```ts
     export interface CandidateTalkingPointEntry {
       candidateId: string
       candidateName: string
       candidateParty: string
       candidateSummary: string
       talkingPoint: TalkingPoint
       anchorId: string // e.g. `${candidateId}-${talkingPoint.id}`
     }
     ```
   - Add functions:
     - `getAllCandidateTalkingPoints(): CandidateTalkingPointEntry[]` — return entries ordered by candidate (preserve input order) and within each candidate keep original talking point order. Skip candidates with zero talking points.
     - `findCandidateTalkingPoint(anchorId: string): CandidateTalkingPointEntry | undefined` — resolve entries by the `anchorId` convention.
   - Guard against missing `talkingPoints` arrays and blank IDs. Derive `anchorId` by kebab-safe concatenation (`candidate.id` + '-' + `talkingPoint.id`) with both segments trimmed.
   - Update existing exports to re-export new types if needed. Maintain backward compatibility for current consumers.

2. **Modal Context Enhancements (`docs/.vitepress/theme/components/TalkingPointModal.vue` & `CandidateInteractive.vue`)**
   - Add an optional `contextLabel?: string` prop to the modal. When provided, render it as a small overline text above the title (include `aria-describedby` coverage so screen readers hear it).
   - Default styling: uppercase, letter-spaced, muted color using theme tokens. Ensure it collapses gracefully when empty.
   - Update `CandidateInteractive` to pass `${candidateData.value?.name} · ${candidateData.value?.party}` (or similar) so the modal consistently shows candidate context across the app.
   - Keep the modal’s accessibility behaviors (focus trap, scroll lock) intact. Verify TypeScript types allow the new prop without forcing existing callers to change unless they opt in.

3. **All-Points Overview Page (`docs/all-points/index.md`)**
   - Create the new page with frontmatter `title: "All Talking Points"` and a Vue `<script setup lang="ts">` block that:
     - Imports `ref`, `computed`, `onMounted` from Vue, plus `getAllCandidates`, `getAllCandidateTalkingPoints`, and `findCandidateTalkingPoint`.
     - Builds:
       - `const candidates = getAllCandidates()` for grouping.
       - `const entries = getAllCandidateTalkingPoints()`.
       - Reactive state for the modal: `const isModalOpen = ref(false)`, `const activeEntry = ref<CandidateTalkingPointEntry | null>(null)`.
       - Helper `const hashId = computed(() => window?.location.hash.slice(1) ?? '')` guarded for SSR.
   - Layout requirements:
     - Top-level hero (`# All Talking Points`) with a short description explaining deterministic browsing.
     - Quick navigation: render an inline list of anchor links for each candidate (e.g., `<a href="#mikie-sherrill">Mikie Sherrill</a>`). On narrow viewports, provide a `<select>` jump menu bound to the same anchor logic.
     - For each candidate (iterate over `candidates`), render a `<section>` with `id=candidate.id`, include name + party, optional summary text, and a count badge (`N talking points`).
     - Inside each section, display the candidate’s talking points as stacked cards:
       - Each card is an `<article>` with `id=anchorId`.
       - Show the talking point `title`, `summary`, source count (`Sources: X` or “Sources pending” when empty), and a button that opens the modal.
       - Buttons should have `@click` handlers that set `activeEntry` and `isModalOpen` and update `location.hash = anchorId`.
     - Include `TalkingPointModal` in the page, bound to `activeEntry?.talkingPoint`, `:open="isModalOpen"`, and pass `:context-label="activeEntry ? activeEntry.candidateName + ' · ' + activeEntry.candidateParty : ''"`. Emit close events to reset state and clear the hash (use `history.replaceState(null, '', window.location.pathname + window.location.search)`).
   - Deep-link behavior:
     - On `onMounted`, inspect `window.location.hash`. If it matches a valid `findCandidateTalkingPoint` entry, auto-open the modal for that entry after the next tick (so the modal has target data). Scroll to the anchor card before opening to maintain context.
     - When closing the modal, restore focus to the originating button if possible (store a reference or query by `data-anchor` attribute).
   - Include scoped styles for cards, quick-nav, and responsive adjustments mirroring existing visual language (soft backgrounds, border radius, theme color usage). Ensure focus states meet WCAG AA.

4. **Navigation & Documentation Updates**
   - Update `docs/.vitepress/config.mjs` navigation to insert `{ text: 'All Points', link: '/all-points/' }` between Candidates and QA Dashboard.
   - Add a short callout at the end of `docs/candidates/index.md` linking to `/all-points/` (e.g., “Looking for a full list? Visit the All Talking Points index.”).
   - Extend `docs/ARCHITECTURE.md` with a new subsection under “Interactive Flow” titled “All-Points Overview (Phase 4)” describing:
     - Purpose of the page.
     - Data helper usage and anchor/hash behavior.
     - Relationship to the interactive modal.
   - Update `NEXT_STEPS.md` to mark the Phase 4 checkbox for “Create the all-points overview page” as complete.

5. **Quality & Verification**
   - Run `npm run build` to ensure no TypeScript or VitePress errors.
   - Manual testing checklist:
     - Navigate to `/all-points/` in `npm run dev`, ensure anchor links, jump menu, and modal interactions work on desktop and mobile breakpoints.
     - Verify deep-link scenarios: Visiting `/all-points/#jack-ciattarelli-ciattarelli-taxes` opens the modal and highlights the correct entry; closing clears the hash.
     - Confirm the modal context label renders in both `/candidates/` and `/all-points/` flows without layout regressions.
   - Update `comms/log.md` with IMPL status entries when starting/finishing, per protocol.

## Acceptance Criteria
- `/all-points/` lists every talking point grouped by candidate with stable anchor IDs and accessible navigation.
- Clicking “View details” opens the existing modal with candidate context; deep links to specific talking points (hash fragments) open the same modal automatically.
- Hash updates, focus management, and scroll behavior follow SPA expectations (no full page reloads, hash cleared on close).
- Modal context enhancements appear on both interactive spinner flow and the new overview page.
- Navigation includes an “All Points” entry, and documentation reflects the new feature.
- `npm run build` succeeds without new warnings or errors.

## Non-Goals
- No search, filtering by issue tags, or pagination yet; Phase 4 only surfaces the full list with basic navigation anchors.
- No restructuring of `candidates.json` or introduction of claim-level markdown files (that belongs to later phases).
- No additional analytics or URL query parameters; hash fragments are sufficient for deep links.

## Open Questions
- None. If edge cases emerge (e.g., extremely long titles), surface them during implementation for follow-up guidance.
