# Task: Automate VitePress Deployment to GitHub Pages

## Context
- Phase 1 immediate task from `NEXT_STEPS.md` is still open: configure automatic deployment for the VitePress site.
- Current repo already has VitePress scaffolded under `docs/` but no CI/CD pipeline or Pages configuration files.
- Automated deployment keeps the preview site in sync with the `main` branch and removes manual build steps.

## Objectives
- Provision a GitHub Actions workflow that builds the VitePress site and publishes it to GitHub Pages whenever `main` is updated.
- Ensure GitHub Pages is enabled with the workflow as the deployment source and that builds run with reproducible dependency caching.
- Document any one-time GitHub settings the maintainer must apply outside the repo.

## Deliverables
1. `.github/workflows/deploy.yml` workflow file implementing the build-and-deploy pipeline described below.
2. `package.json` updates (if needed) so `npm run build` produces the static output (`docs/.vitepress/dist`).
3. `README` or inline workflow comments explaining required GitHub repository settings (Pages, permissions) and secrets.

## Technical Requirements & Constraints
- Target environment: GitHub Pages (static hosting).
- Use the officially supported `actions/configure-pages`, `actions/upload-pages-artifact`, and `actions/deploy-pages` actions (latest stable versions).
- Node version >= 18 (use `actions/setup-node`).
- Cache npm dependencies with `actions/setup-node` built-in caching (`cache: "npm"`).
- Workflow should trigger on:
  - `push` to `main`
  - manual dispatch (`workflow_dispatch`)
- Build command: `npm ci` then `npm run build`. Confirm that build output remains under the default VitePress `docs/.vitepress/dist`.
- Permissions block must allow Pages deployment (id-token: write, pages: write, contents: read).
- Only one deployment should run at a time (`concurrency` group on `pages`).
- The workflow should fail fast if the build exits non-zero; no silent fallbacks.

## Step-by-Step Implementation Guidance
1. Create `.github/workflows/deploy.yml` with:
   - `name: Deploy VitePress to GitHub Pages`
   - `on` block for `push` to `main` and `workflow_dispatch`.
   - `permissions` set as described.
   - `concurrency` block to avoid overlapping runs.
   - Single job `deploy` that:
     1. Uses `ubuntu-latest`.
     2. Checks out the repo (`actions/checkout@v4`).
     3. Sets up Node 18 with npm caching.
     4. Runs `npm ci`.
     5. Runs `npm run build`.
     6. Configures GitHub Pages.
     7. Uploads the output artifact (`docs/.vitepress/dist`).
     8. Deploys to Pages.
2. Verify `package.json` contains a `build` script invoking `vitepress build docs`. If missing or different, update and ensure `npm run build` works locally.
3. Add brief comments in the workflow outlining any non-obvious steps (e.g., why concurrency is used).
4. Document in the workflow file (or append to `README`) the manual GitHub configuration the maintainer must apply:
   - Enable GitHub Pages with “GitHub Actions” as the source.
   - Ensure Actions permissions allow GitHub Actions to create deployments.

## Acceptance Criteria
- Running the workflow on a pushed commit to `main` results in a successful GitHub Pages deployment (can be validated by inspecting Actions logs).
- The generated site artifacts originate from `docs/.vitepress/dist`.
- Workflow adheres to GitHub's minimum required steps (`configure-pages`, `upload-pages-artifact`, `deploy-pages`).
- No secrets beyond the default `GITHUB_TOKEN` are necessary.
- Documentation clearly states any manual GitHub settings so maintainers can finish configuration.

## Out of Scope
- Content changes to the site.
- Additional environments (preview deploys, staging).
- Custom domain configuration.

## Follow-Up Notes
- After deployment is confirmed, update `NEXT_STEPS.md` to mark the checkbox complete.
- Future automation tasks (Phase 2 onward) will build on this pipeline.
