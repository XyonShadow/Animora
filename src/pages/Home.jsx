/**
 * Now renders the layout: HeroBanner + AnimeCarousel (main content)
 * Replaced AnimeGrid layout with AnimeSection component for reusable horizontal anime rows
 * Added HeroBanner as the main featured anime display
 * Removed centralized LoadingGrid approach 
 * Implemented skeleton loading inside HeroBanner and AnimeSection
 * Passed error state down to components instead of blocking full page
 */

import { useState, useEffect } from "react";
import { getTopAnime } from "../api/Jikan";
import { ErrorMessage } from "../components/anime/Errormessage";
import { HeroBanner }    from "../components/layout/HeroBanner";
import { AnimeSection } from "../components/anime/AnimeSection";

export function Home() {
  // Stores fetched anime list
  const [anime, setAnime] = useState([]);

  // Tracks loading state while fetching data
  const [loading, setLoading] = useState(true);

  // Stores any API error messages
  const [error, setError] = useState(null);

  /* --------- DATA FETCHING --------- */
  useEffect(() => {
    // Fetch top anime from API
    getTopAnime(25)
      .then((data) => {
        // Set fetched anime data
        setAnime(data ?? []); // [] for incase API returns undefined

        // Stop loading once data is received
        setLoading(false);
      })
      .catch((err) => {
        // Store error message for UI display
        setError(err.message);

        // Stop loading even if request fails
        setLoading(false);
      });
  }, []); // Runs on Component Mount

  // Use first anime as the hero feature
  const featuredAnime = anime[0] ?? null;

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
        items={anime.slice(0, 10)}
        loading={loading}
        error={error}
        onSelect={(anime) => console.log("Selected:", anime.title)} // TODO: navigate to detail
      />

      {/* Soon Add Section - For now, just takes the ones after first 5 */}
      <AnimeSection
        title="Soon Add"
        items={anime.slice(10)}
        loading={loading}
        error={error}
        onSelect={(anime) => console.log("Selected:", anime.title)}
      />
    </div>
  );
}