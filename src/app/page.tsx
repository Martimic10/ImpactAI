"use client";

import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { AnalyzeScreen } from "@/components/analyze/AnalyzeScreen";
import { HistoryScreen } from "@/components/history/HistoryScreen";
import { ProfileScreen } from "@/components/profile/ProfileScreen";

type Tab = "analyze" | "history" | "profile";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("analyze");

  const content = (
    <>
      {activeTab === "analyze" && <AnalyzeScreen />}
      {activeTab === "history" && <HistoryScreen />}
      {activeTab === "profile" && <ProfileScreen />}
    </>
  );

  return (
    <div className="flex h-full w-full">
      {/* ── Desktop sidebar (hidden on mobile) ── */}
      <DesktopSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* ── Right side ── */}
      <div className="flex flex-col flex-1 overflow-hidden md:bg-[#F7F8FA]">

        {/* Desktop top bar */}
        <header className="hidden md:flex items-center justify-between px-8 h-15 shrink-0 bg-white" style={{ borderBottom: "1px solid #E5E7EB" }}>
          <div>
            <h1 className="font-bold text-base" style={{ color: "#111111", letterSpacing: "-0.02em" }}>
              {activeTab === "analyze" ? "Swing Analyzer" : activeTab === "history" ? "Swing History" : "Profile"}
            </h1>
            <p className="text-xs" style={{ color: "#9CA3AF" }}>
              {activeTab === "analyze" ? "Upload a video for instant AI coaching" : activeTab === "history" ? "6 sessions analyzed · last on Apr 14" : "Manage your account and preferences"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: "#F1F8E9", color: "#1B5E20" }}>
              Free Plan
            </span>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "linear-gradient(135deg, #1B5E20, #2E7D32)" }}>
              M
            </div>
          </div>
        </header>

        {/* ── Mobile layout: constrained + bottom nav ── */}
        <div className="md:hidden flex flex-col flex-1 overflow-hidden max-w-107.5 w-full mx-auto">
          <main className="flex flex-col flex-1 overflow-hidden">
            {content}
          </main>
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
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
