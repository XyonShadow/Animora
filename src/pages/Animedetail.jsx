/**
 * pages/AnimeDetail.jsx
 *
 * Displays full details for a selected anime.
 *
 * Flow:
 *  - Parent passes malId when user selects an anime
 *  - Component fetches anime details from Jikan API
 *  - Handles loading, error, and success states
 *  - Renders anime information (stats, genres, synopsis, trailer)
 *
 * Includes:
 *  - Loading skeleton UI
 *  - Error handling
 *  - Safe async data fetching
 *  - Derived data formatting (genres, studios)
 */

import { useState, useEffect } from "react";
import { ArrowLeft, Star, Tv, Film } from "lucide-react";
import { getAnimeById, getImageUrl, formatScore } from "../api/Jikan";

// Placeholder while anime details are loading.
function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-6 px-6 py-4 pb-8 animate-pulse">

      {/* Back button placeholder */}
      <div className="skeleton h-8 w-24 rounded-lg" />

      <div className="flex flex-col md:flex-row gap-6">

        {/* Poster placeholder */}
        <div className="skeleton w-44 h-64 rounded-card flex-shrink-0" />

        {/* Text/content placeholders */}
        <div className="flex-1 space-y-3 pt-2">

          {/* Title */}
          <div className="skeleton h-7 w-3/4 rounded" />

          {/* Subtitle */}
          <div className="skeleton h-4 w-1/3 rounded" />

          {/* Genre pills */}
          <div className="flex gap-2">
            {[1, 2, 3].map((placeholderIndex) => (
              <div
                key={placeholderIndex}
                className="skeleton h-6 w-16 rounded-full"
              />
            ))}
          </div>

          {/* Synopsis lines */}
          <div className="space-y-2 pt-2">
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-3 w-4/5 rounded" />
          </div>

        </div>
      </div>
    </div>
  );
}

// Stat display component
function StatBadge({ label, value }) {
  return (
    <div className="flex flex-col items-center bg-surface-3 rounded-lg px-4 py-2 min-w-[64px]">

      {/* Small label text */}
      <span className="text-text-faint text-xs mb-0.5">
        {label}
      </span>

      {/* Actual value */}
      <span className="text-text-primary text-sm font-semibold font-display">
        {value ?? "?"}
      </span>

    </div>
  );
}

