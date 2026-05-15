import { Dot, Star } from "lucide-react";
import { getImageUrl, formatScore } from "../../api/Jikan.js";

{/* Anime card */}
export function AnimeCard({ item }) {
  if (!item) return null;
  return (
    <div className="h-full rounded-card bg-surface overflow-hidden hover:bg-surface-3 transition-colors duration-200 flex flex-col">
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
            {formatScore(item.score)} <Star className="inline-flex items-center justify-center fill-current w-4 h-4 -mt-1"/>
          </span>

          <span className="text-text-faint text-xs">
            <Dot className="inline-flex items-center justify-center text-current w-6 h-6 -mt-1"/> {item.type}
          </span>
        </div>
      </div>
    </div>
  );
}