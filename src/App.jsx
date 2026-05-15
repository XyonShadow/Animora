import { useState } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { TopNav } from "./components/layout/TopNav";
import { RightPanel } from "./components/layout/Rightpanel";
import { Home } from "./pages/Home";

export default function App() {
  // Which sidebar item is active
  const [activePage, setActivePage] = useState("home");

  // Which top nav tab is active (Movie / Serials)
  const [activeTab, setActiveTab] = useState("series");

  return (
    <div className="flex h-screen overflow-hidden bg-bg">

      {/* Left: Sidebar navigation */}
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      {/* Center: Main content area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <TopNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">

          {/* basic page switching with fallback placeholder for unbuilt routes */}
          {activePage === "home" && <Home />}

          {/* TODO: add other pages here */}
          {activePage !== "home" && (
            <div className="flex items-center justify-center h-full text-text-faint text-sm">

              {/* capitalizes first letter */}
              {activePage.charAt(0).toUpperCase() + activePage.slice(1)} - coming soon

            </div>
          )}
        </div>
      </main>

      {/* Right panel: Search + Popular + Watchlist */}
      {/* TODO : Pass real data here */}
      <RightPanel
        popularAnime={[]}
        watchlist={[]}
        loading={false}
        onSearch={(query) => console.log("Search:", query)}
        onSelect={(anime) => console.log("Selected:", anime.title)}
      />
    </div>
  );
}