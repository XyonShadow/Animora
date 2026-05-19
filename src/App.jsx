/**
 * App.jsx
 *
 * Changes:
 *  - Replaced manual navigation system (activePage + activeTab state) with React Router-based routing system
 *  - Introduced <Routes> and <Route> structure for page rendering
 *  - Removed selectedMalId state (no longer needed for detail navigation)
 *  - AnimeDetail is now rendered via route (/anime/:id) instead of conditional state
 *  - Added fallback route handling using <Navigate /> for unknown routes
 *  - Sidebar and TopNav are now fully router-driven (no props required for navigation state)
 */

import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useState } from "react";

import { Sidebar } from "./components/layout/Sidebar";
import { TopNav } from "./components/layout/TopNav";
import { RightPanel } from "./components/layout/Rightpanel";

import { Home } from "./pages/Home";
import { AnimeDetail } from "./pages/Animedetail";

import { useAnime } from "./hooks/useAnime";
import { useWatchlist } from "./hooks/useWatchlist";

// Simple placeholder component for pages not yet implemented
function ComingSoon({label}) {
  return (
    <div className="flex items-center justify-center h-full text-text-faint text-sm">
      {label} - coming soon
    </div>
  );
}

export default function App() {

  const navigate = useNavigate();

  // Controls search input in RightPanel
  const [searchQuery, setSearchQuery] = useState("");

  // Global anime data (top, seasonal, popular, etc.)
  const { topAnime, currentSeasonAnime, popularAnime, loading, error } = useAnime();

  // Global watchlist state (persistent storage)
  const { watchlist, toggleWatchlist, isInWatchlist, removeFromWatchlist } = useWatchlist();

  // Handles selecting an anime from any list/grid
  function handleSelectAnime(anime) {
    setSearchQuery(""); // clear search when navigating
    // Navigates to detail page using URL instead of local state
    navigate(`/anime/${anime.mal_id}`);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-bg">

      {/* Sidebar navigation is now fully router-driven */}
      <Sidebar />

      {/* Main content area */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Top Navbar */}
        <TopNav />

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          <Routes>

            {/* Home page route */}
            <Route
              path="/"
              element={
                <Home
                  topAnime={topAnime}
                  currentSeasonAnime={currentSeasonAnime}
                  loading={loading}
                  error={error}
                  onSelect={handleSelectAnime}
                />
              }
            />

            {/* Anime detail page (/anime/:id) */}            
            <Route
              path="/anime/:id"
              element={
                <AnimeDetail
                  onBack={() => navigate(-1)} // go back in browser history
                  onToggleWatchlist={toggleWatchlist}
                  isInWatchlist={isInWatchlist}
                />
              }
            />

            {/* Placeholder routes for future features */}
            <Route path="/community" element={<ComingSoon label="Community" />} />
            <Route path="/celebs" element={<ComingSoon label="Celebs Speakers" />} />
            <Route path="/recent" element={<ComingSoon label="Recent" />} />
            <Route path="/downloaded" element={<ComingSoon label="Downloaded" />} />
            <Route path="/settings" element={<ComingSoon label="Settings" />} />

            {/* Fallback route - redirects unknown URLs to home */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </div>
      </main>

      {/* Right panel: Search + Popular + Watchlist */}
      <RightPanel
        popularAnime={popularAnime}
        watchlist={watchlist}
        removeFromWatchlist={removeFromWatchlist}
        loading={loading}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onSelect={handleSelectAnime}
        // Quick navigation shortcuts
        onSeeMorePopular={() => navigate("/series")}
        onSeeMoreWatchlist={() => navigate("/series")} // future: dedicated watchlist page
      />
    </div>
  );
}