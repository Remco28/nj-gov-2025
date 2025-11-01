# Architecture Overview: Voter Decision Aid Website

A brief, 2-minute overview of the system. It's a static website built with VitePress, designed for an interactive, inquiry-driven exploration of political topics.

## System Components

### Core Services
- **VitePress App** (`/docs`) – A Static Site Generator (SSG) that builds the website from Markdown files. It uses Vue.js for interactive components.

### Supporting Services
- **GitHub Actions** – For continuous integration and deployment (CI/CD). It automatically builds the VitePress site and deploys it to GitHub Pages on push.

### Process Architecture
```
(Development Workflow)
Human writes raw Markdown notes
       |
       v
AI Agent formats into structured Markdown w/ Frontmatter
       |
       v
Git Push triggers GitHub Actions
       |
       v
[VitePress Build Process] --reads--> [Markdown Content (`/docs`)]
       |
       v
[Static Site (HTML/CSS/JS)] --deployed_to--> [GitHub Pages]
```

## Data Flow Examples

### Example: User Interacts with a Candidate Claim
```
User clicks candidate photo → Vue component triggers the spinner → A random top-level topic is displayed in the speech bubble → User clicks the bubble → Modal loads topic data from the assembled candidate payload (`candidates.json`, sourced from `docs/content/topics/`), showing the blurb plus follow-up questions → User selects a question to drill down, with a back control to return to the previous level.
```

### Example: Content Update
```
Developer adds/edits a "user-friendly" Markdown file → AI Agent converts it to a "site-ready" structured Markdown file → Developer commits and pushes to GitHub → GitHub Actions builds and deploys the new content.
```

## Key Abstractions

- **Entities**: Candidate, Topic (top-level talking point), Follow-Up (recursive question/answer node). Topics are authored per file in `docs/content/topics/` and combined into `docs/content/candidates.json` for runtime use.
- **Boundaries**: The primary boundary is the static site consumed in the browser. Content editing happens offline by updating JSON and Markdown sources in the repo.

## Configuration

- **VitePress Config**: `docs/.vitepress/config.mjs` contains site-level configuration, navigation, and SPA settings.
- **Content Config**: YAML frontmatter within Markdown files (`.md`) will configure the content for each page and claim.

## Integration Points

- **Content Source**: Candidate data is sourced from `docs/content/candidates.json` (assembled from `docs/content/topics/`); editorial pages live alongside it in `/docs`.
- **Deployment**: GitHub Pages hosts the static output.

## Runtime & Operations Notes

- **Static Site**: There is no server-side runtime. The entire application is pre-built into static files.
- **Development**: A local dev server is run via `npm run dev`.
- **Security**: As a static site, the attack surface is minimal. Source citation is important for content integrity.

### Quality Assurance Dashboard

The QA Dashboard (`/qa/`) is an internal tooling page for content maintainers to audit structured data quality before publishing. It provides automated checks and metrics to identify data gaps and inconsistencies.

**Purpose**: Ensure candidate and talking point data is complete, accurate, and ready for publication by surfacing actionable quality issues.

**Metrics & Issue Groups**:
- **Summary Metrics**: Total candidates, total talking points, average per candidate, coverage statistics
- **Candidate Coverage**: Per-candidate breakdown of talking point counts and missing fields
- **Data Quality Warnings**:
  - Candidates without talking points (critical)
  - Talking points missing details or sources (warning)
  - Duplicate talking point IDs across candidates (critical)
  - Placeholder headshot images (warning)

**Implementation**: The dashboard operates entirely within the static stack using VitePress + Vue. Data helpers in `docs/.vitepress/data/qaMetrics.ts` provide pure, synchronous functions that analyze `candidates.json` and return typed metrics and issue lists. Vue components (`QaMetricCard`, `QaMetricGrid`, `QaIssueList`) render the dashboard UI with accessible, semantic styling.

**Workflow**: Content editors should review the QA Dashboard after updating `docs/content/candidates.json` to verify all critical issues are resolved before committing changes. The dashboard is accessible via the main navigation but is not included in the sidebar, keeping it available but distinct from user-facing content.

## Modular Content Structure

Phase 2 moved the site to a data-driven architecture backed by JSON, keeping content and presentation separate while staying easy to edit.

### Data Layer

- **Location**: `docs/content/candidates.json`
- **Candidate Fields**: `id`, `name`, `party`, `headshot`, `summary`, `issues`, and `talkingPoints`
- **Top-Level Topics**: Items inside `talkingPoints` represent primary talking point topics. Each topic may include optional `followUps`, enabling recursive question chains.

### Helper Modules

