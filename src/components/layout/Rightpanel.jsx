/**
 * RightPanel.jsx
 *
 * Changes
 *  - Receives watchlist and removeFromWatchlist from App via props
 *  - Uses removeFromWatchlist for removing items from watchlist section
 *  - Displays watchlist items with dedicated remove button UI
 */

import { Search, MoreHorizontal, Star, Loader2, Dot, X, BookmarkX } from "lucide-react";

import { getImageUrl, formatScore } from "../../api/Jikan.js";
import { useSearch } from "../../hooks/useSearch.js";

/* ----------------------------- List Item ----------------------------- */

// Renders a single anime row item. Used in Popular list, Watchlist, Search results
function ListItem({ anime, onSelect, actionTitle, actionIcon, onAction }) {
  return (
    <div className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-surface-3 transition-colors">

      <button
        onClick={() => onSelect?.(anime)}
        className="flex items-center gap-3 flex-1 min-w-0 text-left"
      >
        {/* Thumbnail */}
        <img
          src={getImageUrl(anime)}
          alt={anime.title}
          className="w-12 h-14 object-cover rounded-md flex-shrink-0"
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-text-primary text-xs font-semibold line-clamp-2 leading-snug">
            {anime.title}
          </p>

          <p className="text-text-faint text-xs mt-0.5 flex items-center gap-1">
            {anime.type}
            <Dot className="w-4 h-4 text-current" />
            {anime.episodes ?? "?"} eps
          </p>

          {/* Score */}
          <span className="inline-flex items-center gap-0.5 text-brand text-xs font-bold mt-1">
            {formatScore(anime.score)}
            <Star className="fill-current w-3 h-3" />
          </span>
        </div>
      </button>

      {/* Remove from watchlist button */}
      {actionIcon && (
        <button
          title={actionTitle}
          aria-label={actionTitle}
          onClick={() => onAction?.(anime)}
          className="text-text-faint hover:text-brand transition-colors flex-shrink-0 p-1"
        >
          {actionIcon}
        </button>
      )}
    </div>
  );
}

/* -------------------------- Skeleton Loader -------------------------- */

// Render placeholders while data is loading
function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-2">
      <div className="skeleton w-12 h-14 rounded-md flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-3 rounded w-4/5" />
        <div className="skeleton h-2 rounded w-3/5" />
        <div className="skeleton h-2 rounded w-2/5" />
      </div>
    </div>
  );
}

/* --------------------------- Panel Section --------------------------- */

// Generic list section used for Popular Anime and Watchlist
function PanelSection({ title, items, loading, onSelect, actionTitle, actionIcon, onAction, onSeeMore,  emptyText }) {
  return (
    <div className="mb-6">

      {/* Section header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="font-display text-sm font-semibold text-text-primary">
          {title}
        </h3>

        {/* More Icon */}
        {/* TODO: Add Button functionality */}
        <button className="text-text-faint hover:text-text-muted transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* List content */}
      <div className="space-y-1">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <ListItemSkeleton key={i} />)
        ) : items.length === 0 ? (
          <p className="text-text-faint text-xs px-2 py-3">{emptyText}</p>
        ) : (
          items.map((anime) => (
            <ListItem
              key={anime.mal_id}
              anime={anime}
              onSelect={onSelect}
              actionTitle={actionTitle}
              actionIcon={actionIcon}
              onAction={onAction}
            />
          ))
        )}
      </div>
      
      {/* See More area*/}
      {!loading && (
        <button
          onClick={onSeeMore}
          className="w-full mt-2 py-2 rounded-lg bg-surface-3 text-text-muted text-xs font-medium hover:text-text-primary hover:bg-surface-2 transition-colors"
        >
          See More
        </button>
      )}
    </div>
  );
}

/* ------------------------- Search Results ------------------------- */
function SearchResults({ results, searching, error, onSelect }) {
  if (searching) {
    return (
    <div className="flex items-center gap-2 px-2 py-3 text-text-faint text-xs">
      <Loader2 className="w-3 h-3 animate-spin" /> Searching…
    </div>
  );
  }

  if (error) {
    return (
      <p className="text-brand text-xs px-2 py-3">
        Search error: {error}
      </p>
    );
  }

  if (results.length === 0) {
    return (
      <p className="text-text-faint text-xs px-2 py-3">
        No results found.
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {results.map((anime) => (
        <ListItem
          key={anime.mal_id}
          anime={anime}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

/* ----------------------------- Right Panel ----------------------------- */
export function RightPanel({
  popularAnime = [],
  watchlist = [],
  loading,
  searchQuery,
  onSearch,
  onSelect,
  removeFromWatchlist,
}) {

  // Handles API fetching, loading state, and errors with search hook
  const { results, searching, searchError } = useSearch(searchQuery);

  // checks for valid query - determines if search UI should be active
  const isSearchMode = searchQuery?.trim().length >= 2;

  return (
    <aside className="w-64 flex-shrink-0 h-screen sticky top-0 bg-surface-2 px-4 py-6 overflow-y-auto">

      {/* ---------------- Search Input ---------------- */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-faint" />

        <input
          type="text"
          placeholder="Type to Search..."
          value={searchQuery}
          onChange={(e) => onSearch?.(e.target.value)}
          className="w-full bg-surface-3 rounded-lg pl-9 pr-4 py-2 text-xs text-text-primary
            placeholder:text-text-faint border border-transparent focus:border-brand/40
            outline-none transition-colors"
        />

        {/* Clear input */}
        {searchQuery && (
          <button
            onClick={() => onSearch?.("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-faint hover:text-text-primary text-xs transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

     </div>
      
      {/* Message for short input */}
      {searchQuery.trim().length === 1 && (
        <div className="px-1 -mt-3 mb-2">
          <p className="text-xs text-text-faint">
            Keep typing to search...
          </p>
        </div>
      )}

      {/* ---------------- Show UI ---------------- */}
      {isSearchMode ? (
        <div>
          <p className="text-text-faint text-xs font-semibold uppercase tracking-widest mb-2 px-1">
            Results
          </p>

          <SearchResults
            results={results}
            searching={searching}
            error={searchError}
            onSelect={onSelect}
          />
        </div>
      ) : (
        <>
          {/* Popular Anime */}
          <PanelSection
            title="Popular Animes"
            items={popularAnime}
            loading={loading}
            onSelect={onSelect}
            emptyText="No popular anime loaded."
          />

          {/* Watchlist */}
          <PanelSection
            title="Watchlist"
            items={watchlist}
            loading={loading}
            onSelect={onSelect}
            actionTitle={"Remove from watchlist"}
            actionIcon={<BookmarkX className="w-4 h-4" />}
            onAction={(anime) => removeFromWatchlist?.(anime.mal_id)}
            emptyText="Your watchlist is empty. Click a card to add."
          />
        </>
      )}
    </aside>
  );
}