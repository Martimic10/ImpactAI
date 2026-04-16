"use client";

import { GolfFlagIcon, SearchPlusIcon, ActivityIcon, UserIcon } from "@/components/icons";

type Tab = "analyze" | "history" | "profile";

interface DesktopSidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: "analyze",
    label: "Analyze",
    icon: <SearchPlusIcon size={20} />,
  },
  {
    id: "history",
    label: "History",
    icon: <ActivityIcon size={20} />,
  },
  {
    id: "profile",
    label: "Profile",
    icon: <UserIcon size={20} />,
  },
];

export function DesktopSidebar({ activeTab, onTabChange }: DesktopSidebarProps) {
  return (
    <aside
      className="hidden md:flex flex-col shrink-0 h-full"
      style={{ width: "240px", background: "#FFFFFF", borderRight: "1px solid #E5E7EB" }}
    >
      {/* Logo */}
      <div className="px-6 py-6 mb-2">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #1B5E20, #2E7D32)" }}
          >
            <GolfFlagIcon size={18} stroke="#FFFFFF" strokeWidth={2} />
          </div>
          <div>
            <p className="font-extrabold text-base leading-none" style={{ color: "#111111", letterSpacing: "-0.03em" }}>
              ImpactAI
            </p>
            <p className="text-[10px] font-medium mt-0.5" style={{ color: "#9CA3AF" }}>Golf Coach</p>
          </div>
        </div>
      </div>

      {/* Section label */}
      <p className="px-6 text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#9CA3AF" }}>
        Navigation
      </p>

      {/* Nav items */}
      <nav className="px-3 flex flex-col gap-1">
        {navItems.map((item) => {
          const active = item.id === activeTab;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150"
              style={{
                background: active ? "#F1F8E9" : "transparent",
                color: active ? "#1B5E20" : "#9CA3AF",
              }}
            >
              {item.icon}
              <span className="text-sm font-semibold" style={{ color: active ? "#1B5E20" : "#6B7280" }}>{item.label}</span>
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "#1B5E20" }} />
              )}
            </button>
          );
        })}
      </nav>

      <div className="flex-1" />

      {/* Footer status */}
      <div className="px-6 py-6">
        <div className="rounded-2xl p-4" style={{ background: "#F1F8E9", border: "1px solid #C8E6C9" }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#2E7D32" }} />
            <p className="text-xs font-semibold" style={{ color: "#1B5E20" }}>AI Coach Online</p>
          </div>
          <p className="text-[11px] leading-snug" style={{ color: "#4CAF50" }}>
            Ready to analyze your swing in seconds.
          </p>
        </div>
      </div>
    </aside>
  );
}
