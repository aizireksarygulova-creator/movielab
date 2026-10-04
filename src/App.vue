<script setup>
import { ref, onBeforeUnmount } from 'vue'
import MovieCard from './components/MovieCard.vue'
import { fetchMovies } from './api.js'
import tmdbLogo from './assets/tmdb-logo.svg'

const draftKey = ref('')
const apiKey = ref('') // Memory only. No localStorage, environment variable or source-code key.
const query = ref('')
const activeQuery = ref('')
const movies = ref([])
const page = ref(1)
const totalPages = ref(0)
const totalResults = ref(0)
const loading = ref(false)
const error = ref('')
let controller
let requestId = 0

async function loadMovies(nextPage = 1, term = activeQuery.value) {
  const id = ++requestId
  controller?.abort()
  const currentController = new AbortController()
  controller = currentController
  let timedOut = false
  const timer = setTimeout(() => { timedOut = true; currentController.abort() }, 15000)
  loading.value = true
  error.value = ''
  movies.value = []
  try {
    const data = await fetchMovies({ apiKey: apiKey.value, query: term,
      page: nextPage, signal: currentController.signal })
    if (id !== requestId) return
    movies.value = data.results
    page.value = data.page
    totalPages.value = Math.min(data.total_pages, 500)
    totalResults.value = data.total_results
    activeQuery.value = term
  } catch (err) {
    if (id !== requestId) return
    error.value = timedOut ? 'Request timed out. Check your connection and retry.'
      : err.name === 'AbortError' ? ''
      : err.status !== undefined ? err.message
      : 'Could not reach TMDB. Check your connection or try again later.'
  } finally {
    clearTimeout(timer)
    if (id === requestId) loading.value = false
  }
}
function connect() {
  const key = draftKey.value.trim()
  if (!key) return
  apiKey.value = key
  draftKey.value = ''
  activeQuery.value = ''
  query.value = ''
  loadMovies(1, '')
}
function search() { loadMovies(1, query.value.trim()) }
function popular() { query.value = ''; loadMovies(1, '') }
function disconnect() {
  requestId++
  controller?.abort()
  apiKey.value = ''; draftKey.value = ''; query.value = ''; activeQuery.value = ''
  movies.value = []; error.value = ''; loading.value = false
  page.value = 1; totalPages.value = 0; totalResults.value = 0
}
onBeforeUnmount(() => { requestId++; controller?.abort() })
</script>

<template>
  <header class="site-header">
    <a class="brand" href="#top">MOVIE<span>LAB</span></a>
    <nav aria-label="Main navigation"><a href="#movies">Movies</a><a href="#about">About & credits</a></nav>
    <span class="lab-label">VUE + TMDB API / WEEK 04</span>
  </header>
  <main id="top">
    <section class="hero" aria-labelledby="hero-title">
      <p class="eyebrow">LIVE MOVIE DATA FROM TMDB</p>
      <h1 id="hero-title">Your next story<br>starts here.</h1>
      <p>Browse popular movies and search the TMDB catalog.</p>
      <form v-if="!apiKey" class="key-form" @submit.prevent="connect">
        <label for="tmdb-key">TMDB API Key (v3)</label>
        <div class="search-field"><input id="tmdb-key" v-model="draftKey" type="password"
          placeholder="Paste your own API Key (v3)" autocomplete="off" spellcheck="false" required>
          <button type="submit" :disabled="!draftKey.trim()">Connect</button></div>
        <p class="key-help">Used only in this tab’s memory. Reloading clears it.
          <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener">Get your key</a></p>
      </form>
      <template v-else>
        <form class="search-form" role="search" @submit.prevent="search">
          <label for="movie-query">Search movie titles</label>
          <div class="search-field"><input id="movie-query" v-model="query" type="search"
            placeholder="Try a movie title…" autocomplete="off"><button :disabled="loading" type="submit">Search</button></div>
        </form>
        <div class="connection-actions"><button type="button" :disabled="loading" @click="popular">Popular movies</button>
          <button type="button" @click="disconnect">Clear / change key</button></div>
      </template>
    </section>
    <section id="movies" class="catalog" aria-labelledby="catalog-title" :aria-busy="loading">
      <div class="section-heading"><div><p class="eyebrow">THE MOVIE DATABASE</p>
        <h2 id="catalog-title">{{ activeQuery ? `Results for “${activeQuery}”` : 'Popular movies' }}</h2></div></div>
      <div v-if="!apiKey" class="empty-state"><h3>Connect to TMDB</h3><p>Enter your API Key (v3) above to load real movies.</p></div>
      <p v-else-if="loading" class="status-box" role="status">Loading movies from TMDB…</p>
      <div v-else-if="error" class="status-box error" role="alert"><h3>Could not load movies</h3><p>{{ error }}</p>
        <button @click="search">Retry current search</button></div>
      <template v-else>
        <p class="result-count" role="status">{{ totalResults }} results · page {{ page }} · {{ movies.length }} shown</p>
        <div v-if="movies.length" class="movie-grid"><MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" /></div>
        <div v-else class="empty-state"><h3>No movies found</h3><p>Try another title or browse popular movies.</p><button @click="popular">Show popular movies</button></div>
        <nav v-if="totalPages > 1" class="pagination" aria-label="Result pages">
          <button :disabled="page <= 1" @click="loadMovies(page - 1)">Previous</button>
          <span>Page {{ page }} of {{ totalPages }}</span>
          <button :disabled="page >= totalPages" @click="loadMovies(page + 1)">Next</button>
        </nav>
      </template>
    </section>
  </main>
  <footer id="about" class="site-footer">
    <strong>MOVIE LAB / ABOUT & CREDITS</strong>
    <a class="tmdb-credit" href="https://www.themoviedb.org/" target="_blank" rel="noopener"><img :src="tmdbLogo" alt="TMDB" width="110"></a>
    <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
    <p>A classroom project. Each visitor supplies their own API Key (v3), kept in memory and sent only to TMDB for API requests. Movie data and posters need internet access.</p>
  </footer>
</template>
