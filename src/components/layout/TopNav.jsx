/**
 * The top navigation bar above the hero/main content area.
 */

import { Download, User } from "lucide-react";

// Top navigation tabs
const TABS = [
  { key: "movies",  label: "Movie" },
  { key: "series", label: "Series" },
];

// props is passed from App.jsx
// TODO - Add actual switching logic
export function TopNav({ activeTab, onTabChange }) {
  return (
    <nav className="flex items-center justify-between px-6 py-4">

      {/* Tab switchers */}
      <div className="flex items-center gap-6">

        {/* Render each tab button from config */}
        {TABS.map(({ key, label }) => {
          const isActive = activeTab === key;

          return (
            <button
              key={key}
              onClick={() => onTabChange(key)}
              className={`
                relative text-sm font-medium pb-1 transition-colors duration-150
                ${isActive ? "text-text-primary" : "text-text-faint hover:text-text-muted"}
              `}
            >
              {label}
              {/* Underline indicator for active tab */}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Action buttons (right side) */}
      <div className="flex items-center gap-3">

        {/* Download button */}
        <button className="w-8 h-8 rounded-full bg-surface-3 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors">
          <Download className="w-4 h-4" />
        </button>

        {/* User/profile button */}
        <button className="w-8 h-8 rounded-full bg-surface-3 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors">
          <User className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}