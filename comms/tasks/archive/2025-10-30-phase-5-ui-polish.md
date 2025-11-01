# Task: Phase 5 UI Polish & Responsive Refinements

## Context
- Phase 4 delivered the deterministic `/all-points/` index and the interactive candidate flow. Formatting is now functional, but the experience still feels “default VitePress” rather than a coherent product.
- The Product Owner has replaced the placeholder headshots with real assets, revealing shortcomings in our card layout (tight crop, inconsistent spacing, harsh shadows).
- Phase 5 on the roadmap calls for broad UI polish and mobile responsiveness across the core pages (`/`, `/candidates/`, `/all-points/`).
- We already extracted the all-points logic into `AllPointsPage.vue`; this spec focuses on finishing the visual design, tightening responsiveness, and introducing small affordances (active states, spacing, typography) that make the site feel deliberate.

## Objectives
1. Establish a consistent visual system (spacing, typography, colors, shadows) that can be reused across pages.
2. Polish the `/all-points/` page so it feels like a first-class catalog: candidate headers with imagery, sticky quick-nav chips with active state, balanced card grid, accessible mobile behavior.
3. Tidy up the `/candidates/` interactive view and landing page hero to match the new visual language and ensure everything reads well on phones/tablets.

## Deliverables

### 1. Global Style Tokens & Utilities
- Create `docs/.vitepress/theme/styles/foundations.css` (suggested path) that defines:
  - CSS variables for spacing scale (`--space-xs/sm/md/lg/xl`), border radii, shadow presets, and brand tints (`--brand-soft`, `--brand-strong`, etc.).
  - Utility classes for layout containers (`.screen-container` with max-width 1040px, centered), visually-hidden text, and responsive section padding.
- Import this stylesheet in `docs/.vitepress/theme/index.ts` so tokens are available globally.
- Update existing components to rely on the new variables instead of hard-coded values where refactoring is straightforward (e.g., card padding, border radius, shadows).

### 2. `/all-points/` Enhancements (`AllPointsPage.vue`)
- **Candidate header block**: Add the candidate headshot (60px circle) beside the name and party. Use the new spacing/shadow tokens; fall back to initials if the image 404s.
- **Quick-nav behavior**:
  - Keep the pill styling, but highlight the active candidate based on scroll position (IntersectionObserver). Active chip uses `--brand-strong` background with white text.
  - On screens < 768px, make the chip row horizontally scrollable instead of hiding it entirely. Retain the select dropdown for accessibility.
  - Ensure hash navigation updates the active state and scrolls chips into view.
- **Card grid polish**:
  - Increase card padding, add subtle gradient background (`linear-gradient` using brand soft tones), and align footer elements vertically on narrow screens.
  - Display source count as `Sources · X` with an icon (e.g., using existing VitePress icon font if available, otherwise a simple Unicode bullet).
- **Empty states**: Style the “No talking points” message with a dashed border + icon to make the absence obvious.
- **Keyboard/a11y**: Chips must be focusable, and the active chip should have `aria-current="true"`.

### 3. `/candidates/` Page & Components
- Wrap the page content in the new `.screen-container` so the grid and interactive blocks align with `/all-points/`.
- Update `CandidateInteractive.vue`:
  - On ≥1024px: Display a two-column layout (left column spinner + bubble, right column headshot + candidate meta, both sharing a card background).
  - On mobile, stack elements with generous spacing; ensure the spinner never overflows width.
  - Replace inline styles with CSS classes using the new design tokens.
- Update `CandidateCard.vue`:
  - Increase the headshot size to 128px, add a faint drop shadow, and allow 3:4 cropping (object-fit cover).
  - Add a subtle hover translation and focus-visible outline using the new shadows/tokens.

### 4. Landing Page Hero (`docs/index.md`)
- Reduce the vertical padding and add a supporting subheader that references the new all-points index (e.g., “Browse every talking point in the All Points catalog” with a call-to-action button linking to `/all-points/`).
- Use the global container utility and ensure the hero scales down gracefully on mobile (text wraps, button at full width).

### 5. QA & Documentation
- Update `docs/ARCHITECTURE.md` Phase 5 section with a short description of the new visual system and where the foundational tokens live.
- Add a note to `docs/content/README.md` reminding content editors that headshots should be portrait-oriented and will be displayed at 128px circles.
- Run `npm run build` and sanity-check `/`, `/candidates/`, `/all-points/` at 320px, 768px, and desktop widths (document observations briefly in the PR/commit message).

## Constraints & Guidance
- Stick to our existing color palette; do not introduce third-party UI libraries.
- Avoid dramatic layout changes that would break content editors’ expectations—this is a polish pass, not a redesign.
- Ensure IntersectionObserver logic runs only on the client and degrades gracefully during SSR (guard with `typeof window !== 'undefined'`).
- Keep new CSS scoped to the components unless it’s genuinely global; prevent style bleed into default VitePress elements.
- Maintain accessibility: respect focus outlines, ensure sufficient contrast, and provide `aria` attributes where applicable.

## Acceptance Criteria
- `/all-points/` displays headshots, active quick-nav chips, and refined cards with consistent spacing; chips follow the currently visible candidate.
- `/candidates/` interactive section is responsive and visually aligned with the new design tokens; candidate cards show 128px headshots without distortion.
- Landing page hero uses the new container spacing and mentions the all-points catalog.
- Global tokens stylesheet exists and is imported; components use its variables.
- Documentation updates completed; `npm run build` succeeds.

## Out of Scope
- Issue-level exploration / nested Q&A flows (future roadmap item).
- Additional data validations or QA dashboard changes.
- Theme toggles or typography changes beyond what’s needed for polish.