`docs/.vitepress/data/candidates.ts` exposes typed helpers:
- `getAllCandidates()` / `getCandidateById()` / `getCandidateCount()` for general access
- `getTalkingPointsByCandidate()` and `getRandomTalkingPoint()` to feed the interactive spinner
- Aggregation helpers (`getAllCandidateTalkingPoints`, `findCandidateTalkingPoint`) for the `/all-points/` page
- Utility helpers to count and flatten follow-ups for QA metrics

> **Authoring vs. Runtime Data**: Editors work in modular topic files under `docs/content/topics/`. The site currently consumes a manually assembled aggregate (`docs/content/candidates.json`) until an automated build step takes over.

### Theme Components

Reusable Vue components in `docs/.vitepress/theme/components/` consume the shared helpers:
- `CandidateCard.vue`, `CandidateGrid.vue` render static lists
- `CandidateInteractive.vue`, `TalkingPointModal.vue`, and supporting pieces orchestrate the interactive flow
- `AllPointsPage.vue` provides the deterministic overview using the aggregation helpers

Components are registered globally via `docs/.vitepress/theme/index.ts`, so Markdown pages can drop them in without additional setup.

### Editing Workflow

1. Create or update topic files under `docs/content/topics/<candidate-id>/<topic-id>.json` (one topic per file).
2. Copy each finalized topic into the appropriate candidate record inside `docs/content/candidates.json` (temporary manual assembly).
3. Run `npm run dev` for live preview or `npm run build` to validate JSON.
4. Use the `/qa/` dashboard to catch missing fields or duplicate IDs before merging.

Only the top-level topics need summaries tuned for the spinner bubble; follow-ups can focus on the question-and-answer exchange shown in the modal.

## Interactive Flow (Phase 3)

Phase 3 introduces interactive components that enable users to explore candidate talking points through an engaging "spin → bubble → modal" experience.

### Interactive Components

**Location**: `docs/.vitepress/theme/components/`

**SpinnerButton.vue**: A circular button that triggers the random talking point selection. Includes loading states, accessibility attributes (`role="button"`, `aria-busy`), and keyboard support (Enter/Space).

**TalkingPointBubble.vue**: Speech bubble component that displays a talking point's title and summary. Clickable to open full details. Includes subtle animations and focus management.

