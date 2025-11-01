# Content Management Guide

This directory contains the structured data files that power the NJ Politics voter decision aid website.

## Overview

All candidate information, talking points, and related content is managed through JSON files in this directory. This approach makes it easy for content editors to update information without touching code.

## File Structure

- `candidates.json` - Complete candidate information including talking points

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

### Adding Talking Points

Talking points power the interactive spinner feature. Each talking point represents a position, claim, or policy that users can explore.

**Talking Point Structure:**

```json
{
  "id": "unique-talking-point-id",
  "title": "Short Headline",
  "summary": "Brief 1-2 sentence summary displayed in the speech bubble.",
  "details": "Longer explanation with more context. This appears in the modal when users click for details.",
  "sources": [
    {
      "label": "Source Name",
      "url": "https://example.com/source"
    }
  ]
}
```

**Field Guide:**
- `id`: Unique identifier in kebab-case (e.g., "sherrill-healthcare")
- `title`: 3-6 word headline
- `summary`: 1-2 sentences for the speech bubble (aim for 100-150 characters)
- `details`: Full explanation with context (optional but recommended)
- `sources`: Array of citation objects with label and URL (optional)

### Example: Adding a Talking Point

```json
{
  "id": "mikie-sherrill",
  "name": "Mikie Sherrill",
  "party": "Democratic",
  "headshot": "https://via.placeholder.com/100",
  "summary": "U.S. Representative for New Jersey's 11th congressional district.",
  "issues": [],
  "talkingPoints": [
    {
      "id": "sherrill-education",
      "title": "Education Funding",
      "summary": "Supports increased funding for public schools and universal pre-K programs.",
      "details": "Mikie Sherrill has championed legislation to increase federal education funding, with a focus on reducing class sizes and expanding access to early childhood education. Her education plan includes increased teacher salaries and modernized school facilities.",
      "sources": [
        {
          "label": "Education Policy Statement",
          "url": "https://example.com/policy"
        }
      ]
    }
  ]
}
```

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
- Keep IDs lowercase and kebab-case
- Ensure all required fields are present
- Test the interactive spinner after adding talking points

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
