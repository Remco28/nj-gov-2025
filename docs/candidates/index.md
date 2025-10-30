# Candidates

Explore the candidates running in the New Jersey gubernatorial election. Click on each candidate's photo to spin for a random talking point!

<script setup>
import { getAllCandidates } from '../.vitepress/data/candidates'

const candidates = getAllCandidates()
</script>

<div v-for="candidate in candidates" :key="candidate.id" style="margin-bottom: 4rem;">
  <CandidateInteractive :candidate="candidate" />
</div>

---

::: tip Looking for a full list?
Visit the [All Talking Points](/all-points/) index to browse every talking point from all candidates in one place. Perfect for comparing positions and finding specific claims.
:::
