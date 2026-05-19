/**
 * pages/BrowsePage.jsx
 *
 * This page displays a list of either Movies or TV Series
 * It is reused for both routes:
 *  - /movies -> shows Movie data
 *  - /series -> shows TV Series data
 *
 * Props:
 * - type: "Movie" | "TV"
 *   Determines what content to fetch and display
 *
 * - onSelect(anime):
 *   Called when a user clicks on an item
 *   Usually used to navigate to a detail page
 *
 * Data fetching strategy:
 *  Use server-side filtering via the API (?type=movie or ?type=tv).
 *
 * Changes:
 *  - Fixed Load More bug: separated initial loading from pagination loading.
 *    "Load More" now uses a dedicated loadingMore state instead of the main loading state,
 *    preventing unnecessary UI resets and keeping the grid stable while fetching more items
 */

import { useState, useEffect } from "react";
import { Film, Tv } from "lucide-react";
import { getTopAnime } from "../api/Jikan";
import { AnimeCard } from "../components/anime/AnimeCard";

// Skeleton shown during initial page load only
function BrowseSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} className="rounded-card overflow-hidden bg-surface">
          <div className="skeleton h-52 w-full" />
          <div className="p-3 space-y-2">
            <div className="skeleton h-3 rounded w-4/5" />
            <div className="skeleton h-2 rounded w-2/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function BrowsePage({ type, onSelect }) {
  // Stores the list of anime/items fetched from the API
  const [items, setItems] = useState([]);

  // Controls initial page load skeleton (true until first fetch completes)
  const [loading, setLoading] = useState(true);

  // Controls the Load More button state only — does NOT affect the grid visibility
  const [loadingMore, setLoadingMore] = useState(false);

  // Stores API error messages if request fails
  const [error, setError] = useState(null);

  // Tracks current page for pagination ("Load More")
  const [page, setPage] = useState(1);

  // Determines if more data is available from the API
  const [hasMore, setHasMore] = useState(true);

  // Determine UI labels and icons based on content type
  const isMovie = type === "Movie";
  const Icon = isMovie ? Film : Tv;
  const label = isMovie ? "Movies" : "Series";

  useEffect(() => {
    // Prevent state updates if component unmounts before request finishes
    let isMounted = true;

    // Fetch data from API using server-side filtering
    getTopAnime(20, page, type.toLowerCase())
      .then((data) => {
        if (!isMounted) return;

        // If on first page, replace data. If on next pages, append data.
        setItems((previousItems) =>
          page === 1 ? (data ?? []) : [...previousItems, ...(data ?? [])]
        );

        // If returned data is less than limit, no more pages exist
        setHasMore((data?.length ?? 0) === 20);
      })
      .catch((error) => {
        if (!isMounted) return;

        setError(error.message);
      })
      .finally(() => {
        if (!isMounted) return;
        // Clear both loading states regardless of which triggered this fetch
        setLoading(false);
        setLoadingMore(false);
      });

    // Cleanup function runs when component unmounts
    return () => {
      isMounted = false;
    };
  }, [type, page]);

  return (
    <div className="flex flex-col gap-6 px-6 py-4 pb-8">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-brand/15 rounded-lg flex items-center justify-center">
          <Icon className="w-4 h-4 text-brand" />
        </div>

        <h1 className="font-display text-xl font-bold text-text-primary">
          Top {label}
        </h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-brand/10 border border-brand/30 text-brand rounded-card p-4 text-sm">
          Failed to load {label.toLowerCase()}: {error}
        </div>
      )}

      {/* Initial loading skeleton — only shown before any items exist */}
      {loading && items.length === 0 ? (
        <BrowseSkeleton />
      ) : (
        <>
          {/* Grid of anime/movie cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((anime) => (
              <div
                key={anime.mal_id}
                onClick={() => onSelect(anime)}
                className="cursor-pointer"
              >
                <AnimeCard item={anime} />
              </div>
            ))}
          </div>

          {/* Load More button — uses loadingMore so the grid stays visible */}
          {hasMore && (
            <button
              onClick={() => {
                // Only set loadingMore — never touch the main `loading` state here
                setLoadingMore(true);

                // Move to next page (triggers new fetch)
                setPage((previousPage) => previousPage + 1);
              }}
              disabled={loadingMore}
              className="mx-auto flex items-center gap-2 px-6 py-2.5 rounded-lg bg-surface-3 text-text-muted text-sm font-medium hover:text-text-primary hover:bg-surface-2 transition-colors disabled:opacity-50"
            >
              {loadingMore ? "Loading…" : "Load More"}
            </button>
          )}
        </>
      )}
    </div>
  );
}