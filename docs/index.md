---
layout: home

hero:
  name: "Voter Decision Aid"
  text: "An interactive guide to political candidates."
  tagline: Explore claims, ask questions, and get the facts. Browse every talking point in the All Points catalog.
  actions:
    - theme: brand
      text: Explore Candidates
      link: /candidates/
    - theme: alt
      text: View All Points
      link: /all-points/
---

<style scoped>
:deep(.VPHero) {
  padding-top: var(--space-3xl) !important;
  padding-bottom: var(--space-2xl) !important;
}

:deep(.container) {
  max-width: 1040px;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 768px) {
  :deep(.VPHero) {
    padding-top: var(--space-2xl) !important;
    padding-bottom: var(--space-xl) !important;
  }

  :deep(.actions) {
    flex-direction: column;
  }

  :deep(.action) {
    width: 100%;
  }
}
</style>
