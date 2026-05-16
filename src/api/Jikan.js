/**
  * Changes
    - added in-memory cache system to prevent duplicate API requests
    - added in-flight request tracking to reuse ongoing requests
  *
  * Central API layer for all Jikan requests
  * Now handles rate limiting, caching, and request deduplication
  *
 */

const BASE_URL = "https://api.jikan.moe/v4";

/* --------------------------- RATE LIMIT SYSTEM --------------------------- */

let requestQueue = Promise.resolve();
const RATE_DELAY_MS = 400;

/* Ensures API requests run sequentially with delay */
function rateLimited(fn) {
  requestQueue = requestQueue.then(
    () =>
      new Promise((resolve) => {
        setTimeout(resolve, RATE_DELAY_MS);
      })
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
async function apiFetch(path, params = {}) {
  const cacheKey = `${path}-${JSON.stringify(params)}`;

  // Return cached response if data is already available
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  // Return ongoing request if already in progress
  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  // Create request promise
  const requestPromise = rateLimited(async () => {
    const url = new URL(`${BASE_URL}${path}`);

    // Append query parameters if they exist
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, value);
      }
    });

    // Perform HTTP request
    const response = await fetch(url.toString());

    // Handle non-success responses
    if (!response.ok) {
      throw new Error(`Jikan API error ${response.status}: ${path}`);
    }

    // Parse JSON response
    const json = await response.json();

    // Return only the useful data payload
    return json.data;
  });

  // Store in-flight request immediately
  inFlightRequests.set(cacheKey, requestPromise);

  // Resolve, cache, cleanup
  return requestPromise
    .then((data) => {
      cache.set(cacheKey, data);
      return data;
    })
    .finally(() => {
      inFlightRequests.delete(cacheKey);
    });
}

/* --------------------------- API FUNCTIONS (ENDPOINT WRAPPERS) --------------------------- */

/* Fetch top-rated anime list */
async function getTopAnime(limit = 10, page = 1) {
  return apiFetch("/top/anime", { limit, page });
}

/* Fetch currently airing anime */
async function getSeasonNow(limit = 10) {
  return apiFetch("/seasons/now", { limit });
}

/* Search anime by query string */
async function searchAnime(query, limit = 10) {
  // Prevent unnecessary API calls for empty or very short queries
  if (!query || query.trim().length < 2) return [];

  return apiFetch("/anime", {
    q: query.trim(),
    limit,
    sfw: true,
  });
}

/* Fetch full anime details by ID */
async function getAnimeById(id) {
  return apiFetch(`/anime/${id}/full`);
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
async function getAnimeImages(id) {
  return apiFetch(`/anime/${id}/pictures`);
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