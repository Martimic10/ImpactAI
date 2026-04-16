"use client";

type Tab = "analyze" | "history" | "profile";

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: "analyze",
    label: "Analyze",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="11" y1="8" x2="11" y2="14" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    ),
  },
  {
    id: "history",
    label: "History",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Profile",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      className="flex-shrink-0 flex items-center justify-around px-2 pb-safe"
      style={{
        height: "64px",
        background: "#FFFFFF",
        borderTop: "1px solid #E5E7EB",
        boxShadow: "0 -4px 16px rgba(0,0,0,0.04)",
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full rounded-xl transition-all duration-150 active:scale-95"
            style={{ color: isActive ? "#1B5E20" : "#9CA3AF" }}
          >
            {tab.icon}
            <span
              className="text-xs font-medium"
              style={{ color: isActive ? "#1B5E20" : "#9CA3AF" }}
            >
              {tab.label}
            </span>
            {isActive && (
              <span
                className="absolute bottom-1 w-1 h-1 rounded-full"
                style={{ background: "#1B5E20" }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
