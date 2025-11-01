# Project Plan: Voter Decision Aid Website (Updated October 22, 2025)

## 1. Project Overview

### 1.1 Purpose
This website is designed to assist users—primarily the project owner, but potentially others—in making informed voting decisions by providing an interactive, inquiry-driven exploration of political candidates' talking points and claims. The core philosophy is to foster curiosity and depth without overwhelming users with dense, encyclopedia-like text. Instead, it uses a playful, layered approach inspired by a child repeatedly asking "why?" to dig into the root of issues, ensuring comprehensive truth-seeking while maintaining brevity and engagement.

Key goals:
- **Interactivity**: Users click on candidate images to generate random talking points via a "spinner," displayed in speech bubbles. Clicking bubbles reveals nested questions and answers for deeper inquiry.
- **Balance and Neutrality**: Incorporate counterpoints, responses, and contextual side facts to avoid bias, drawing from diverse sources.
- **Ease of Use and Update**: Optimized for quick content additions via Markdown files, with AI-assisted formatting to structured data. Focus on New Jersey candidates (e.g., Mikie Sherrill vs. Jack Ciattarelli) initially, but scalable to others.
- **Accessibility**: Keep explorations digestible—short answers, optional deeper levels, and source links for verification.
- **AI-Friendliness and Context Window Priority**: All content structures prioritize small, modular files/sections to respect AI context windows during formatting tasks. This enables rapid AI conversions (e.g., 10 seconds per task) from user-friendly raw Markdown inputs to site-ready formats, reducing manual effort.
- **Scope**: Start small; this is an iterative project. Break into specs for AI agents to implement components incrementally (e.g., one feature per task).

The site promotes critical thinking over rote information, turning election analysis into an engaging dialogue.

### 1.2 Target Audience
- Primary: The project owner for personal use.
- Secondary: General public interested in balanced political insights, especially during election seasons.
- Assumptions: Users are adults seeking depth; no moralizing or lecturing on edgy topics.

### 1.3 High-Level Requirements
- **Static Nature**: Fully static for hosting on GitHub Pages—no databases, server-side logic, or dynamic runtime.
- **SPA Design**: Single Page Application for smooth navigation without reloads.
- **Update Workflow**: Content starts as user-friendly raw Markdown files (simple, unstructured notes). AI agents convert these to modular, structured Markdown files (with YAML frontmatter). Push updates to GitHub for auto-deployment. Prioritize breaking content into small sections/files for AI efficiency.
- **Performance**: Fast-loading, mobile-responsive, accessible (ARIA labels, alt text).
- **Legal/Ethical**: Comply with GitHub's Acceptable Use Policy; use public-domain or fair-use images; cite sources accurately.

## 2. Features

### 2.1 Core Interactive Flow
1. **Candidate Selection**: Landing page with cards featuring candidate photos and names. Clicking a photo triggers a random talking point "spinner."
2. **Speech Bubble Generation**: A speech bubble appears with a random claim/talking point (e.g., "Jack Ciattarelli killed thousands of New Jerseyans by...").
3. **Detail View on Click**: Clicking the bubble opens a modal or overlay page with:
   - The full claim text.
   - Clickable questions (e.g., "How did Jack kill those people?", "How did Jack respond?") that expand to reveal concise answers.
   - Nested deeper questions within answers for recursive inquiry (e.g., "Why 2015?" leading to more levels).
4. **Side Panel**: A fixed or sticky panel listing key facts (e.g., "The company was sold in 2015; subsequent actions weren't under his direction").
5. **All-Points Overview**: A dedicated section or page listing all talking points for each candidate. Clicking any point loads the same detail view with questions, answers, and side facts.

