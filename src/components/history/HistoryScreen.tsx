"use client";

import { FilmIcon } from "@/components/icons";

export function HistoryScreen() {
  return (
    <>
      {/* ── MOBILE ── */}
      <div className="md:hidden flex flex-col flex-1 overflow-y-auto">
        <div className="px-5 pt-5 pb-4 shrink-0" style={{ borderBottom: "1px solid #F3F4F6" }}>
          <h1 className="text-2xl font-extrabold" style={{ color: "#111111", letterSpacing: "-0.03em" }}>Swing History</h1>
          <p className="text-sm mt-0.5" style={{ color: "#9CA3AF" }}>Your analyzed sessions will appear here</p>
        </div>

        <div className="flex flex-col flex-1 items-center justify-center px-8 py-16">
          <EmptyState />
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:flex flex-col flex-1 overflow-y-auto" style={{ background: "#F7F8FA" }}>
        <div className="px-8 pt-8 pb-6">
          <h1 className="text-2xl font-extrabold mb-1" style={{ color: "#111111", letterSpacing: "-0.03em" }}>Swing History</h1>
          <p className="text-sm" style={{ color: "#9CA3AF" }}>Track your progress over time and spot patterns in your swing.</p>
        </div>

        <div className="flex flex-col flex-1 items-center justify-center px-8 pb-16">
          <EmptyState />
        </div>
      </div>
    </>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center text-center" style={{ maxWidth: "280px" }}>
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
        style={{ background: "#F1F8E9", border: "1px solid #C8E6C9" }}
      >
        <FilmIcon size={36} stroke="#2E7D32" strokeWidth={1.5} />
      </div>
      <h2 className="text-lg font-extrabold mb-2" style={{ color: "#111111", letterSpacing: "-0.02em" }}>
        No swings yet
      </h2>
      <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
        Analyze your first swing and your session history will show up here.
      </p>
    </div>
  );
}
