# NJ Politics 2025 Voter Decision Aid

Static VitePress site that helps surface candidate talking points for the 2025 New Jersey elections. The project relies on structured JSON content and reusable Vue components to keep updates fast and lightweight.

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Run the local dev server**
   ```bash
   npm run dev
   ```
   The site defaults to `http://localhost:5173`. VitePress hot-reloads changes to Markdown, JSON, and Vue components.
3. **Build for production**
   ```bash
   npm run build
   ```
   Outputs static assets to `docs/.vitepress/dist`.

Node.js 18+ is recommended.

## Adding Candidate Content

1. Open `docs/content/candidates.json`.
2. Add or update candidate entries inside the `candidates` array. Each object should follow the existing JSON schema:
   ```json
   {
     "id": "candidate-id",
     "name": "Full Name",
     "party": "Party",
     "headshot": "/images/candidates/candidate-id.jpg",
     "summary": "1–2 sentence bio.",
     "issues": [],
     "talkingPoints": [
       {
         "id": "topic-id",
         "title": "Headline shown in the bubble.",
         "summary": "Short summary for the speech bubble.",
         "details": "Longer explanation shown in the modal.",
         "sources": [
           { "label": "Source Label", "url": "https://example.com/article" }
         ],
         "followUps": [
           {
             "id": "follow-up-id",
             "prompt": "Has this approach been tried in other cities? How did it work out?",
             "summary": "Short answer that appears after the question is clicked.",
             "details": "Optional supporting context.",
             "followUps": []
           }
         ]
       }
     ]
   }
   ```
3. Keep IDs lowercase, kebab-case, and unique across the entire file.
4. Only top-level topics (items inside `talkingPoints`) appear in the spinner; follow-ups are question/answer blurbs surfaced inside the modal.
5. Add sources where available, especially for top-level claims.
6. Save the file and run `npm run dev` (or refresh your dev tab) to verify the interactive components render correctly.

Refer to `docs/content/README.md` for additional writing guidance and best practices.

## Image Handling

- Store candidate headshots under `docs/public/images/candidates/`.
- Recommended specs:
  - Format: `.webp` (preferred) or high-quality `.jpg`.
  - Dimensions: 600×750 px minimum (portrait crop; the site displays a 128 px circle).
  - File size: ≤ 200 KB after compression.
- Reference images in `candidates.json` using the public path: `"/images/candidates/<filename>.webp"`.
- Avoid placeholder URLs in production—use licensed or public-domain photos and document provenance separately if needed.

VitePress copies everything inside `docs/public` to the site root at build time, so a file stored at `docs/public/images/candidates/sherrill.webp` is available at `/images/candidates/sherrill.webp`.

## Research Submission Workflow

1. **Drop raw research**
   - Create a Markdown file in `research/submissions/`. Naming is flexible (`YYYY-MM-DD-topic.md` is suggested).
   - Start from `templates/research.md` and keep each file focused on a single issue or candidate.
   - Include working source URLs (publication name + link) inside the template’s “Evidence & Claims” section.
2. **Log the handoff**
   - Add an entry to `comms/log.md` noting the new submission (e.g., `RESEARCH SUBMITTED` with filename and short summary).
   - Attach supporting files or PDFs separately if needed; note their location in the “Source Appendix”.
3. **Keep it lightweight**
   - Aim for concise bullet points, 3–5 claims per file, and explicit flags for any sensitive material.
   - Prefer public links over paywalled sources when available.

## AI Conversion Flow

When an AI assistant receives a submission:

1. **Review the research Markdown** and confirm sources are present.
2. **Follow the existing content templates** (e.g., add talking points to `docs/content/candidates.json`, or create new Markdown/JSON files per the current spec). Preserve neutral tone, attribute each claim, and carry over any warnings.
3. **Update the site data** and run `npm run build` (or `npm run dev`) to verify the new content renders.
4. **Log progress in `comms/log.md`** (`AI CONVERSION START`, `AI CONVERSION DONE`) with references to the affected files.
5. **Prompt editors to visit `/qa/`** after the conversion so they can confirm there are no missing details or sources.

This lightweight workflow keeps submissions small enough for quick AI turnaround while documenting the full chain of custody for each talking point.

## Quality Assurance

- Visit `/qa/` (available in the top navigation) to review automated QA checks.
- Critical warnings to resolve before publishing:
  - Candidates without talking points.
  - Duplicate talking point IDs.
- Address warning-level items (missing details, missing sources, placeholder headshots) to maintain content quality.
- After updates, run `npm run build` to ensure the static build still succeeds.

## Project Resources

- Architecture overview: `docs/ARCHITECTURE.md`
- Content production guide: `docs/content/README.md`
- Task log and specs: `comms/`
- High-level roadmap: `NEXT_STEPS.md`

Use feature branches for changes (e.g., `feature/qa-dashboards`) and record new specifications in `comms/tasks/` following the existing workflow.
