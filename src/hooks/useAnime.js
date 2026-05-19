/**
 * hooks/useAnime.js
 *
 * Custom hook for fetching anime data used on the Home page.
 *
 * This hook keeps all anime-related fetching in one place.
 *
 * - Fetch top anime (for anime section)
 * - Fetch seasonal anime (for hero banner)
 * - Provide data like popularAnime
 *
 * Changes:
 *  - Wrapped popularAnime in useMemo so it only recomputes when topAnime
 *    actually changes, instead of re-running slice(0, 4) on every render
*/

import { useState, useEffect, useMemo } from "react";
import { getTopAnime, getSeasonNow } from "../api/Jikan";

export function useAnime() {
  const [topAnime, setTopAnime] = useState([]);
  const [currentSeasonAnime, setCurrentSeasonAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    // track when the component first appears on the screen
    let isMounted = true;

    // waits for all requests so one failed endpoint doesn't crash everything
    Promise.allSettled([
      getTopAnime(25),
      getSeasonNow(15),
    ]).then(([topResult, seasonResult]) => {
      // prevent update after unmount
      if (!isMounted) return;

      if (topResult.status === "fulfilled") {
        setTopAnime(topResult.value ?? []);
      } else {
        // Don't crash - just log. The UI will show empty
        console.warn("Top anime fetch failed:", topResult.reason);
      }

      if (seasonResult.status === "fulfilled") {
        setCurrentSeasonAnime(seasonResult.value ?? []);
      } else {
        console.warn("Seasonal anime fetch failed:", seasonResult.reason);
      }

      // Only set a visible error if top anime failed
      if (topResult.status === "rejected") {
        setError(topResult.reason?.message ?? "Failed to load anime");
      }
    }).finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => {
      // runs on unmount (component removed from UI)
      isMounted = false;
    };
  }, []);

  // Gets the top 4 anime
  const popularAnime = useMemo(() => topAnime.slice(0, 4), [topAnime]);

  return {
    topAnime,
    currentSeasonAnime,
    popularAnime,
    loading,
    error,
  };
}