**TalkingPointModal.vue**: Accessible dialog that shows complete talking point details including sources. Features:
- Focus trapping (Tab/Shift+Tab cycle within modal)
- Escape key to close
- Overlay click to close
- Body scroll locking when open
- ARIA attributes (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`)

**CandidateInteractive.vue**: Orchestration component that manages the complete interactive flow. Handles state transitions and coordinates all subcomponents.

### State Management

**Location**: `docs/.vitepress/data/state/useTalkingPointState.ts`

Vue composable that provides reactive state management:
- `activeTalkingPointId`: Currently displayed talking point
- `lastTalkingPointId`: Prevents showing the same point twice in a row
- `currentTalkingPoint`: Full talking point object
- `spin()`: Selects a random talking point
- `reset()`: Clears active point while preserving history
- `clearAll()`: Completely resets state

The deep-dive work will evolve this composable (or introduce a new one) to maintain a navigation stack of topics and follow-ups, enabling the modal back button and breadcrumb context.

### Data Dependencies

Talking points are authored per topic under `docs/content/topics/` (each topic file includes a `candidateId` to link it back to the parent candidate). Those files are temporarily assembled into `docs/content/candidates.json` for the runtime build until automated aggregation is introduced:

```json
{
  "talkingPoints": [
    {
      "id": "topic-id",
      "title": "Talking Point Title",
      "summary": "Brief 1-2 sentence summary for the spinner bubble.",
      "details": "Longer explanation for the modal (optional).",
      "sources": [
        { "label": "Source Name", "url": "https://..." }
      ],
      "followUps": [
        {
          "id": "follow-up-id",
          "prompt": "Has this approach been tried elsewhere?",
          "summary": "Short answer shown when the question opens.",
          "details": "Optional supporting context.",
          "followUps": []
        }
      ]
    }
  ]
}
```

Helper functions in `docs/.vitepress/data/candidates.ts`:
- `getTalkingPointsByCandidate(id)`: Returns all talking points for a candidate
- `getRandomTalkingPoint(id, excludeId?)`: Returns random point, avoiding repeats

### User Experience Flow

1. User clicks the spinner button.
2. System randomly selects a top-level topic (avoiding the last shown).
3. The speech bubble appears with the topic title and summary.
4. User clicks the bubble to open the modal.
5. Modal displays the topic details plus a list of follow-up questions written as prompts.
6. User selects a prompt to reveal its answer; the modal pushes that follow-up onto a navigation stack.
7. A back control lets the user return to the previous level or all the way back to the original topic.
8. User closes the modal and can spin again for a different topic.

### Accessibility Features

- **Keyboard Navigation**: All interactions support Enter/Space keys
- **Focus Management**: Modal traps focus and restores it on close
- **Screen Readers**: Proper ARIA labels and roles throughout
- **Visual Focus**: Clear focus indicators on all interactive elements
- **Color Contrast**: Meets WCAG AA standards (4.5:1 ratio)
- **Responsive**: Works on mobile, tablet, and desktop

This pattern ensures all pages use the same data source and components remain consistent across the site.

## All-Points Overview (Phase 4)

Phase 4 introduces a comprehensive index page that aggregates every talking point from all candidates in a scannable, deterministic layout. This complements the random exploration flow by providing editors and power users with complete visibility into all content.

### Purpose

The `/all-points/` page serves multiple use cases:
- **Content Auditing**: Editors can review all talking points in one place to identify gaps or inconsistencies
- **Direct Access**: Users can browse all claims without randomization
- **Deep Linking**: Share URLs to specific talking points using hash fragments (e.g., `/all-points/#candidate-id-talking-point-id`)
- **Comparison**: View multiple candidates' positions side-by-side

### Data Aggregation Helpers

**Location**: `docs/.vitepress/data/candidates.ts`

New typed interface and functions for flattening candidate/talking point data:

**CandidateTalkingPointEntry Interface**:
- `candidateId`: Candidate unique identifier
- `candidateName`: Candidate full name
- `candidateParty`: Candidate party affiliation
- `candidateSummary`: Candidate bio
- `talkingPoint`: Complete TalkingPoint object
- `anchorId`: Composite ID for deep-linking (`candidateId-talkingPointId`)

**getAllCandidateTalkingPoints()**: Returns flattened array of all talking points across all candidates. Preserves input order (candidates first, then talking points within each candidate). Skips candidates with zero talking points and guards against missing IDs.

**findCandidateTalkingPoint(anchorId)**: Resolves a specific entry by composite anchor ID for deep-link support.

### Modal Context Enhancement

**TalkingPointModal.vue** now accepts an optional `contextLabel` prop that displays candidate context (e.g., "Mikie Sherrill · Democratic Party") as a small overline above the modal title. The label uses uppercase styling, letter-spacing, and muted colors from theme tokens. It includes `aria-describedby` for screen reader support.

**CandidateInteractive.vue** passes context to the modal so users always know which candidate's talking point they're viewing, whether accessed from the spinner flow or the all-points page.

### Page Structure

**Location**: `docs/.vitepress/theme/components/AllPointsPage.vue` (rendered via `docs/all-points/index.md`)

The markdown file now simply mounts the dedicated Vue component. `AllPointsPage.vue`:
- Loads candidate data up front and normalizes talking points into per-candidate “section” objects
- Manages modal state, hash navigation, and keyboard focus restoration internally
- Exposes quick navigation chips and mobile select controls without relying on inline Markdown scripting
- Reuses `TalkingPointModal` for detail disclosure while passing candidate context labels

**Layout Sections**:
1. **Hero**: Title and description explaining the deterministic browsing purpose
2. **Quick Navigation**:
   - Desktop: Inline anchor links for each candidate
   - Mobile: `<select>` dropdown jump menu
3. **Candidate Sections**: Each candidate gets a `<section>` with:
   - Candidate name, party, summary
   - Count badge showing number of talking points
   - Grid of talking point cards
4. **Talking Point Cards**: Each card displays:
   - Title, summary, source count
   - "View details" button that opens the modal and updates the URL hash

### Anchor and Hash Behavior

**Anchor IDs**: Generated as `${candidateId}-${talkingPointId}` (kebab-safe concatenation). Applied to both candidate sections (`id=candidateId`) and talking point cards (`id=anchorId`).

**Deep-Link Support**: On page mount, the component checks `window.location.hash`. If a valid talking point anchor is found:
1. Scrolls to the card smoothly
2. Auto-opens the modal with the correct entry
3. Displays the modal with candidate context

**Hash Management**: When closing the modal, the URL hash is cleared using `history.replaceState()` to maintain clean navigation without full page reloads.

**Focus Restoration**: After closing the modal, focus returns to the originating "View details" button for keyboard accessibility.

### Navigation Integration

The "All Points" link is inserted between "Candidates" and "QA Dashboard" in the main navigation (`docs/.vitepress/config.mjs`). A callout tip box at the end of `/candidates/` page directs users to the full index for comprehensive browsing.

### Relationship to Interactive Flow

The all-points page reuses the same `TalkingPointModal` component from Phase 3, ensuring consistent modal behavior and styling across both the random exploration flow and the deterministic index. Both flows benefit from the new context label enhancement.

### SSR Considerations

VitePress performs server-side rendering (SSR) during the build process, which requires special handling for Vue components in Markdown pages:

**Current Approach**: Moving the all-points logic into a dedicated Vue component allows us to validate candidate data with explicit loops before rendering, avoiding the `undefined` access errors that appeared when complex `<script setup>` blocks lived inside Markdown. Follow the same pattern for future dynamic pages—encapsulate stateful logic inside `.vue` components and keep the Markdown wrapper declarative.

## Design System & Visual Polish (Phase 5)

Phase 5 introduces a consistent visual design system with global design tokens, responsive enhancements, and UI polish across all core pages.

### Global Design Tokens

**Location**: `docs/.vitepress/theme/styles/foundations.css`

This stylesheet defines the foundation of our visual system:

**Spacing Scale**: CSS variables (`--space-xs` through `--space-3xl`) provide consistent spacing for margins, padding, and gaps throughout the application. These tokens replace hard-coded pixel values and ensure visual rhythm.

**Border Radius**: Standardized border radius values (`--radius-sm/md/lg/full`) for consistent component styling.

**Shadow Presets**: Layered shadow tokens (`--shadow-subtle` through `--shadow-xl`) that provide depth without visual clutter. All shadows use consistent color values for brand cohesion.

**Brand Color Tints**: Extended color palette including gradient backgrounds (`--gradient-soft/medium`) used for card backgrounds and interactive states.

**Utility Classes**:
- `.screen-container`: Centers content with a maximum width of 1040px and responsive padding
- `.section-padding`: Consistent vertical spacing for page sections
- `.sr-only` / `.visually-hidden`: Accessibility helper for screen reader-only content
- `.card` / `.card-gradient`: Reusable card styles with hover states

All design tokens are imported globally in `docs/.vitepress/theme/index.ts` and are available across all components.

### All-Points Page Enhancements

**Candidate Headers**: Each candidate section now displays a 60px circular headshot beside their name and party. Images fall back to initials if the headshot fails to load.

**Active Navigation**: Quick-nav chips use IntersectionObserver to highlight the currently visible candidate section. The active chip receives a distinct background (`--brand-strong` with white text) and automatically scrolls into view within the horizontal scroll container.

**Responsive Navigation**: On screens under 768px, the quick-nav chips become horizontally scrollable with custom scrollbar styling, maintaining accessibility while saving vertical space. The select dropdown remains available for keyboard users.

**Card Polish**: Talking point cards now feature:
- Subtle gradient backgrounds that intensify on hover
- Increased padding using spacing tokens
- Source count displayed as "Sources · X" with a decorative icon
- Improved footer layout that stacks vertically on narrow screens

**Empty States**: Candidates without talking points display a prominent dashed-border container with an icon and explanatory text, making the absence obvious to content editors.

**Accessibility**: All chips are keyboard-focusable, active chips have `aria-current="true"`, and focus indicators meet WCAG contrast requirements.

### Candidates Page Improvements

**Layout Container**: The entire candidates page content is wrapped in `.screen-container` for consistent alignment with the all-points page.

**Two-Column Interactive Layout**: On screens ≥1024px, `CandidateInteractive` displays a card-style layout with:
- Left column: Spinner button
- Right column: Candidate headshot (140px), name, and party
- Bottom row: Speech bubble spanning both columns

The layout collapses to a single stacked column on mobile with generous spacing.

**Enhanced Candidate Cards**: `CandidateCard` component now features:
- 128px headshots (up from 100px) with 3:4 aspect ratio support via `object-fit: cover`
- Faint drop shadows and hover translation effects
- Improved typography using design tokens
- Focus-visible outlines for keyboard navigation

### Landing Page Hero

**Reduced Padding**: Hero section uses `var(--space-3xl)` top padding and `var(--space-2xl)` bottom padding (reduces to `var(--space-2xl)` and `var(--space-xl)` on mobile).

**Enhanced Tagline**: Updated tagline references the All Points catalog, providing immediate context for new users.

**Call-to-Action**: Two-button layout with primary "Explore Candidates" and secondary "View All Points" actions. Buttons stack vertically at full width on mobile.

**Container Alignment**: Hero content uses a max-width of 1040px to match the global screen container.

### Component Token Adoption

Existing components have been refactored to use design tokens where appropriate:
- Padding and margin values use spacing variables
- Border radius uses radius tokens
- Shadow effects use shadow presets
- All transitions maintain consistent 0.2s ease timing

This ensures future design adjustments can be made globally by updating token values rather than hunting through component styles.

## Related Docs

- Project Plan: `comms/planning-overview.md`
- Next Steps: `NEXT_STEPS.md`
- Task Specs: `comms/tasks/`
