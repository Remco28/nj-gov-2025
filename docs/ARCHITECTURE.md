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

## Related Docs

- Project Plan: `comms/planning-overview.md`
- Next Steps: `NEXT_STEPS.md`
- Task Specs: `comms/tasks/`
