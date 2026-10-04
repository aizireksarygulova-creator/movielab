<script setup>
import { ref } from 'vue'
const draftKey = ref('')
const connected = ref(false)
let apiKey = ''
function connect() {
  apiKey = draftKey.value.trim()
  connected.value = Boolean(apiKey)
  draftKey.value = ''
}
</script>
<template>
  <main class="catalog">
    <h1>Movie Lab: API setup</h1>
    <form class="starter-form" @submit.prevent="connect">
      <label for="tmdb-key">TMDB API Key (v3)</label>
      <input id="tmdb-key" type="password" v-model="draftKey" autocomplete="off" required>
      <button>Store in memory</button>
    </form>
    <p v-if="connected">Key received. Next: copy checkpoint 02 to request popular movies.</p>
    <p>The starter stores the key in memory but does not make a request yet. Reload to clear it.</p>
  </main>
</template>