### 2.2 Additional Enhancements
- **Randomization**: Spinner selects from a predefined list of points for replayability.
- **Navigation**: Dropdown or tabs to switch candidates; hash-based routing for shareable deep links (e.g., #sherrill-opioid-claim).
- **Visuals**: Subtle animations (e.g., bubble pop-ins, accordion expansions); icons for questions.
- **Content Guidelines**: Answers are 1-2 sentences; embed optional source links (e.g., to news articles). Avoid huge text blobs—focus on layered revelation.
- **Expansion Potential**: Modular for adding more candidates or elections via new Markdown files.

### 2.3 Non-Features (Out of Scope for Initial Iterations)
- User authentication or submissions.
- Real-time updates or backend integrations.
- Advanced search beyond built-in VitePress features.

## 3. Technical Stack

### 3.1 Framework and Tools
- **VitePress**: Primary SSG for Markdown-driven content, Vue integration for interactivity, and SPA configuration. Handles builds to static files.
- **Vue.js**: For reactive components (e.g., modals, accordions, recursive inquiry trees).
- **Vite**: Build tool for fast development and optimization.
- **Markdown with Frontmatter**: Content storage; YAML for structured data like claims, questions, and side facts.
- **CSS**: Custom styles for bubbles, panels, and animations (use Vue transitions).
- **JavaScript**: Vanilla or Vue-scripted logic for randomization, data fetching (from frontmatter), and DOM manipulation.
- **Deployment**: GitHub Pages with GitHub Actions for automated builds on push.

### 3.2 Data Structure
**Update (Oct 31, 2025):** Interactive data now lives in JSON topic files (`docs/content/topics/<candidate>/<topic-id>.json`). Each topic file captures one top-level talking point plus its recursive follow-ups, and the contents are temporarily copied into `docs/content/candidates.json` for the build. The Markdown guidance below still applies to research drafts, but AI conversion should target the JSON template referenced in `docs/content/README.md`.

To prioritize AI-friendliness and context windows, content remains modular: One user-facing research note per topic, one JSON topic file per talking point, and a lightweight aggregate consumed at build time. This keeps files small (under 500-1000 lines), allowing AI to process/format one at a time efficiently without overwhelming context.

- **Workflow**:
  - Human (owner) creates initial "user-friendly" Markdown files: Simple, unstructured notes (e.g., plain text dumps of claims, questions, answers, facts).
  - AI agents convert these to "site-ready" structured Markdown: Add YAML frontmatter for data, ensuring modularity.
  - VitePress aggregates via content collections or custom loaders for rendering.

- **Folder Structure**:
  - `/docs/candidates/[candidate-name].md`: Main file with basics (photo, talkingPoints array linking to claim files).
  - `/docs/candidates/[candidate-name]/[claim-slug].md`: One per claim, with structured questions, deeper nests, and sideFacts.

- **Example User-Friendly Input Markdown (For Human to Create)**:
  This is the raw, easy-to-write format you (the owner) use initially. Keep it simple—no strict structure needed. AI will parse and convert it.

  ```
  # Mikie Sherrill - Opioid Crisis Claim
  
  Main Claim: During a debate, Sherrill accused Ciattarelli's former company of working with opioid manufacturers, leading to profits amid the crisis that killed tens of thousands.
  
  Question 1: How did Jack allegedly contribute to those deaths?
  Answer: Sherrill claimed his medical publishing firm partnered with companies like Purdue Pharma, promoting opioids that fueled addiction epidemics.
  Deeper Question: What specific actions did the company take?
  Deeper Answer: It allegedly provided marketing and education materials that downplayed risks, though Ciattarelli denies direct involvement.
  Even Deeper: Why 2015?
  Even Deeper Answer: That's when Ciattarelli sold the company; subsequent controversies occurred under new ownership.
  
  Question 2: How did Jack respond to those allegations?
  Answer: Ciattarelli called it defamation, threatening a lawsuit, and emphasized he sold the firm before key events.
  Deeper: Is there evidence of defamation?
  Deeper Answer: Legal experts note potential, as claims of 'killing thousands' could be seen as reckless.
  
  Side Facts:
  - The company (Galen Publishing) was sold in 2015; subsequent actions weren't under his direction.
  - Sherrill doubled down, citing profits from 'worst offenders' in the crisis.
  - Ciattarelli's campaign highlights her own pharma donations.
  
  Sources: [link to NJ Monitor], [link to Ciattarelli statement]
  ```

- **Example Site-Ready Output Markdown (After AI Conversion)**:
  AI formats the above into this modular structure for VitePress.

  ```
  ---
  title: Opioid Crisis Claim
  mainClaim: During a debate, Sherrill accused Ciattarelli's former company of working with opioid manufacturers, leading to profits amid the crisis that killed tens of thousands.
  questions:
    - question: How did Jack allegedly contribute to those deaths?
      answer: Sherrill claimed his medical publishing firm partnered with companies like Purdue Pharma, promoting opioids that fueled addiction epidemics.
      deeper:
        - question: What specific actions did the company take?
          answer: It allegedly provided marketing and education materials that downplayed risks, though Ciattarelli denies direct involvement.
          deeper:
            - question: Why 2015?
              answer: That's when Ciattarelli sold the company; subsequent controversies occurred under new ownership.
    - question: How did Jack respond to those allegations?
      answer: Ciattarelli called it defamation, threatening a lawsuit, and emphasized he sold the firm before key events.
      deeper:
        - question: Is there evidence of defamation?
          answer: Legal experts note potential, as claims of 'killing thousands' could be seen as reckless.
  sideFacts:
    - The company (Galen Publishing) was sold in 2015; subsequent actions weren't under his direction.
    - Sherrill doubled down, citing profits from 'worst offenders' in the crisis.
    - Ciattarelli's campaign highlights her own pharma donations.
  sources:
    - url: https://njmonitor.com/article
      description: NJ Monitor report
    - url: https://ciattarelli.com/statement
      description: Ciattarelli's response
  ---
  
  # Claim Details
  Brief intro or additional free-form text here if needed.
  ```

- **Aggregation in VitePress**: Use content queries or custom Vue logic to pull all claim files for a candidate's all-points overview.

## 4. Implementation Plan

### 4.1 Phases (Iterative Approach)
Break into small specs for AI agents. Each phase delivers a working increment. Incorporate AI formatting tasks as sub-specs.

1. **Setup and Skeleton (Phase 1)**:
   - Initialize VitePress project: `npm init vitepress`.
   - Configure as SPA: Set `spa: true` in `config.js`.
   - Create basic landing page with candidate cards (static HTML/Vue).
   - Add GitHub repo and Pages deployment workflow.
   - Sub-Spec: AI task to generate sample user-friendly Markdown and convert to site-ready.

2. **Content Structure and Data Handling (Phase 2)**:
   - Define modular Markdown folder structure (e.g., per-candidate subfolders for claims).
   - Implement frontmatter parsing and aggregation in Vue components.
   - Create a sample main candidate file and one claim file (e.g., Sherrill with opioid claim).
   - Sub-Spec: Develop AI prompt templates for converting user-friendly Markdown to structured format.

3. **Interactive Components (Phase 3)**:
   - Build spinner logic: Random selection from talkingPoints array.
   - Speech bubble component: Vue with CSS styling.
   - Detail modal: Vue dialog with question accordions (use recursive components for deeper levels).
   - Side panel: Fixed Vue slot populated from sideFacts.

4. **All-Points Overview (Phase 4)**:
   - Create a page that aggregates and lists all points across candidates' claim files.
   - Link clicks to load detail modals (reuse components from Phase 3).

5. **Polish and Testing (Phase 5)**:
   - Add animations, accessibility features.
   - Mobile responsiveness testing.
   - Local dev setup: `npm run dev` for previews.

6. **Deployment and Iteration (Ongoing)**:
   - Push to GitHub; verify Pages build.
   - Add more candidates/claims via new specs, using AI for formatting.

### 4.2 Development Guidelines
- **Modularity**: Each feature as a reusable Vue component (e.g., `InquiryTree.vue` for nested questions). Mirror in content: One file per claim for AI efficiency.
- **Testing**: Manual browser tests; consider Vitest for unit tests on logic.
- **Version Control**: Use branches for features; merge to main for deploys.
- **AI Agent Specs**: Provide small, focused tasks, e.g., "Convert this user-friendly Markdown to site-ready format: [paste content]." or "Implement the speech bubble component based on this spec: [details]."
- **Dependencies**: Minimize; stick to VitePress defaults.

## 5. Deployment and Maintenance

### 5.1 Deployment
- Host on GitHub Pages: Set publishing source to `dist` after builds.
- Workflow: GitHub Actions YAML to run `npm run build` on push to main.
- Custom Domain: Optional; configure via repo settings.

### 5.2 Maintenance
- **Updates**: Human writes user-friendly Markdown → AI formats to modular site-ready files → Commit → Auto-deploy.
- **Scalability**: Add files for new content; small sizes ensure quick AI tasks and builds.
- **Monitoring**: GitHub Pages logs for errors; manual checks for quotas (e.g., <1GB site size).
- **Backups**: Git repo serves as versioned backup.

## 6. Risks and Mitigations
- **Learning Curve**: VitePress/Vue—mitigate with docs and small specs.
- **Content Bias**: Ensure diverse sources in data—review during updates.
- **Quotas**: Monitor GitHub limits—switch to alternatives like Vercel if needed.
- **AI Context Overruns**: Modular files minimize this; test AI prompts on small inputs first.
- **Iteration Delays**: Keep specs atomic to maintain momentum.
