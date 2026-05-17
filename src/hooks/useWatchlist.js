/**
 * hooks/useWatchlist.js
 *
 * Handles anime watchlist
 *  - Add anime (prevents duplicates)
 *  - Remove anime by ID
 *  - Toggle watchlist state
 *  - Check if anime exists in watchlist
 *  - Persistent storage using localStorage
 */

import { useState, useEffect } from "react";

// Unique key used to store and retrieve watchlist data from localStorage
const STORAGE_KEY = "animora_watchlist";

// Reads and parses watchlist data from localStorage safely.
function readFromStorage() {
  try {
    const storedWatchlist = localStorage.getItem(STORAGE_KEY);
    return storedWatchlist ? JSON.parse(storedWatchlist) : [];
  } catch (error) {
    console.warn("Invalid watchlist data in localStorage", error);
    return []; // Returns an empty array if no data exists or data is corrupted or invalid JSON
  }
}

export function useWatchlist() {
  // initialized lazily to load watchlist efficiently on app mount and avoid unnecessary localStorage reads on every render
  const [watchlist, setWatchlist] = useState(() => readFromStorage());

  // Persist watchlist to localStorage whenever it changes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
    } catch (error) {
      // Handles quota exceeded or storage failures gracefully
      console.warn("Could not save watchlist to localStorage", error);
    }
  }, [watchlist]);

  // Adds an anime to the watchlist
  function addToWatchlist(anime) {
    setWatchlist((previousWatchlist) => {
      // Check whether any anime in the watchlist has this MAL ID
      const alreadyExists = previousWatchlist.some((item) => item.mal_id === anime.mal_id);

      // Prevents duplicates using mal_id comparison
      if (alreadyExists) return previousWatchlist;

      return [...previousWatchlist, anime];
    });
  }

  // Removes an anime from the watchlist using its MAL ID.
  function removeFromWatchlist(malId) {
    setWatchlist((previousWatchlist) => previousWatchlist.filter((item) => item.mal_id !== malId));
  }

  // Toggles anime in the watchlist
  function toggleWatchlist(anime) {
    setWatchlist((previousWatchlist) => {
      // Check whether any anime in the watchlist has this MAL ID
      const exists = previousWatchlist.some((item) => item.mal_id === anime.mal_id);

      // Adds if not present, removes if already present
      return exists ? previousWatchlist.filter((item) => item.mal_id !== anime.mal_id): [...previousWatchlist, anime];
    });
  }

  // Checks whether an anime exists in the watchlist.
  function isInWatchlist(malId) {
    return watchlist.some((item) => item.mal_id === malId);
  }

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    isInWatchlist,
  };
}