import { getImageUrl, formatScore } from "../../api/Jikan.js";

export function AnimeCard({ anime }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Render anime cards */}
      {anime.map((item) => (
        <div
          key={item.mal_id}
          className="rounded-card bg-surface overflow-hidden hover:bg-surface-3 transition-colors duration-200"
        >
          {/* Anime cover image */}
          <img
            src={getImageUrl(item)}
            alt={item.title}
            className="w-full h-48 object-cover"
          />

          {/* Anime details */}
          <div className="p-3">
            {/* Title (truncated to 2 lines) */}
            <p className="font-display text-sm font-semibold text-text-primary line-clamp-2">
              {item.title}
            </p>

            {/* Score and type metadata */}
            <div className="flex items-center gap-1 mt-1">
              <span className="text-brand text-xs font-bold">
                {formatScore(item.score)} ★
              </span>

              <span className="text-text-faint text-xs">
                • {item.type}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}