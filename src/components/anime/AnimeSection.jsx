/**
 * Replaced AnimeGrid with this
 * A horizontal scrollable row of anime cards with a section title..
 * Used for the "Top Rated Animes" and "Soon Add" sections
 */

import { AnimeCard } from "./AnimeCard";

/* Placeholder row - shown while loading */
function CarouselSkeleton() {
  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-36 rounded-card overflow-hidden bg-surface">
          <div className="skeleton h-48 w-full" />
          <div className="p-2 space-y-2">
            <div className="skeleton h-3 rounded w-4/5" />
            <div className="skeleton h-2 rounded w-2/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AnimeSection({ title, items, loading, error, onSelect }) {
  return (
    <section>
      {/* Section Title */}
      <h3 className="font-display text-sm font-semibold text-text-primary mb-3">
        {title}
      </h3>

      { (loading || !items.length || error) ? (
        <CarouselSkeleton />
      ) : (
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">

          {/* Render each anime card in a horizontal scroll row */}
          {items.map((anime) => (
            <div
              key={anime.mal_id}
              className="flex-shrink-0 w-36"

              // Trigger parent callback when an item is clicked
              onClick={() => onSelect?.(anime)}
            >
              <AnimeCard item={anime} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}