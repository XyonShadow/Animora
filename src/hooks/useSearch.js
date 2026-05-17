/**
 * hooks/useSearch.js
 *
 * Handles debounced anime search using the Jikan API.
 *  - Debounced input (400ms delay) to reduce API calls while typing
 *  - Async search execution
 *  - Request cancellation using AbortController to prevent race conditions
 *  - Proper loading state management (searching)
 *  - Error handling for API failures (including AbortError safety)
 *
 * FLOW:
 * user types query
 *   - trim + validate input
 *   -  wait 400ms (debounce)
 *   - cancel previous request (if any)
 *   - trigger API call
 *   - update results / error / loading state
 *
 */

import { useState, useEffect } from "react";
import { searchAnime } from "../api/Jikan";

// Delay before triggering search after user stops typing to prevent API calls on every keystroke
const DEBOUNCE_DELAY_MS = 400;

/* ---------------- Custom hook: useSearch ---------------- */
export function useSearch(query) {

  /* ---------------- State ---------------- */

  // Stores search results from API
  const [results, setResults] = useState([]);

  // Tracks whether a search request is in progress
  const [searching, setSearching] = useState(false);

  // Stores error message if search fails
  const [searchError, setSearchError] = useState(null);

  /* ---------------- Effect ---------------- */
  useEffect(() => {

    // Clean user input and ensure consistent search behavior
    const cleanedQuery = query?.trim();
 
    // Used to cancel previous API requests when user types new query or component unmounts
    const controller = new AbortController();

    // Async function to perform the API call.
    const performSearch = async () => {

       // When query is invalid, reset state and return
      if (!cleanedQuery || cleanedQuery.length < 2) {
        setResults([]);
        setSearching(false);
        setSearchError(null);
        return;
      }

      setSearching(true);
      setSearchError(null);

      try {

        // Call API with search query
        const data = await searchAnime(cleanedQuery, 8, {
          signal: controller.signal,
        });

        // Update results
        setResults(data ?? []);

      } catch (error) {

        // Ignore aborted requests (normal behavior)
        if (error?.name === "AbortError") return;

        // Clear results and show error message
        setResults([]);
        setSearchError(error?.message || "Failed to search anime.");

      } finally {
        // Stop loading state
        setSearching(false);
      }
    };

    // Waits before triggering API call to prevent unnecessary requests while typing.
    const debounceTimer = setTimeout(() => {
      performSearch();
    }, DEBOUNCE_DELAY_MS);

    // Cancels debounce timer and in-flight API request when query changes or component unmounts
    return () => {
      clearTimeout(debounceTimer);
      controller.abort();
    };

  }, [query]);

  /* ---------------- Return Values ---------------- */
  return { results, searching, searchError};
}