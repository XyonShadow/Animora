/**
 * components/layout/Topnav.jsx
 * 
 * The top navigation bar above the hero/main content area.
 *
 * Changes:
 *  - Replaced manual tab state (activeTab + onTabChange props) with React Router <NavLink> for route-based navigation
 *  - Removed prop drilling: TopNav no longer depends on App.jsx state to know active tab
 *  - Navigation state is now controlled by the URL path instead of React state
 *  - Active tab detection is handled automatically using NavLink's isActive
 *  - Tabs now use real routes ("/movies", "/series")
 */

import { Download, User } from "lucide-react";
import { NavLink } from "react-router-dom";

/* Navigation tabs mapped directly to route paths */
const TABS = [
  { path: "/movies", label: "Movie" },
  { path: "/series", label: "Series" },
];

/* Top navigation bar component */
export function TopNav() {
  return (
    <nav className="flex items-center justify-between px-6 py-4">

      {/* Left side: navigation tabs */}
      <div className="flex items-center gap-6">

        {/* Render each tab as a NavLink (route-based navigation) */}
        {TABS.map(({ path, label }) => {
          return (
            <NavLink
              key={path}
              to={path}
              end={path === "/"} // ensures exact match for root route if used
              className={({ isActive }) => `
                nav-link relative text-sm font-medium pb-1 transition-colors duration-150
                ${isActive
                  ? "text-text-primary"
                  : "text-text-faint hover:text-text-muted"
                }
              `}
            >
              {/* NavLink automatically provides isActive based on current route */}
              {({ isActive }) => (
                <>
                  {/* Tab label */}
                  {label}

                  {/* Active underline indicator */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Right side: action buttons */}
      <div className="flex items-center gap-3">

        {/* Download action button */}
        <button className="w-8 h-8 rounded-full bg-surface-3 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors">
          <Download className="w-4 h-4" />
        </button>

        {/* User profile button */}
        <button className="w-8 h-8 rounded-full bg-surface-3 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors">
          <User className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}