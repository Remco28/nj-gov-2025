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
         "id": "unique-talking-point-id",
         "title": "Headline",
         "summary": "Short summary for the speech bubble.",
         "details": "Longer explanation shown in the modal.",
         "sources": [
           { "label": "Source Label", "url": "https://example.com/article" }
         ]
       }
     ]
   }
   ```
3. Keep IDs lowercase, kebab-case, and unique across the entire file.
4. Add at least one source per talking point whenever possible.
5. Save the file and run `npm run dev` (or refresh your dev tab) to verify the interactive components render correctly.

Refer to `docs/content/README.md` for additional writing guidance and best practices.

## Image Handling

- Store candidate headshots under `docs/public/images/candidates/`.
- Recommended specs:
  - Format: `.webp` (preferred) or `.jpg`.
  - Dimensions: 400×400 px minimum (square crop).
  - File size: ≤ 200 KB after compression.
- Reference images in `candidates.json` using the public path: `"/images/candidates/<filename>.webp"`.
- Avoid placeholder URLs in production—use licensed or public-domain photos and document provenance separately if needed.

VitePress copies everything inside `docs/public` to the site root at build time, so a file stored at `docs/public/images/candidates/sherrill.webp` is available at `/images/candidates/sherrill.webp`.

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
