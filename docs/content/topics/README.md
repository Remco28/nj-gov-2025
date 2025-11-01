# Topic File Authoring Guide

- Create one JSON file per talking point topic. Nest follow-ups directly under the topic.
- Directory naming: `docs/content/topics/<candidate-id>/<topic-id>.json`.
- Include `candidateId` in the topic file so automation can connect it to the right candidate later.
- Keep files lean: avoid adding more than one primary topic per file, and trim unused follow-ups instead of commenting them out.
- When assembling `candidates.json`, remove the `candidateId` field and copy the topic object into the candidate’s `talkingPoints` array.
- Validate structure by running `npm run build` after updating the aggregate file.

See `docs/content/README.md` for the complete schema reference and examples.
