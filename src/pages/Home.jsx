/**
 * added hero banner auto-rotation using setInterval
 * implemented looping hero index for seasonal anime list
 * improved hero banner state management and rotation behavior
 */

import { ErrorMessage } from "../components/anime/Errormessage";
import { HeroBanner }    from "../components/layout/HeroBanner";
import { AnimeSection } from "../components/anime/AnimeSection";
import { useEffect, useState } from "react";

export function Home({topAnime, currentSeasonAnime, loading, error}) {

  // Tracks which seasonal anime is currently displayed in the hero banner
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    // Stop if no seasonal anime exists
    if (!currentSeasonAnime.length) return;

    const interval = setInterval(() => {
      // Loop back to the start when reaching the end of the array
      setHeroIndex((prev) => (prev + 1) % currentSeasonAnime.length);
    }, 9000); // Rotate every 9 seconds

    // Clear interval on unmount or when anime list changes
    return () => clearInterval(interval);
  }, [currentSeasonAnime.length]);

  // Current featured anime (fallback to top anime if seasonal data is unavailable)
  const featuredAnime = currentSeasonAnime[heroIndex] ?? topAnime[0] ?? null;

  /* --------- RENDER: SUCCESS STATE --------- */
  return (
      <div className="flex flex-col gap-6 px-6 py-4 pb-8">

        {/* RENDER: ERROR STATE */}
        {error && (
          <div className="mb-2">
            <ErrorMessage error={error} />
          </div>
        )}

      {/* Hero banner - rotates through seasonalAnime every 6s */}
      <HeroBanner 
        anime={featuredAnime}
        loading={loading}
        error={error}
      />

      {/* Top Rated Section */}
      <AnimeSection
        title="Top Rated Animes"
        items={topAnime.slice(0, 10)}
        loading={loading}
        error={error}
        onSelect={(anime) => console.log("Selected:", anime.title)} // TODO: navigate to detail
      />

      {/* Currently Airing Section */}
      <AnimeSection
        title="Currently Airing"
        items={currentSeasonAnime.length ? currentSeasonAnime.slice(0, 10) : topAnime.slice(10)}
        loading={loading}
        error={error}
        onSelect={(anime) => console.log("Selected:", anime.title)}
      />
    </div>
  );
}