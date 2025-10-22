# Candidates

Explore the candidates running in the New Jersey gubernatorial election.

<script setup>
import { getAllCandidates } from '../.vitepress/data/candidates'

const candidates = getAllCandidates()
</script>

## Interactive Explorer

Spin to explore a random talking point from each candidate!

<div v-for="candidate in candidates" :key="candidate.id" style="margin-bottom: 3rem;">
  <CandidateInteractive :candidate="candidate" />
</div>

---

## All Candidates

<CandidateGrid :candidates="candidates" />
