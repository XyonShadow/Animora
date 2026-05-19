/**
 * api/Jikan.js
 * 
 * This file is the central API layer for all Jikan requests.
 *  - Rate limiting (prevents too many requests)
 *  - Caching (reuses previous results for speed)
 *  - Deduplication (avoids duplicate requests)
 *  - Request cancellation (stops unnecessary requests)
 * 
 * Changes:
 *  - Unified request options across all API calls
 *  - Improved cleanup of in-flight requests
 *  - Made all API functions accept optional request options
 */

const BASE_URL = "https://api.jikan.moe/v4";

/* --------------------------- RATE LIMIT SYSTEM --------------------------- */

let requestQueue = Promise.resolve();
const RATE_DELAY_MS = 400;

/* Ensures all requests run one after another with a delay */
function rateLimited(fn) {
  requestQueue = requestQueue.then(
    () => new Promise((resolve) => setTimeout(resolve, RATE_DELAY_MS))
  );

  return requestQueue.then(fn);
}

/* --------------------------- CACHE + DEDUP SYSTEM --------------------------- */

// Stores completed API results
const cache = new Map();

// Stores ongoing requests (prevents duplicate simultaneous calls)
const inFlightRequests = new Map();

/* --------------------------- CORE API FETCH WRAPPER --------------------------- */

/* Handles all API requests */
// Handles caching, deduplication, rate limiting, and request cancellation
async function apiFetch(path, params = {}, options = {}) {
  // Build a stable cache key using URL query parameters
  const cacheKey = path + "?" + new URLSearchParams(params).toString();

  // Return cached response if data is already available
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  // Return existing in-flight request if already running
  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  // Create the actual request wrapped in rate limiting
  const requestPromise = rateLimited(async () => {
    const url = new URL(`${BASE_URL}${path}`);

    // Attach query parameters to URL
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, value);
      }
    });

    // Execute fetch request (supports AbortController via options.signal)
    const response = await fetch(url.toString(), options);

    // Handle HTTP errors
    if (!response.ok) {
      throw new Error(`Jikan API error ${response.status}: ${path}`);
    }

    // Parse JSON response
    const json = await response.json();

    // Return only the useful data payload
    return json.data;
  });

  // Store request immediately to avoid duplicate calls
  inFlightRequests.set(cacheKey, requestPromise);

  // Handle success + error + cleanup
  return requestPromise
    .then((data) => {
      // Cache successful response
      cache.set(cacheKey, data);
      return data;
    })
    .catch((err) => {
      // Remove failed request from in-flight tracker
      inFlightRequests.delete(cacheKey);
      throw err;
    })
    .finally(() => {
      // Ensure cleanup only if this is still the active request
      if (inFlightRequests.get(cacheKey) === requestPromise) {
        inFlightRequests.delete(cacheKey);
      }
    });
}

/* --------------------------- API FUNCTIONS (WRAPPERS) --------------------------- */

/* Fetch top anime list (supports pagination + type filtering) */
async function getTopAnime(limit = 10, page = 1, type = undefined, options = {}) {
  return apiFetch("/top/anime", { limit, page, type }, options);
}

/* Fetch currently airing anime */
async function getSeasonNow(limit = 10, options = {}) {
  return apiFetch("/seasons/now", { limit }, options);
}

/**
 * Search anime by query string
 * Includes guard clause to prevent unnecessary API calls
 */
async function searchAnime(query, limit = 10, options = {}) {
  // Prevent unnecessary API calls for empty or very short queries
  if (!query || query.trim().length < 2) return [];

  return apiFetch("/anime", { q: query.trim(), limit, sfw: true }, options);
}

/* Fetch full anime details by ID */
async function getAnimeById(id, options = {}) {
  return apiFetch(`/anime/${id}/full`, {}, options);
}

/* Fetch anime by genre */
async function getAnimeByGenre(genreId, limit = 10) {
  return apiFetch("/anime", {
    genres: genreId,     // filter by genre
    limit,               // number of results
    order_by: "score",   // Sorted by highest score
    sort: "desc",        // highest rated first
  });
}

/* Fetch anime images */
async function getAnimeImages(id, options = {}) {
  return apiFetch(`/anime/${id}/pictures`, {}, options);
}

/* --------------------------- HELPERS --------------------------- */

/* Returns best available image URL for anime object */
function getImageUrl(anime) {
  return (
    anime?.images?.jpg?.large_image_url ||
    anime?.images?.jpg?.image_url ||
    anime?.images?.webp?.large_image_url ||
    ""
  );
}

/* Formats score to 1 decimal place */
function formatScore(score) {
  if (!score) return "N/A";
  return Number(score).toFixed(1);
}

/* Truncates long text at word boundary */
function truncateSynopsis(text, maxLen = 200) {
  if (!text) return "";
  if (text.length <= maxLen) return text;

  return text.slice(0, maxLen).replace(/\s\S*$/, "") + "…";
}

/* --------------------------- EXPORTS --------------------------- */

export {
  getTopAnime,
  getSeasonNow,
  searchAnime,
  getAnimeById,
  getAnimeByGenre,
  getAnimeImages,
  getImageUrl,
  formatScore,
  truncateSynopsis,
};