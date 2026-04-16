"use client";

import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { AnalyzeScreen } from "@/components/analyze/AnalyzeScreen";
import { HistoryScreen } from "@/components/history/HistoryScreen";
import { ProfileScreen } from "@/components/profile/ProfileScreen";
import { useAuth } from "@/lib/auth";
import { useOpenAuthModal } from "@/components/Providers";

type Tab = "analyze" | "history" | "profile";

export default function Home() {
  const { user, profile, loading } = useAuth();
  const openAuthModal = useOpenAuthModal();
  const [activeTab, setActiveTab] = useState<Tab>("analyze");

  function handleTabChange(tab: Tab) {
    // Profile tab requires auth
    if (tab === "profile" && !user) {
      openAuthModal();
      return;
    }
    setActiveTab(tab);
  }

  const displayName = profile?.name ?? user?.displayName ?? user?.email ?? "";
  const initials = user ? (displayName.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "?") : null;

  const content = (
    <>
      {activeTab === "analyze" && <AnalyzeScreen />}
      {activeTab === "history" && <HistoryScreen />}
      {activeTab === "profile" && user && <ProfileScreen />}
    </>
  );

  return (
    <div className="flex h-full w-full">
      {/* ── Desktop sidebar (hidden on mobile) ── */}
      <DesktopSidebar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* ── Right side ── */}
      <div className="flex flex-col flex-1 overflow-hidden md:bg-[#F7F8FA]">

        {/* Desktop top bar */}
        <header className="hidden md:flex items-center justify-between px-8 h-15 shrink-0 bg-white" style={{ borderBottom: "1px solid #E5E7EB" }}>
          <div>
            <h1 className="font-bold text-base" style={{ color: "#111111", letterSpacing: "-0.02em" }}>
              {activeTab === "analyze" ? "Swing Analyzer" : activeTab === "history" ? "Swing History" : "Profile"}
            </h1>
            <p className="text-xs" style={{ color: "#9CA3AF" }}>
              {activeTab === "analyze"
                ? "Upload a video for instant AI coaching"
                : activeTab === "history"
                ? "Your swing history"
                : "Manage your account and preferences"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {loading ? (
              <div className="w-8 h-8 rounded-full animate-pulse" style={{ background: "#F3F4F6" }} />
            ) : user ? (
              <>
                <span className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: "#F1F8E9", color: "#1B5E20" }}>
                  Free Plan
                </span>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #1B5E20, #2E7D32)" }}>
                  {initials}
                </div>
              </>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-2 px-4 h-9 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg, #1B5E20, #2E7D32)", boxShadow: "0 2px 10px rgba(27,94,32,0.3)" }}
              >
                Sign Up
              </button>
            )}
          </div>
        </header>

        {/* ── Mobile layout: constrained + bottom nav ── */}
        <div className="md:hidden flex flex-col flex-1 overflow-hidden max-w-107.5 w-full mx-auto">
          <main className="flex flex-col flex-1 overflow-hidden">
            {content}
          </main>
          <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        </div>

        {/* ── Desktop layout: full width, scrollable ── */}
        <div className="hidden md:flex flex-col flex-1 overflow-hidden">
          <main className="flex flex-col flex-1 overflow-hidden">
            {content}
          </main>
        </div>
      </div>
    </div>
  );
}
