import { useState } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { TopNav } from "./components/layout/TopNav";
import { RightPanel } from "./components/layout/Rightpanel";
import { Home } from "./pages/Home";

export default function App() {
  // Which sidebar item is active
  const [activePage, setActivePage] = useState("home");

  // Which top nav tab is active (Movie / Series)
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
          <Home />
        </div>
      </main>

      {/* Right panel */}
      <RightPanel />
    </div>
  );
}