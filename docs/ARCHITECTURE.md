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
User clicks candidate photo → Vue component triggers "spinner" → Random talking point is displayed in a speech bubble → User clicks bubble → Vue component loads claim data from Markdown frontmatter → Modal displays with nested, clickable questions.
```

### Example: Content Update
```
Developer adds/edits a "user-friendly" Markdown file → AI Agent converts it to a "site-ready" structured Markdown file → Developer commits and pushes to GitHub → GitHub Actions builds and deploys the new content.
```

## Key Abstractions

- **Entities**: Candidate, Talking Point (Claim), Question, Answer, Side Fact. These are structured in Markdown frontmatter.
- **Boundaries**: The primary boundary is the static site itself, consumed by users in a browser. The content update process is a development-time boundary.

## Configuration

- **VitePress Config**: `docs/.vitepress/config.js` will contain site-level configuration, navigation, and SPA settings.
- **Content Config**: YAML frontmatter within Markdown files (`.md`) will configure the content for each page and claim.

## Integration Points

- **Content Source**: All content is sourced from local Markdown files within the `/docs` directory.
- **Deployment**: GitHub Pages hosts the static output.

## Runtime & Operations Notes

- **Static Site**: There is no server-side runtime. The entire application is pre-built into static files.
- **Development**: A local dev server is run via `npm run dev`.
- **Security**: As a static site, the attack surface is minimal. Source citation is important for content integrity.

## Modular Content Structure (Phase 2)

As of Phase 2, the site uses a data-driven architecture to separate content from presentation. This makes it easier to add/update candidate information without touching layout logic.

### Data Layer

**Location**: `docs/content/candidates.json`

This JSON file contains the single source of truth for all candidate information:
- `id`: Unique identifier (kebab-case, e.g., "mikie-sherrill")
- `name`: Full name
- `party`: Political party affiliation
- `headshot`: URL to candidate photo
- `summary`: Brief bio or description
- `issues`: Array of issue positions (for future use)

**Helper Functions**: `docs/.vitepress/data/candidates.ts`

TypeScript module providing typed access to candidate data:
- `getAllCandidates()`: Returns all candidates
- `getCandidateById(id)`: Finds a specific candidate
- `getCandidateCount()`: Returns total number of candidates

### Theme Components

**Location**: `docs/.vitepress/theme/components/`

**CandidateCard.vue**: Displays a single candidate with their headshot, name, party, and summary. Includes hover effects and responsive styling.

**CandidateGrid.vue**: Renders a responsive grid of CandidateCard components. Automatically adapts to screen size.

**Registration**: Components are registered globally in `docs/.vitepress/theme/index.ts` and can be used directly in Markdown files.

### Adding a New Candidate

1. Open `docs/content/candidates.json`
2. Add a new object to the `candidates` array:
   ```json
   {
     "id": "candidate-name",
     "name": "Candidate Full Name",
     "party": "Party Name",
     "headshot": "https://example.com/photo.jpg",
     "summary": "Brief description...",
     "issues": []
   }
   ```
3. The candidate will automatically appear on the candidates page
4. No code changes required!

### Reusability Pattern

The data helper functions can be imported in any Markdown page using `<script setup>`:

```vue
<script setup>
import { getAllCandidates } from '../.vitepress/data/candidates'
const candidates = getAllCandidates()
</script>

<CandidateGrid :candidates="candidates" />
```

This pattern ensures all pages use the same data source and components remain consistent across the site.

## Related Docs

- Project Plan: `comms/planning-overview.md`
- Next Steps: `NEXT_STEPS.md`
- Task Specs: `comms/tasks/`
