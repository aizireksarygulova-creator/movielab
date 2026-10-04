// The key is supplied at runtime. Never paste a personal key into this file.
const API_BASE = 'https://api.themoviedb.org/3'

export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

export async function fetchMovies({ apiKey, query = '', page = 1, signal }) {
  if (!apiKey.trim()) throw new ApiError(0, 'Enter your API Key (v3).')
  const term = query.trim()
  const endpoint = term ? '/search/movie' : '/movie/popular'
  const params = new URLSearchParams({
    api_key: apiKey.trim(), language: 'en-US', page: String(page),
  })
  if (term) {
    params.set('query', term)
    params.set('include_adult', 'false')
  }
  const response = await fetch(`${API_BASE}${endpoint}?${params}`, {
    headers: { accept: 'application/json' }, signal,
  })
  if (!response.ok) {
    const messages = {
      401: 'API key rejected. Check API Key (v3) in your TMDB settings.',
      403: 'Access was denied. Check your TMDB account and API permissions.',
      429: 'Too many requests. Wait a moment, then retry.',
    }
    throw new ApiError(response.status,
      messages[response.status] || `TMDB request failed (HTTP ${response.status}). Try again later.`)
  }
  const data = await response.json()
  if (!Array.isArray(data.results)) throw new ApiError(0, 'Unexpected response format.')
  return data
}

export function posterUrl(posterPath) {
  return posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : ''
}
