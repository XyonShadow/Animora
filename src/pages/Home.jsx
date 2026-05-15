/**
 * Removed anime data fetching from Home component.
 * Data (topAnime, loading, error) is now passed from App via props.
 * Changed Soon Add to Currently Airing
 */

import { ErrorMessage } from "../components/anime/Errormessage";
import { HeroBanner }    from "../components/layout/HeroBanner";
import { AnimeSection } from "../components/anime/AnimeSection";

export function Home({topAnime, currentSeasonAnime, loading, error}) {

  // Use first anime as the hero feature
  const featuredAnime = topAnime[0] ?? null;

  /* --------- RENDER: SUCCESS STATE --------- */
  return (
      <div className="flex flex-col gap-6 px-6 py-4 pb-8">

        {/* RENDER: ERROR STATE */}
        {error && (
          <div className="mb-2">
            <ErrorMessage error={error} />
          </div>
        )}

      {/* Hero banner - shows first top-rated anime */}
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