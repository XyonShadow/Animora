/**
 * The right sidebar column - just renders skeleton placeholders
 */

import { Search, MoreHorizontal, Star } from "lucide-react";
import { getImageUrl, formatScore } from "../../api/Jikan.js";

/* ----------------- ListItem: one row in Popular or Watchlist sections ----------------- */
function ListItem({ anime, onSelect }) {
  return (
    <button
      onClick={() => onSelect?.(anime)}
      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-surface-3 transition-colors text-left"
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
        <p className="text-text-faint text-xs mt-0.5">
          Season 1 / Series {anime.episodes ?? "?"}
        </p>

        {/* Score badge */}
        <span className="inline-flex items-center gap-0.5 text-brand text-xs font-bold mt-1">
          {formatScore(anime.score)} <Star className="inline-flex items-center justify-center fill-current w-4 h-4 -mt-1"/>
        </span>
      </div>
    </button>
  );
}

/* ----------------- Render placeholders while data is loading ----------------- */
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

/* ----------------- PanelSection: titled list with a "See More" button ----------------- */
function PanelSection({ title, items, loading, onSelect, onSeeMore }) {
  return (
    <div className="mb-6">
      {/* Section header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="font-display text-sm font-semibold text-text-primary">{title}</h3>

        {/* More Icon */}
        {/* TODO: Add Button functionality */}
        <button className="text-text-faint hover:text-text-muted transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Items */}
      <div className="space-y-1">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <ListItemSkeleton key={i} />)
          : items.map((anime) => (
              <ListItem key={anime.mal_id} anime={anime} onSelect={onSelect} />
            ))}
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

/* ----------------- RightPanel ----------------- */
// props is passed from App.jsx
export function RightPanel({ popularAnime = [], watchlist = [], loading, onSearch, onSelect }) {
  return (
    <aside className="w-64 flex-shrink-0 h-screen sticky top-0 bg-surface-2 px-4 py-6 overflow-y-auto">

      {/* Search bar - TODO: Add functional Logic */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-faint" />
        <input
          type="text"
          placeholder="Type to Search..."
          onChange={(e) => onSearch?.(e.target.value)}
          className="w-full bg-surface-3 rounded-lg pl-9 pr-4 py-2 text-xs text-text-primary
            placeholder:text-text-faint border border-transparent focus:border-brand/40 outline-none
            transition-colors"
        />
      </div>

      {/* For Popular Animes */}
      <PanelSection
        title="Popular Animes"
        items={popularAnime}
        loading={loading}
        onSelect={onSelect}
      />

      {/* For Watchlists */}
      <PanelSection
        title="Watchlists"
        items={watchlist}
        loading={loading}
        onSelect={onSelect}
      />
    </aside>
  );
} 