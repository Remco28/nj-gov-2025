# Candidates

Explore the candidates running in the New Jersey gubernatorial election.

<script setup>
import { getAllCandidates } from '../.vitepress/data/candidates'

const candidates = getAllCandidates()
</script>

<CandidateGrid :candidates="candidates" />
