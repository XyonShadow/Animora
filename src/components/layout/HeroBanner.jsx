/**
 * Displays the main featured anime - The large featured anime banner
 */

import { Play, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { getImageUrl, formatScore, truncateSynopsis } from "../../api/Jikan.js";

/* Skeleton version shown while data loads */
function HeroBannerSkeleton() {
  return (
    <div className="relative w-full h-72 rounded-card overflow-hidden bg-surface">
      <div className="skeleton absolute inset-0" />
    </div>
  );
}

export function HeroBanner({ anime, loading, error }) {
  // Show loading skeleton if data is still being fetched or anime is missing or if there's an error
  if (loading || !anime || error) return <HeroBannerSkeleton />;

  // Extract image URL for background display
  const imageUrl = getImageUrl(anime);

  // Get up to 3 genre names
  const genres = anime.genres?.slice(0, 3).map((g) => g.name) ?? [];

  return (
    <div className="relative w-full h-72 rounded-card overflow-hidden group">

      {/* Background image layer */}
      <img
        src={imageUrl}
        alt={anime.title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient overlay for better text readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(7,11,20,0.92) 35%, rgba(7,11,20,0.3) 100%), " +
            "linear-gradient(to top, rgba(7,11,20,0.7) 0%, transparent 50%)",
        }}
      />

      {/* Rating badge (top-right corner) */}
      <div className="absolute top-4 right-4 bg-brand text-white text-xs font-bold font-display px-2 py-1 rounded-md flex items-center gap-1">
        {formatScore(anime.score)} <Star className="inline-flex justify-center -mt-0.5 fill-current w-4 h-4" />
      </div>

      {/* Navigation arrows (only visible on hover via group) */}
      <button className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Main content container (text overlay area) */}
      <div className="absolute inset-0 flex flex-col justify-center pl-6 pr-32">

        {/* Anime title */}
        <h2 className="font-display text-2xl font-bold text-white mb-1 drop-shadow">
          {anime.title}
        </h2>

        {/* Season/year or fallback to type + episode info */}
        <p className="text-text-muted text-xs mb-3">
          {anime.season
            ? `${anime.season.charAt(0).toUpperCase() + anime.season.slice(1)} ${anime.year}`
            : anime.type}{" "}
          / {anime.episodes ? `${anime.episodes} Episodes` : "Ongoing"}
        </p>

        {/* Genre tags (only show if available) */}
        {genres.length > 0 && (
          <div className="flex gap-2 mb-3">
            {genres.map((g) => (
              <span
                key={g}
                className="text-xs text-text-primary border border-white/20 rounded-full px-3 py-0.5"
              >
                {g}
              </span>
            ))}
          </div>
        )}

        {/* Shortened synopsis for hero preview */}
        <p className="text-text-muted text-xs leading-relaxed max-w-xs">
          {truncateSynopsis(anime.synopsis, 160)}
        </p>
      </div>

      {/* Center play button) */}
      <button className="absolute right-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-brand flex items-center justify-center shadow-lg hover:bg-brand-dark transition-colors">
        <Play className="w-5 h-5 text-white fill-current ml-0.5" />
      </button>
    </div>
  );
}