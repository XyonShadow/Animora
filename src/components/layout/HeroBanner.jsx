/**
 * components/layout/HeroBanner.jsx
 * 
 * Displays the main featured anime - The large featured anime banner
 *
 * Changes:
 *  - Prop change: Now accepts an array (animeList) instead of a single anime object
 *  - HeroBanner now handles its own slide index and rotation logic (no longer in Home.jsx)
 *  - Added smoother crossfade transitions to prevent flashing when images/text change
 *  - Made Navigation dots and arrows to be functional 
 *  - Reset the 7.5s auto-slide timer on manual actions (arrows/dots)
 */

import { useState, useEffect, useRef } from "react";
import { Play, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { getImageUrl, formatScore, truncateSynopsis } from "../../api/Jikan.js";

const ROTATION_MS = 7500;
const MAX = 8; // Limits the maximum number of slides

/* Skeleton version shown while data loads */
function HeroBannerSkeleton() {
  return (
    <div className="relative w-full h-72 rounded-card overflow-hidden bg-surface">
      <div className="skeleton absolute inset-0" />
    </div>
  );
}

export function HeroBanner({ animeList = [], loading, error, onSelect }) {
  // Tracks the active slide's index position
  const [currentIndex, setCurrentIndex] = useState(0);

  // Tracks whether the fade animation is currently running
  const [transitioning, setTransitioning] = useState(false);
  
  // Stores the auto-rotation timer ID to clear or reset it anytime
  const intervalRef = useRef(null);

  // Clamp the incoming array data to our maximum slice capacity
  const visibleAnime = animeList.slice(0, MAX);

  // fixes the index if the list shrinks or updates unexpectedly
  const activeIndex = currentIndex >= visibleAnime.length ? 0 : currentIndex;
  
  // Clears any existing timer and starts a fresh auto-rotation countdown
  const startRotationTimer = () => {
    clearInterval(intervalRef.current);
    if (!visibleAnime.length) return;

    intervalRef.current = setInterval(() => {
      // Updates the index
      setCurrentIndex((prev) => {
        const safePrev = prev >= visibleAnime.length ? 0 : prev;
        return (safePrev + 1) % visibleAnime.length;
      });
    }, ROTATION_MS);
  };

  // Starts the auto-rotation timer
  useEffect(() => {
    if (!visibleAnime.length) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const safePrev = prev >= visibleAnime.length ? 0 : prev;
        return (safePrev + 1) % visibleAnime.length;
      });
    }, ROTATION_MS);

    // Cleans up the timer when the component unmounts to prevent memory leaks
    return () => clearInterval(intervalRef.current);
  }, [visibleAnime.length]); // updates when the list size changes

  // Handles changing the slide with a smooth fade transition
  const goTo = (nextIndex) => {
    // Reset the timer on user click
    startRotationTimer();

    setTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(nextIndex);
      
      // Small delay allows React to render the new content before fading it back in
      setTimeout(() => {
        setTransitioning(false);
      }, 50);
    }, 200); // 200ms matches the CSS transition duration
  };

  // Navigates to the next slide, wrapping back around to 0 if at the end
  const goNext = () => {
    if (!visibleAnime.length) return;
    goTo((activeIndex + 1) % visibleAnime.length);
  };

  // Navigates to the previous slide, wrapping around to the end if at 0
  const goPrev = () => {
    if (!visibleAnime.length) return;
    goTo((activeIndex - 1 + visibleAnime.length) % visibleAnime.length);
  };
  
  // Show loading skeleton if data is still being fetched or anime is missing or if there's an error
  if (loading || !visibleAnime.length || error) return <HeroBannerSkeleton />;

  // Get the data for the currently active anime slide
  const anime = visibleAnime[activeIndex];

  // Extract image URL for background display
  const imageUrl = getImageUrl(anime);

  // Get up to 3 genre names
  const genres = anime.genres?.slice(0, 3).map((g) => g.name) ?? [];

  // Set the total number of navigation dots
  const dotCount = visibleAnime.length;

  return (
    <div className="relative w-full h-72 rounded-card overflow-hidden group">

      {/* Background image layer + Transitions */}
      <img
        key={anime.mal_id} // Forces image element to reload when anime selection changes
        src={imageUrl}
        alt={anime.title}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
          transitioning ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(7,11,20,0.92) 35%, rgba(7,11,20,0.3) 100%), " +
            "linear-gradient(to top, rgba(7,11,20,0.8) 0%, transparent 55%)",
        }}
      />

      {/* Rating badge */}
      <div className="absolute top-4 right-4 bg-brand text-white text-xs font-bold font-display px-2 py-1 rounded-md flex items-center gap-1 z-10">
        {formatScore(anime.score)}
        <Star className="fill-current w-3 h-3" />
      </div>

      {/* Navigation arrows (only visible on hover via group) */}
      {/* Previous Button */}
      <button
        onClick={goPrev}
        aria-label="Previous anime"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-brand/80 hover:scale-110 z-10"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Next Button */}
      <button
        onClick={goNext}
        aria-label="Next anime"
        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-brand/80 hover:scale-110 z-10"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Main content container */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
        {Array.from({ length: dotCount }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "bg-brand w-4 h-1.5" // active: wide pill shape
                : "bg-white/40 w-1.5 h-1.5 hover:bg-white/70" // inactive: small circle
            }`}
          />
        ))}
      </div>

      {/* Text Context */}
      <div
        className={`absolute inset-0 flex flex-col justify-center pl-6 pr-36 transition-opacity duration-200 ${
          transitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Anime title */}
        <h2 className="font-display text-2xl font-bold text-white mb-1 drop-shadow leading-tight">
          {anime.title}
        </h2>

        {/* Season/year or fallback to type + episode info */}
        <p className="text-text-muted text-xs mb-3">
          {anime.season ? `${anime.season.charAt(0).toUpperCase() + anime.season.slice(1)} ${anime.year}` : anime.type}
          {" / "} {anime.episodes ? `${anime.episodes} Episodes` : "Ongoing"}
        </p>

        {/* Genre tags (only show if available) */}
        {genres.length > 0 && (
          <div className="flex gap-2 mb-3 flex-wrap">
            {genres.map((genre) => (
              <span key={genre} className="text-xs text-text-primary border border-white/20 rounded-full px-3 py-0.5">
                {genre}
              </span>
            ))}
          </div>
        )}

        {/* Shortened synopsis for hero preview */}
        <p className="text-text-muted text-xs leading-relaxed max-w-xs">
          {truncateSynopsis(anime.synopsis, 160)}
        </p>
      </div>

      {/* Play button -> navigate to detail */}
      <button
        onClick={() => onSelect?.(anime)}
        aria-label={`Watch ${anime.title}`}
        className="absolute right-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-brand flex items-center justify-center shadow-lg hover:bg-brand-dark hover:scale-105 transition-all duration-200 z-10"
      >
        <Play className="w-5 h-5 text-white fill-current ml-0.5" />
      </button>
    </div>
  );
}