// Main Anime Detail Component
export function AnimeDetail({ malId, onBack }) {

  // Stores fetched anime data
  const [anime, setAnime] = useState(null);

  // Tracks loading state.
  const [loading, setLoading] = useState(true);

  // Stores error message if request fails
  const [error, setError] = useState(null);

  /* ---------------- Data Fetching ---------------- */

  useEffect(() => {

    // Prevents state updates after component unmounts
    let isMounted = true;

    async function loadAnimeDetails() {
      try{

        // Reset state when malId changes
        setAnime(null);
        setLoading(true);
        setError(null);

        // Fetch anime details from API
        const animeData = await getAnimeById(malId);

        /* Stop if component already unmounted */
        if (!isMounted) return;

        // Store fetched data
        setAnime(animeData);

      } catch (fetchError) {

        // Stop if component already unmounted
        if(!isMounted) return;

        // Store error message
        setError(fetchError.message || "Failed to load anime details.");
        
      } finally {

        // Stop loading
        if (isMounted) setLoading(false);
      }
    }

    /* Run fetch */
    loadAnimeDetails();

    // Runs when component unmounts or dependency changes
    return () => {
      isMounted = false;
    };
    
  }, [malId]);

  // Returns early for loading state
  if (loading) return <DetailSkeleton />;

  // Returns early for error state
  if (error) {
  return (
    <div className="px-6 py-4">

      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-text-muted hover:text-text-primary text-sm mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Error message */}
      <div className="bg-brand/10 border border-brand/30 text-brand rounded-card p-4 text-sm">
        Failed to load anime details: {error}
      </div>

    </div>
    );
  }

  /* ---------------- Derived Data ---------------- */

  // Convert genre objects into simple string array
  const genres = anime.genres?.map((g) => g.name) ?? [];

  // Combine studio names into one readable string
  const studios = anime.studios?.map((s) => s.name).join(", ") ?? "Unknown";

  /* ---------------- Main Render ---------------- */
  return (
    <div className="flex flex-col gap-6 px-6 py-4 pb-8">

      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-text-muted hover:text-text-primary text-sm transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Hero Section */}
      <div className="flex md:flex-row gap-6">

        {/* ---------------- Poster ---------------- */}
        <img
          loading="lazy"
          src={getImageUrl(anime)}
          alt={anime.title}
          className="w-44 h-64 object-cover rounded-card flex-shrink-0 shadow-lg"
        />

        {/* ---------------- Main Info ---------------- */}
        <div className="flex-1 min-w-0 pt-1">

          {/* Title */}
          <h1 className="font-display text-2xl font-bold text-text-primary mb-1 leading-tight">
            {anime.title}
          </h1>

          {/* Japanese title */}
          {anime.title_japanese && (
            <p className="text-text-faint text-sm mb-3">{anime.title_japanese}</p>
          )}

          {/* Score + type row */}
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center gap-1 text-brand font-bold text-lg font-display">
              <Star className="w-5 h-5 fill-current" />
              {formatScore(anime.score)}
            </span>
            <span className="text-text-faint text-sm">
              {anime.scored_by?.toLocaleString()} ratings
            </span>
            <span className="flex items-center gap-1 text-text-muted text-sm">
              {anime.type === "Movie" ? <Film className="w-4 h-4" /> : <Tv className="w-4 h-4" />}
              {anime.type}
            </span>
          </div>

          {/* ---------------- Stats row ---------------- */}
          <div className="flex gap-2 flex-wrap mb-4">
            <StatBadge label="Episodes" value={anime.episodes ?? "?"} />
            <StatBadge label="Status" value={anime.status?.split(" ")[0]} />
            <StatBadge label="Rank" value={anime.rank ? `#${anime.rank}` : "?"} />
            <StatBadge label="Year" value={anime.year ?? anime.aired?.prop?.from?.year} />
          </div>

          {/* ---------------- Genre tags ---------------- */}
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">

              {genres.map((genreName) => (
                <span
                  key={genreName}
                  className="text-xs text-text-primary bg-surface-3 rounded-full px-3 py-0.5 border border-white/10"
                >
                  {genreName}
                </span>
              ))}

            </div>
          )}

          {/* Studio names */}
          <p className="text-text-faint text-xs">Studio: <span className="text-text-muted">{studios}</span></p>
        </div>
      </div>

      {/* TODO: Make watchlist functional */}
      {/* ---------------- Watchlist button ---------------- */}
      <button
        onClick={() => (anime) => console.log("Selected:", anime.title)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium w-fit transition-colors 
          bg-surface-3 text-text-muted border border-white/10 hover:text-text-primary hover:bg-surface-2"
      >
        "Add to Watchlist"
      </button>

      {/* ---------------- Synopsis ---------------- */}
      <div>

        <h2 className="font-display text-sm font-semibold text-text-primary mb-2">Synopsis</h2>

        <p className="text-text-muted text-sm leading-relaxed line-clamp-7">
          {anime.synopsis ?? "No synopsis available."}
        </p>

      </div>

      {/* ---------------- Trailer ---------------- */}
      {anime.trailer?.embed_url && (
        <div>

          <h2 className="font-display text-sm font-semibold text-text-primary mb-2">Trailer</h2>

          <div className="rounded-card overflow-hidden aspect-video max-w-xl">
            <iframe
              src={anime.trailer.embed_url}
              title={`${anime.title} trailer`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

        </div>
      )}
    </div>
  );
}