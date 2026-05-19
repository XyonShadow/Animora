/**
 * pages/Home.jsx
 * 
 * Changes:
 *  - Removed entire Herro Banner's auto-rotation state and interval logic from this component
 *  - HeroBanner now receives the full anime array instead of a single anime item
 *  - Updated Hero Banner data to use seasonal anime, if unavailable, use the first 10 top-rated anime
 */

import { ErrorMessage } from "../components/anime/Errormessage";
import { HeroBanner } from "../components/layout/HeroBanner";
import { AnimeSection } from "../components/anime/AnimeSection";

export function Home({ topAnime, currentSeasonAnime, loading, error, onSelect }) {
  
  // for the Hero Banner data 
  const featuredAnimeList = loading ? [] : (currentSeasonAnime.length ? currentSeasonAnime : topAnime.slice(0, 10));

  return (
    <div className="flex flex-col gap-6 px-6 py-4 pb-8">

      {/* RENDER: ERROR STATE */}
      {error && !topAnime.length && (
        <div className="mb-2">
          <ErrorMessage error={error} />
        </div>
      )}

      {/* Hero Carousel Banner */}
      <HeroBanner
        animeList={featuredAnimeList}
        loading={loading}
        error={error}
        onSelect={onSelect}
      />

      {/* Top Rated Section */}
      <AnimeSection
        title="Top Rated Animes"
        items={topAnime.slice(0, 10)}
        loading={loading}
        error={error}
        onSelect={onSelect}
      />

      {/* Currently Airing Section */}
      <AnimeSection
        title="Currently Airing"
        items={currentSeasonAnime.length ? currentSeasonAnime.slice(0, 10) : topAnime.slice(10)}
        loading={loading}
        error={error}
        onSelect={onSelect}
      />

    </div>
  );
}