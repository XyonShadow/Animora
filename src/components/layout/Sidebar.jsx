/**
 * components/layout/Sidebar.jsx
 *
 * The left navigation column
 * 
 * Changes:
 *  - Replaced manual navigation system (activePage + onNavigate props) with React Router's <NavLink> for route handling
 *  - Removed prop drilling: Sidebar no longer receives activePage or onNavigate from App.jsx
 *  - Navigation state is now handled by the URL itself instead of React state (no more activePage)
 *  - Active link styling is now handled automatically using NavLink's isActive.
 *  - Updated all navigation items from "page keys" (e.g. "movies") to real route paths (e.g. "/movies")
 */

import { NavLink } from "react-router-dom";
import { Home, Users, Mic2, Film, Tv, Clock, Download, Settings, LogOut } from "lucide-react";

/* Each nav item: icon component, label, and the target routing path */
const MenuItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Users, label: "Community", path: "/community" },
  { icon: Mic2, label: "Celebs Speakers", path: "/celebs" },
];

const CategoryItems = [
  { icon: Film, label: "Movie", path: "/movies" },
  { icon: Tv, label: "Series", path: "/series" },
];

const LibraryItems = [
  { icon: Clock, label: "Recent", path: "/recent" },
  { icon: Download, label: "Downloaded", path: "/downloaded" },
];

const GeneralItems = [
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: LogOut, label: "Log Out", path: "/logout" },
];

/* ------------------- NavSection ------------------- */
function NavSection({ title, items }) {
  return (
    <div className="mb-6">
      {/* Section title */}
      <p className="text-text-faint text-xs font-semibold tracking-widest uppercase mb-2 px-3">
        {title}
      </p>

      {/* Render navigation links */}
      {items.map(({ icon: Icon, label, path }) => {
        return (
          <NavLink
            key={path}
            to={path}
            end={path === "/"} // ensures "/" only matches exact home route
            className={({ isActive }) => `
              nav-link w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-150
              ${isActive
                ? "bg-brand/10 text-brand font-semibold"
                : "text-text-muted hover:text-text-primary hover:bg-surface-3"
              }
            `}
          >
            {/* NavLink provides isActive automatically based on current route */}
            {({ isActive }) => (
              <>
                {/* Active indicator bar on the left edge */}
                <span
                  className={`w-0.5 h-4 rounded-full mr-[-4px] ${
                    isActive ? "bg-brand" : "bg-transparent"
                  }`}
                />

                {/* Icon for menu item */}
                <Icon className="w-4 h-4 flex-shrink-0" />

                {/* Label text */}
                <span>{label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </div>
  );
}

/* ------------------- Sidebar ------------------- */
export function Sidebar() {
  return (
    <aside className="w-52 flex-shrink-0 h-screen sticky top-0 bg-surface-2 flex flex-col px-2 py-6 overflow-y-auto">

      {/* Logo */}
      <div className="flex items-center gap-2 px-3 mb-8">
        <div className="w-7 h-7 bg-brand rounded-md flex items-center justify-center">
          <span className="text-white text-xs font-bold font-display">A</span>
        </div>

        <span className="font-display text-base font-bold text-text-primary tracking-wide">
          ANIMORA
        </span>
      </div>

      {/* Nav groups */}
      <NavSection title="Menu" items={MenuItems} />
      <NavSection title="Category" items={CategoryItems} />
      <NavSection title="Library" items={LibraryItems} />

      {/* General items at the bottom */}
      <div className="mt-auto">
        <NavSection title="General" items={GeneralItems} />
      </div>
    </aside>
  );
}