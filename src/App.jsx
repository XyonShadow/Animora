/**
 * App.jsx
 * Changes:
 *  - Introduced selectedMalId state to control detail view rendering
 *  - Updated Home → AnimeDetail navigation via handleSelectAnime
 *  - Added back navigation to return to Home view
 */

import { useState } from "react";

import { Sidebar } from "./components/layout/Sidebar";
import { TopNav } from "./components/layout/TopNav";
import { RightPanel } from "./components/layout/Rightpanel";

import { Home } from "./pages/Home";
import { AnimeDetail } from "./pages/Animedetail";

import { useAnime } from "./hooks/useAnime";

export default function App() {
  // Which sidebar item is active
  const [activePage, setActivePage] = useState("home");

  // Which top nav tab is active (Movie / Serials)
  const [activeTab, setActiveTab] = useState("series");
  
  // Shared anime data for Home + RightPanel
  const animeData = useAnime();

  // null = show Home; a MAL id number = show that anime's detail page
  const [selectedMalId, setSelectedMalId] = useState(null);

  /* Navigate to a detail page */
  function handleSelectAnime(anime) {
    setSelectedMalId(anime.mal_id);
  }

  /* Go back to whatever was showing before detail */
  function handleBack() {
    setSelectedMalId(null);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-bg">

      {/* Left: Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={(page) => {
          setActivePage(page);
          setSelectedMalId(null); // clear detail when navigating sidebar
        }}
      />

      {/* Center: Main content area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <TopNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">

          {/* Detail page takes priority over everything else */}
          {selectedMalId !== null ? (
            <AnimeDetail
              malId={selectedMalId}
              onBack={handleBack}
            />

          ) : activePage === "home" ? (
            <Home
              topAnime={animeData.topAnime}
              currentSeasonAnime={animeData.currentSeasonAnime}
              loading={animeData.loading}
              error={animeData.error}
              onSelect={handleSelectAnime}
            />

          ) : (
            <div className="flex items-center justify-center h-full text-text-faint text-sm">
              {/* Capitalize first letter */}
              {activePage.charAt(0).toUpperCase() + activePage.slice(1)} - Coming soon
            </div>
          )}
        </div>
      </main>

      {/* Right panel: Search + Popular + Watchlist */}
      <RightPanel
        popularAnime={animeData.popularAnime}
        watchlist={[]}
        loading={animeData.loading}
        onSearch={(query) => console.log("Search:", query)}
        onSelect={(anime) => console.log("Selected:", anime.title)}
        onSelect={handleSelectAnime}
      />
    </div>
  );
}