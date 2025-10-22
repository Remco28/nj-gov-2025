# Task: Phase 3 – Interactive Candidate Experience

## Context
- Phase 2 introduced a modular, data-driven structure for candidates. Pages now consume a shared candidate dataset via Vue components.
- `NEXT_STEPS.md` lists Phase 3 as building interactive components (spinner, speech bubble, modal).
- We need to layer interactivity on top of the existing content so users can spin for a random talking point, see a speech bubble, and dive into details via a modal/dialog.
- No claim-level data files exist yet; the spec should rely on placeholder structures that can be expanded during Phase 4.

## Objectives
- Implement reusable, accessible Vue components that deliver the “spin → speech bubble → modal” flow.
- Wire these components to candidate-specific talking points loaded from a structured source, while keeping the system flexible for future expansion (Phase 4 all-points overview).
- Ensure the experience works in SPA mode, with graceful behavior on mobile and keyboard navigation support.

## Deliverables
1. **Data Layer Extensions**
   - Add a `talkingPoints` array to `docs/content/candidates.json` for each candidate. Each entry should include:
     - `id`: unique identifier (string)
     - `title`: short headline
     - `summary`: 1–2 sentence blurb for the speech bubble
     - `details`: optional longer text for modal body (placeholder copy is fine)
     - `sources`: optional array with `{ label, url }` objects
   - Update `docs/.vitepress/data/candidates.ts` with:
     - `TalkingPoint` interface
     - Helpers: `getTalkingPointsByCandidate(id)`, `getRandomTalkingPoint(id, excludeId?)`.
   - Guard against candidates missing talking points by returning empty arrays.

2. **State Management Utilities**
   - Create `docs/.vitepress/data/state/useTalkingPointState.ts` exporting a composable:
     ```ts
     export function useTalkingPointState(candidateId: string) {
       const activeTalkingPointId = ref<string | null>(null)
       const lastTalkingPointId = ref<string | null>(null)
       function spin(): TalkingPoint | null { /* picks random, avoids same twice */ }
       function reset(): void
       return { activeTalkingPointId, lastTalkingPointId, spin, reset }
     }
     ```
   - Use synchronous data imports; no async fetching.

3. **Theme Components (place in `docs/.vitepress/theme/components/`)**
   - `SpinnerButton.vue`
     - Props: `label`, optional `loading`.
     - Emits: `spin` event.
     - Display: circular button with hover/focus effects; includes aria attributes (`role="button"`, accessible label).
   - `TalkingPointBubble.vue`
     - Props: `title`, `summary`, `visible`.
     - Emits: `open` when clicked/pressed.
     - Handles keyboard activation with `Enter`/`Space`; focus ring visible.
     - Layout: speech bubble style (tail, subtle animation on mount).
   - `TalkingPointModal.vue`
     - Props: `talkingPoint` (full object) and `open`.
     - Emits: `close`.
     - Requirements:
       - Trap focus while open (use accessible dialog pattern; can rely on a lightweight helper like `focus-trap` if already a dependency, otherwise implement manually).
       - Close on escape or overlay click.
       - Render `title`, `details`, `sources` list.
       - Include close button (`aria-label="Close talking point"`).
   - Register components globally via `docs/.vitepress/theme/index.ts`.

4. **Page Integration (`docs/candidates/index.md`)**
   - Introduce a new “Interactive Explorer” section before the candidate grid:
     ```vue
     <CandidateInteractive :candidate="candidate" />
     ```
   - Create `CandidateInteractive.vue` in theme components to orchestrate:
     - Accepts a `candidateId` or full `Candidate` object.
     - Renders `SpinnerButton`.
     - On `spin`, uses `useTalkingPointState` and `getRandomTalkingPoint`.
     - Conditionally renders `TalkingPointBubble` when a talking point is active.
     - On bubble click, opens `TalkingPointModal`.
     - Provide fallback UI if candidate lacks talking points (e.g., message + disabled spinner).
   - Ensure the existing `CandidateGrid` still renders below (unchanged).

5. **Accessibility & Responsiveness**
   - All interactive controls must be keyboard accessible.
   - Speech bubble and modal support screen readers (use `role="dialog"`, `aria-modal="true"`, `aria-labelledby`).
   - Spinner button includes `aria-busy="true"` when spinning (if you add async delay) or otherwise retains consistent state.
   - Modal content scrolls on small screens; overlay should lock background scroll (using body class toggle).

6. **Styling Guidelines**
   - Use CSS variables defined by VitePress where possible (`var(--vp-c-brand)` etc.).
   - Keep animations subtle (e.g., fade-in for bubble, scale for modal).
   - Ensure contrast ratios meet WCAG AA (4.5:1).

7. **Documentation**
   - Update `docs/ARCHITECTURE.md` with a new subsection “Interactive Flow (Phase 3)” describing:
     - Spinner → bubble → modal sequence.
     - Data dependencies (`talkingPoints`).
     - Composable state usage.
   - Add instructions to `docs/content/README.md` (create if missing) explaining how to add talking points for a candidate.

8. **Quality Checks**
   - Run `npm run build`.
   - Test the flow locally: keyboard-only spin/open/close, mobile viewport check.
   - Confirm no build artifacts are tracked.

## Acceptance Criteria
- Spinner, bubble, and modal components function as described and are reusable for any candidate.
- Candidates without talking points display a clear message and disabled spinner.
- Keyboard and screen reader users can operate the flow.
- Architecture doc and content README document how to manage talking points.
- Builds succeed with `npm run build`.

## Out of Scope
- Persisting talking point state across navigation.
- Routing deep links to specific talking points (planned for Phase 4).
- Actual claim data beyond placeholders.

## Follow-Up
- After review, archive this spec under `comms/tasks/archive/`.
- Coordinate Phase 4 spec to reuse the same component stack for the all-points overview.
