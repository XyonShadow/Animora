import { AnimeCard } from "./AnimeCard";

export function AnimeGrid({ anime }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Render anime cards */}
      {anime.map((item) => (
        <AnimeCard key={item.mal_id} item={item} />
      ))}
    </div>
  );
}