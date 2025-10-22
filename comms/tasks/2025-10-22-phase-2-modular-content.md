# Task: Phase 2 – Modular Content Structure for VitePress Site

## Context
- `NEXT_STEPS.md` identifies “Implement modular content structure (Phase 2)” as the next major enhancement.
- Current content pages (`docs/index.md`, `docs/candidates/index.md`) contain static markup and inline styling/script blocks, which makes scaling candidate content difficult.
- We need a structure that lets non-technical editors add/update candidate information without touching layout logic, while giving developers reusable Vue components for future interactive features.

## Objectives
- Separate candidate data from presentation so it can be rewritten or expanded via structured content (JSON/YAML/MD frontmatter).
- Introduce shared Vue components within the VitePress theme for rendering cards, grids, and future interactive widgets.
- Provide utility functions/hooks so future pages (Phase 3+4) can access the same candidate dataset without duplication.
- Update architectural documentation to capture the new content pipeline.

## Deliverables
1. **Data Source**
   - Create `docs/content/candidates.json` (or `.yaml`) housing an array of candidate objects with, at minimum: `id`, `name`, `party`, `headshot`, `summary`, and optional `issues` array.
   - Include placeholder values for existing candidates and comment headers explaining expected fields.
   - Export a TypeScript helper in `docs/.vitepress/data/candidates.ts` that imports/parses the JSON and provides typed accessors (e.g., `getAllCandidates()`, `getCandidateById(id)`).

2. **Theme Components**
   - Add a `docs/.vitepress/theme/components/CandidateCard.vue` component that accepts props (`name`, `headshot`, `party`, `summary`, etc.) and renders the card styling (move inline CSS into this component).
   - Add a `CandidateGrid.vue` (same directory) that accepts a `candidates` array prop and maps to `CandidateCard`.
   - Ensure components are tree-shakable and export them via `docs/.vitepress/theme/index.ts` so Markdown pages can use them directly.

3. **Page Refactors**
   - Update `docs/candidates/index.md` to:
     - Replace inline `<style>`/`<div>` markup with `<CandidateGrid :candidates="candidates" />`.
     - Use `<script setup>` to import `getAllCandidates` and supply data to the grid.
     - Keep Markdown copy for headings/intro paragraphs in Markdown form.
   - Update `docs/index.md` hero action or additional sections to highlight dynamic counts (e.g., total candidates) using the same data hook to demonstrate reuse (can render in a `<script setup>` block).

4. **Styling & Responsiveness**
   - Port current CSS rules into the Vue components (scoped or module styles).
   - Add minimum responsive tweaks: cards should stack on small screens, maintain accessible color contrast, and ensure images include `alt` text sourced from candidate data.

5. **Documentation**
   - Append a new subsection to `docs/ARCHITECTURE.md` describing:
     - Data file locations and expected schema.
     - How to add a new candidate (update JSON + optional images).
     - Theme component responsibilities and reusability patterns.
   - Add brief contributor notes to the new JSON/YAML file header if inline comments are supported (or create a `docs/content/README.md`).

6. **Quality Checks**
   - Run `npm run build` locally to confirm the refactor still produces a clean static build.
   - Lint Vue components if tooling exists (otherwise rely on build errors).

## Technical Constraints & Guidance
- Use VitePress default theme conventions: components live in `docs/.vitepress/theme/components`, exported in `docs/.vitepress/theme/index.ts`.
- The JSON/YAML file must be consumable from both Markdown and future Node tooling; prefer plain JSON unless there’s a strong case for YAML.
- Keep data fetching synchronous (static import) so build-time SSR works; avoid runtime `fetch`.
- Maintain SPA mode compatibility (`spa: true` already enabled).
- Use TypeScript in helper files to enable typing; VitePress config already uses ESM.
- Support at least two sample candidates with placeholder headshot URLs (existing placeholders are fine).

## Acceptance Criteria
- Candidate information lives in a single structured data file; no duplication in Markdown.
- `docs/candidates/index.md` and `docs/index.md` render dynamically using shared components with identical or improved presentation compared to current static HTML/CSS.
- Project builds successfully (`npm run build`).
- `docs/ARCHITECTURE.md` documents the new data flow clearly enough for a content editor to follow.
- No build artifacts (`docs/.vitepress/dist`, `cache`) are added back into Git.

## Follow-Up
- After implementation and review, archive this spec in `comms/tasks/archive/`.
- Coordinate with Phase 3 spec to reuse the same candidate data structures for interactive components.
