/**
 *
 * Central API layer for all Jikan requests
 * The goal is to prevent direct fetch calls inside components
 *
 * Docs: https://docs.api.jikan.moe/
 * Rate limit: ~3 requests/second
 */

const BASE_URL = "https://api.jikan.moe/v4";

/* --------------------------- RATE LIMIT SYSTEM --------------------------- */

let requestQueue = Promise.resolve();
const RATE_DELAY_MS = 400;

/* Ensures API requests run sequentially with delay to prevent exceeding Jikan rate limits */
function rateLimited(fn) {
  requestQueue = requestQueue.then(
    () =>
      new Promise((resolve) => {
        setTimeout(resolve, RATE_DELAY_MS);
      })
  );

  return requestQueue.then(fn);
}

/* --------------------------- CORE API FETCH WRAPPER --------------------------- */

/* Handles all API requests */
async function apiFetch(path, params = {}) {
  return rateLimited(async () => {
    // Construct full URL from base + endpoint path
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
}

/* --------------------------- API FUNCTIONS (ENDPOINT WRAPPERS) --------------------------- */

/* Fetch top-rated anime list */
async function getTopAnime(limit = 10, page = 1) {
  return apiFetch("/top/anime", { limit, page });
}

/* Fetch currently airing seasonal anime */
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

/* Fetch image gallery for anime. */
async function getAnimeImages(id) {
  return apiFetch(`/anime/${id}/pictures`);
}

/* --------------------------- HELPER FUNCTIONS (PURE DATA TRANSFORMS) --------------------------- */

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
  if (!score) return "N/A";  // Returns "N/A" if score is missing
  return Number(score).toFixed(1); 
}

/* Truncates long text at word boundary */
function truncateSynopsis(text, maxLen = 200) {
  if (!text) return "";
  if (text.length <= maxLen) return text;

  return text.slice(0, maxLen).replace(/\s\S*$/, "") + "…";
}

/* EXPORTS */

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