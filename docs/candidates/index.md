# Candidates

<style>
.candidate-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}
.candidate-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  transition: background-color 0.25s;
}
.candidate-card:hover {
  background-color: var(--vp-c-bg-soft);
}
.candidate-card img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
}
.candidate-name {
  font-weight: 600;
}
</style>

<div class="candidate-grid">
  <div class="candidate-card">
    <img src="https://via.placeholder.com/100" alt="Mikie Sherrill">
    <div class="candidate-name">Mikie Sherrill</div>
  </div>
  <div class="candidate-card">
    <img src="https://via.placeholder.com/100" alt="Jack Ciattarelli">
    <div class="candidate-name">Jack Ciattarelli</div>
  </div>
</div>

<script setup>
// Vue script block for future interactivity
</script>
