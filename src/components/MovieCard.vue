<script setup>
import { computed, ref, watch } from 'vue'
import { posterUrl } from '../api.js'
const props = defineProps({ movie: { type: Object, required: true } })
const imageFailed = ref(false)
const imageUrl = computed(() => posterUrl(props.movie.poster_path))
const rating = computed(() => props.movie.vote_count > 0
  ? Number(props.movie.vote_average).toFixed(1) : 'NR')
watch(imageUrl, () => { imageFailed.value = false })
</script>

<template>
  <article class="movie-card">
    <img v-if="imageUrl && !imageFailed" class="movie-poster"
      :src="imageUrl" :alt="`${movie.title} poster`" loading="lazy"
      width="500" height="750" @error="imageFailed = true">
    <div v-else class="poster-fallback"><span>No poster available</span><strong>{{ movie.title }}</strong></div>
    <div class="movie-info">
      <span class="rating" :aria-label="rating === 'NR' ? 'Not rated' : `Rating ${rating} out of 10`">
        {{ rating }}<small v-if="rating !== 'NR'">/10</small>
      </span>
      <p class="genre">TMDB MOVIE</p>
      <h3><a :href="`https://www.themoviedb.org/movie/${movie.id}`" target="_blank" rel="noopener">{{ movie.title }}</a></h3>
      <time v-if="movie.release_date" :datetime="movie.release_date">{{ movie.release_date }}</time>
      <span v-else class="unknown-date">Release date unknown</span>
      <p class="overview">{{ movie.overview || 'No overview available.' }}</p>
    </div>
  </article>
</template>
