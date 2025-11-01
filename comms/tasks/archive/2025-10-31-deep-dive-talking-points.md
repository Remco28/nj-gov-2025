# Task: Enable Deep-Dive Talking Points (Recursive Follow-Ups)

## Context
- The tech lead recommended evolving our “spin → bubble → modal” flow to support repeated “how/why” follow-up questions.
- Current data (`docs/content/candidates.json`) stores a flat `talkingPoints` array, and UI components assume a single level of detail.
- Team alignment: top-level talking points remain the spinner entries; follow-up questions appear inside the modal; navigation is back-only (no sibling hopping).
- Documentation has been updated to describe the topic → follow-up hierarchy; development needs to deliver the data model, helpers, and UI behavior.

## Objectives
1. Update candidate data structures and helpers to support recursive follow-up chains while keeping top-level topics accessible to existing features.
2. Enhance the modal experience so users can open follow-up questions, read their answers, and navigate back up the stack without closing the dialog.
3. Preserve existing flows (spinner, All Points page, QA dashboard) with minimal disruption while extending them to handle nested data where appropriate.

## Deliverables

### 1. Data Model & Type Updates
- Extend `docs/content/candidates.json` schema to allow each talking point to include optional `followUps` arrays (recursive structure).
- Update TypeScript types in `docs/.vitepress/data/candidates.ts`:
  - Introduce `FollowUp` interface (or enhance `TalkingPoint` with a discriminated union) that reflects `id`, `prompt`, `summary`, `details`, optional `sources`, and nested `followUps`.
  - Ensure `TalkingPoint` keeps backwards compatibility for top-level topics; `title` remains required at the top level.
  - Export helper(s) to flatten or traverse the tree (`flattenFollowUps`, `getTopLevelTalkingPoints`, etc.).
- Adjust existing helper functions so:
  - `getTalkingPointsByCandidate` returns only top-level topics.
  - `getRandomTalkingPoint` selects from top-level topics only.
  - Aggregation helpers (`getAllCandidateTalkingPoints`, `findCandidateTalkingPoint`) continue to work, either by ignoring follow-ups or by returning metadata indicating nested status (document choice in code comments).
- Add defensive guards to prevent circular references (e.g., depth check or set-based loop detection) when traversing follow-ups.

### 2. State Management & Modal Enhancements
- Replace or extend `useTalkingPointState` to support:
  - Storing the active top-level topic.
  - Managing a stack/array of the current path (`[{ type: 'topic', node }, { type: 'followUp', node }]`).
  - Methods: `openTopic(topicId)`, `openFollowUp(followUpId)`, `goBack()`, `reset()`, `getCurrentNode()`.
  - Events/callbacks to notify UI when the stack changes.
- Update `TalkingPointModal.vue` to:
  - Render the current node’s `summary` and optional `details`.
  - Show a list of follow-up prompts (if any) as buttons below the blurb.
  - Include a back button (e.g., “← Back to {previous title/prompt}”) visible whenever depth > 0.
  - Handle focus management as users drill down and go back (e.g., focus the newly opened follow-up heading/button, return focus to the triggering prompt on back).
  - Provide aria-labels/roles so screen readers understand the hierarchy; consider using `aria-live` for content swaps.
- Ensure closing the modal clears the navigation stack, and reopening starts at the top-level topic.

### 3. Spinner & Bubble Flow Adjustments
- Keep spinner behavior unchanged except for terminology updates (“Spin for a Topic” or similar if copy change warranted).
- Confirm `TalkingPointBubble` continues to show the top-level topic summary; clicking still opens the modal at depth 0.
- When a follow-up is open in the modal, the top-level bubble should keep its original text (no dynamic changes needed).

### 4. All Points Page & Deep Links
- Decide how `/all-points/` should surface follow-ups:
  - Minimum requirement: top-level topics still display exactly as today.
  - Stretch goal (if feasible within timebox): optionally show follow-up prompts nested under each card (accordion/list). Document decision in the PR.
- Ensure hash-based deep links continue to work for top-level topics.
- If follow-up deep linking is not implemented now, explicitly prevent hash collisions by reserving IDs for future use (e.g., prefix follow-up anchors with `followup-` if added later).

### 5. Documentation & Tooling
- Update inline JSDoc/TypeScript comments explaining the recursive structure and stack navigation.
- Review `docs/content/README.md`, `README.md`, and `docs/ARCHITECTURE.md` (already updated) to confirm code changes align with the documented fields; adjust if implementation details vary.
- If the QA dashboard relies on a talking point count, confirm it ignores follow-ups (or optionally add a follow-up count metric).

## Constraints & Guidance
- Maintain backwards compatibility for any existing data; code should treat missing `followUps` as an empty array.
- Guard all client-only logic (e.g., stack navigation, event listeners) with `typeof window !== 'undefined'` where SSR might be affected.
- Keep UI accessible: button elements for prompts, semantic headings, adequate focus outlines.
- Avoid introducing external dependencies; stick with Vue 3 composition API and existing tooling.
- Follow current styling tokens (`foundations.css`); reuse spacing and typography variables.

## Acceptance Criteria
- Spinner still selects only top-level topics; modal opens with the topic content and follow-up prompts listed beneath when present.
- Selecting a follow-up replaces the modal body with that prompt’s summary/details and exposes a functional back button to the previous level.
- Navigation stack resets when the modal closes or when a new spin occurs.
- No regressions on `/all-points/`, `/qa/`, or existing components (manual sanity check on npm run dev/build).
- TypeScript builds without errors, and `npm run build` succeeds.
- Documentation remains consistent with implemented data shape.

## Testing & Verification
- Run `npm run build` to catch SSR/template issues and ensure static output succeeds.
- Manually test in the browser:
  - Desktop + mobile widths.
  - Deep dive with multiple follow-up levels (manually seed sample data if needed).
  - Keyboard navigation (Tab/Shift+Tab) within the modal for follow-up buttons and back control.
- Verify `/qa/` still loads and counts talking points as expected.
- Consider adding Jest/unit tests for new helper functions if time allows (optional but encouraged).

## Out of Scope
- Sharing deep links directly to nested follow-ups (can be future work).
- Major visual redesigns beyond components touched for the modal/stack UI.
- Automated migration scripts for existing content (manual edits are acceptable given current empty dataset).

