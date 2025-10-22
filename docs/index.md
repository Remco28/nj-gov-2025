---
layout: home

hero:
  name: "Voter Decision Aid"
  text: "An interactive guide to political candidates."
  tagline: Explore claims, ask questions, and get the facts.
  actions:
    - theme: brand
      text: Get Started
      link: /candidates/
---

<script setup>
import { getCandidateCount } from './.vitepress/data/candidates'

const candidateCount = getCandidateCount()
</script>

<div style="text-align: center; margin: 2rem 0; padding: 2rem; background: var(--vp-c-bg-soft); border-radius: 8px;">
  <h2 style="margin-top: 0;">{{ candidateCount }} Candidates</h2>
  <p style="color: var(--vp-c-text-2); margin-bottom: 0;">Currently tracked in our database</p>
</div>
