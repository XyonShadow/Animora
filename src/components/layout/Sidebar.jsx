/** 
 * The left navigation column. Purely presentational now - just controls which page is shown.
 */

import { Home, Users, Mic2, Film, Tv, Clock, Download, Settings, LogOut } from "lucide-react";

/* Each nav item: icon component, label, and the page key it maps to */
const MenuItems = [
  { icon: Home, label: "Home", page: "home" },
  { icon: Users, label: "Community", page: "community" },
  { icon: Mic2, label: "Celebs Speakers", page: "celebs" },
];

const CategoryItems = [
  { icon: Film, label: "Movie", page: "movies" },
  { icon: Tv, label: "Series", page: "series" },
];

const LibraryItems = [
  { icon: Clock, label: "Recent", page: "recent" },
  { icon: Download, label: "Downloaded", page: "downloaded" },
];

const GeneralItems = [
  { icon: Settings, label: "Settings", page: "settings" },
  { icon: LogOut, label: "Log Out", page: "logout" },
];

/* ------------------- NavSection ------------------- */
function NavSection({ title, items, activePage, onNavigate }) {
  return (
    <div className="mb-6">
      {/* Section label */}
      <p className="text-text-faint text-xs font-semibold tracking-widest uppercase mb-2 px-3">
        {title}
      </p>

      {items.map(({ icon: Icon, label, page }) => {
        const isActive = activePage === page;

        return (
          <button
            key={page}
            onClick={() => onNavigate(page)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-150
              ${isActive
                ? "bg-brand/10 text-brand font-semibold"
                : "text-text-muted hover:text-text-primary hover:bg-surface-3"
              }
            `}
          >
            {/* Active indicator bar on the left edge */}
            <span className={`w-0.5 h-4 rounded-full mr-[-4px] ${isActive ? "bg-brand" : "bg-transparent"}`} />
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------- Sidebar ------------------- */
// props is passed from App.jsx
export function Sidebar({ activePage, onNavigate }) {
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
      <NavSection title="Menu" items={MenuItems} activePage={activePage} onNavigate={onNavigate} />
      <NavSection title="Category" items={CategoryItems} activePage={activePage} onNavigate={onNavigate} />
      <NavSection title="Library" items={LibraryItems} activePage={activePage} onNavigate={onNavigate} />

      {/* General items at the bottom */}
      <div className="mt-auto">
        <NavSection title="General" items={GeneralItems} activePage={activePage} onNavigate={onNavigate} />
      </div>
    </aside>
  );
}