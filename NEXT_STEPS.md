# Next Steps for Voter Decision Aid Website

## Immediate Tasks (Phase 1 Setup)
- [x] Install VitePress and Vue dependencies
- [x] Initialize VitePress project structure (`docs` folder, etc.)
- [x] Configure VitePress as an SPA (`spa: true`)
- [x] Create basic landing page with static candidate cards
- [x] Set up GitHub Actions for automated deployment to GitHub Pages

## Future Enhancements
- [x] Implement modular content structure (Phase 2)
- [x] Build interactive components (spinner, speech bubble, modal) (Phase 3)
- [x] Add QA dashboard for content coverage
- [x] Create the all-points overview page (Phase 4)
- [x] Polish UI/UX and test for mobile responsiveness (Phase 5)
- [ ] Enable deep-dive exploration: recursive talking points with follow-up questions and back navigation
- [ ] Automate topic aggregation from `docs/content/topics/` into runtime data (reduce manual assembly)

## Content Production
- [ ] Research current NJ 2025 race topics and gather top-level talking points per candidate
- [x] Replace placeholder headshots with vetted, licensed images
- [ ] Draft follow-up question blurbs linked to each top-level talking point
- [ ] Keep each topic in its own file under `docs/content/topics/<candidate>/`
- [ ] Validate new content via `/qa/` dashboard before publishing

## Documentation & Ops
- [x] Create initial `ARCHITECTURE.md`
- [x] Create initial `project-manifest.md`
- [x] Write developer setup and content workflow guide
- [ ] Document editorial workflow for sourcing and fact-checking

---

Notes:
- Keep the file in the repository root.
- Use `- [ ]` and `- [x]` checkboxes under headings.

## Upcoming Project Phases: Modular Topic Data
- **Phase A — Inventory & Cleanup**
  - Extract every talking point in `docs/content/candidates.json` into `docs/content/topics/<candidate>/<topic>.json`.
  - Normalize IDs (`candidateId`, topic IDs, follow-up IDs) and ensure metadata matches the new template.
  - Update `candidates.json` to be a clean aggregate sourced from those topic files (one-time manual sync).
- **Phase B — Automation & Build Integration**
  - Implement a script (e.g., `npm run build:data`) that reads the topic directory, assembles `candidates.json`, and validates schema/duplicates.
  - Wire the script into `npm run build` so the aggregate is regenerated automatically before the VitePress build.
  - Document developer workflow (`npm run build:data` / `npm run dev`) and remove manual copy steps once automation ships.
- **Phase C — Tooling & Tests**
  - Add unit tests for the aggregation script (ensuring order preservation, duplicate checks, missing fields handling).
  - Extend `/qa/` metrics to include topic file coverage and flag orphaned topics or candidates without any topic files.
  - Provide CLI feedback (counts, warnings) when aggregation runs to aid editors.
- **Phase D — Authoring UX Enhancements**
  - Create helper tooling (`npm run new-topic`) to scaffold topic files from `templates/topic.json` using prompts.
  - Update contributor docs with the automated workflow and helper commands.
  - Reassess editor onboarding materials to ensure AI agents follow the modular process end-to-end.
