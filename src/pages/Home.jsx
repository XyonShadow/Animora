import { useState, useEffect } from "react";
import { getTopAnime } from "../api/Jikan";
import { LoadingGrid } from "../components/anime/LoadingGrid";
import { ErrorMessage } from "../components/anime/Errormessage";
import { AnimeGrid } from "../components/anime/AnimeGrid";

export const Home = () => {

  // Stores fetched anime list
  const [anime, setAnime] = useState([]);

  // Tracks loading state while fetching data
  const [loading, setLoading] = useState(true);

  // Stores any API error messages
  const [error, setError] = useState(null);

  /* --------- DATA FETCHING --------- */
  useEffect(() => {
    // Fetch top 6 anime from API
    getTopAnime(6)
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

  /* --------- RENDER: LOADING STATE --------- */
  if (loading) return <LoadingGrid />;

  /* --------- RENDER: ERROR STATE --------- */
  if (error) return <ErrorMessage error={error} />;

  /* --------- RENDER: SUCCESS STATE --------- */
  return <AnimeGrid anime={anime} />
};