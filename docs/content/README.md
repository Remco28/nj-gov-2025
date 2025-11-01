# Content Management Guide

This directory contains the structured data files that power the NJ Politics voter decision aid website.

## Overview

All candidate information, talking points, and related content is managed through JSON files in this directory. This approach makes it easy for content editors to update information without touching code.

## File Structure

- `candidates.json` – Aggregated candidate list consumed by the site build (temporary until automated assembly is in place)
- `topics/` – **Authoring home for all talking point topics and follow-ups (one file per topic)**

```
docs/content/
├── candidates.json         # auto-generated or manually assembled aggregate
└── topics/
    ├── mikie-sherrill/
    │   └── sherrill-healthcare.json
    └── jack-ciattarelli/
        └── ciattarelli-taxes.json
```

## Working with Candidates

### Adding a New Candidate

1. Open `candidates.json`
2. Add a new object to the `candidates` array:

```json
{
  "id": "candidate-name",
  "name": "Candidate Full Name",
  "party": "Party Name",
  "headshot": "https://example.com/photo.jpg",
  "summary": "Brief description of the candidate's background.",
  "issues": [],
  "talkingPoints": []
}
```

**Field Guide:**
- `id`: Unique identifier in kebab-case (e.g., "john-doe")
- `name`: Candidate's full name as displayed
- `party`: Political party affiliation
- `headshot`: URL to candidate photo (portrait-oriented, displayed at 128px circles - see note below)
- `summary`: 1-2 sentence bio
- `issues`: Reserved for future use
- `talkingPoints`: Array of talking point objects (see below)

**Headshot Image Guidelines:**
- Headshots are displayed as 128px circular images on candidate cards and in the All Points index
- Use portrait-oriented images (3:4 aspect ratio works well)
- Images should be at least 256x256px for crisp display on high-DPI screens
- Faces will be centered using `object-fit: cover` to ensure proper cropping
- If an image fails to load, the system displays the candidate's initials as a fallback

### Authoring Talking Point Topics (One File Per Topic)

Talking points follow a **topic → follow-up question** hierarchy. To keep AI agents within a comfortable context window, store **each topic (with its follow-ups) in its own JSON file** under `docs/content/topics/<candidate-id>/`.

**Topic File Template:** `docs/content/topics/<candidate>/<topic-id>.json` (start from `templates/topic.json`)

```json
{
  "id": "sherrill-affordability",
  "candidateId": "mikie-sherrill",
  "title": "Make New Jersey Affordable",
  "summary": "Focus on housing, taxes, and transit costs to keep families in the state.",
  "details": "Sherrill’s affordability agenda combines housing supply reforms, targeted tax credits, and commuter rail upgrades.",
  "sources": [
    {
      "label": "Affordability Plan",
      "url": "https://example.com/affordability"
    }
  ],
  "followUps": [
    {
      "id": "sherrill-affordability-housing",
      "prompt": "Has this approach been tried in other cities? How did it work out?",
      "summary": "Minneapolis and Houston both relaxed zoning and saw measurable increases in housing supply.",
      "details": "YIMBY zoning reforms in Minneapolis spurred duplex construction, while Houston’s permitting changes cut build timelines by 15%.",
      "followUps": []
    }
  ]
}
```

**Field Guide:**
- `id`: Unique identifier in kebab-case (globally unique across all topics).
- `candidateId`: Parent candidate identifier (matches `candidates.json`).
- `title`, `summary`, `details`, `sources`: Same semantics as before.
- `followUps`: Optional array of follow-up nodes, each with `id`, `prompt`, `summary`, optional `details`, optional nested `followUps`, and optional `sources`.

Keep each file focused on a single talking point. If a topic grows too large, consider splitting follow-up chains into separate files and referencing them (future tooling will support composition).

### Assembling `candidates.json` (Temporary Manual Step)

Until automated assembly lands, the site still reads from `docs/content/candidates.json`. After authoring or updating topic files:

1. Ensure the candidate exists in `candidates.json` (see “Adding a New Candidate” above).
2. Copy the topic object (including `followUps`) from the topic file and paste it into the candidate’s `talkingPoints` array.
3. Remove authoring-only fields (e.g., `candidateId`) so the runtime structure matches the existing `TalkingPoint` TypeScript interface.
4. Keep `candidates.json` tidy—only include the fields used by the site. Do not embed helper notes or drafts here.

> **Heads up:** Once the modular loader is implemented, `candidates.json` will be auto-generated from the `topics/` directory. Keeping each topic isolated now will make the migration seamless.

## Best Practices

### Writing Guidelines

**Summaries:**
- Keep concise (1-2 sentences)
- Focus on the key message
- Use active voice
- Avoid jargon

**Details:**
- Provide context and background
- Include specific examples when possible
- Cite sources for claims
- Maintain neutral, factual tone

### Sources

- Always include sources for specific claims
- Use official sources when available (government records, official statements)
- Include publication date in the label if relevant
- Verify links are working before committing

### Data Quality

- Use consistent formatting
- Keep IDs lowercase and kebab-case (`candidateId` + topic context is a good mental namespace)
- Ensure all required fields are present
- Test the interactive spinner after assembling `candidates.json`

## QA Checklist

After updating candidate data, review the [QA Dashboard](/qa/) to ensure content quality:

**What to Check:**
- **Critical Issues**: Resolve these before publishing
  - Candidates without talking points
  - Duplicate talking point IDs (each ID must be unique across all candidates)
- **Warning Issues**: Address these for better content quality
  - Missing details in talking points
  - Missing sources (at least one source recommended per talking point)
  - Placeholder headshots (replace with actual candidate photos)

**Common Warnings & How to Fix:**
- **"Talking point missing sources"**: Add at least one source citation to the `sources` array
- **"Talking point missing details"**: Fill in the `details` field with extended explanation
- **"Placeholder headshot"**: Replace placeholder URLs (e.g., via.placeholder.com) with real candidate photos
- **"Candidate has no talking points"**: Add at least 2-3 talking points to the candidate's `talkingPoints` array

The QA Dashboard automatically scans `candidates.json` and highlights issues, making it easy to maintain high-quality content without manual verification.

## Validation

After making changes:

1. Run `npm run build` to verify JSON is valid
2. Check the development server (`npm run dev`) to see your changes
3. Test the interactive spinner for each candidate
4. Verify all links in sources work

## Need Help?

- See the main architecture documentation: `docs/ARCHITECTURE.md`
- Review existing examples in `candidates.json`
- Check the project manifest for additional resources: `project-manifest.md`

## Future Enhancements

The `issues` field is reserved for Phase 4 when we'll add issue-based navigation and filtering. Leave it as an empty array for now.
