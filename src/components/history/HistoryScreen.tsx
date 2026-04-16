"use client";

import { useState } from "react";
import { FilmIcon, TargetIcon, BarChartIcon, CalendarIcon, LightbulbIcon } from "@/components/icons";

interface SwingEntry {
  id: number;
  date: string;
  shortDate: string;
  issue: string;
  confidence: number;
  drill: string;
  tag: "slice" | "path" | "body" | "impact";
}

const MOCK_SWINGS: SwingEntry[] = [
  { id: 1, date: "April 14, 2026", shortDate: "Apr 14", issue: "Slice (Open Clubface)", confidence: 7, drill: "Alignment Stick Drill", tag: "slice" },
  { id: 2, date: "April 10, 2026", shortDate: "Apr 10", issue: "Over-the-Top Swing Path", confidence: 6, drill: "Headcover Under Arm Drill", tag: "path" },
  { id: 3, date: "April 5, 2026", shortDate: "Apr 5", issue: "Early Extension (Hip Thrust)", confidence: 8, drill: "Chair Drill", tag: "body" },
  { id: 4, date: "March 28, 2026", shortDate: "Mar 28", issue: "Slice (Open Clubface)", confidence: 7, drill: "Alignment Stick Drill", tag: "slice" },
  { id: 5, date: "March 20, 2026", shortDate: "Mar 20", issue: "Chicken Wing (Lead Arm)", confidence: 5, drill: "Towel Drill", tag: "impact" },
  { id: 6, date: "March 12, 2026", shortDate: "Mar 12", issue: "Over-the-Top Swing Path", confidence: 6, drill: "Headcover Under Arm Drill", tag: "path" },
];

const TAG_COLORS: Record<SwingEntry["tag"], { bg: string; text: string; label: string }> = {
  slice:  { bg: "#FEF2F2", text: "#DC2626", label: "Slice" },
  path:   { bg: "#FFF7ED", text: "#EA580C", label: "Swing Path" },
  body:   { bg: "#F0FDF4", text: "#15803D", label: "Body" },
  impact: { bg: "#EFF6FF", text: "#1D4ED8", label: "Impact" },
};

const avgConfidence = Math.round(MOCK_SWINGS.reduce((s, e) => s + e.confidence, 0) / MOCK_SWINGS.length);

const DESKTOP_STATS = [
  { label: "Total Swings", value: String(MOCK_SWINGS.length), icon: <FilmIcon size={22} stroke="#1B5E20" strokeWidth={1.8} /> },
  { label: "Avg Confidence", value: `${avgConfidence}/10`, icon: <TargetIcon size={22} stroke="#1B5E20" strokeWidth={1.8} /> },
  { label: "Most Common Issue", value: "Slice", icon: <BarChartIcon size={22} stroke="#1B5E20" strokeWidth={1.8} /> },
  { label: "Last Session", value: "Apr 14", icon: <CalendarIcon size={22} stroke="#1B5E20" strokeWidth={1.8} /> },
];

export function HistoryScreen() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <>
      {/* ── MOBILE ── */}
      <div className="md:hidden flex flex-col flex-1 overflow-y-auto">
        <div className="px-5 pt-5 pb-4 shrink-0" style={{ borderBottom: "1px solid #F3F4F6" }}>
          <h1 className="text-2xl font-extrabold" style={{ color: "#111111", letterSpacing: "-0.03em" }}>Swing History</h1>
          <p className="text-sm mt-0.5" style={{ color: "#9CA3AF" }}>{MOCK_SWINGS.length} sessions analyzed</p>
        </div>

        <div className="flex px-5 py-4 gap-3" style={{ borderBottom: "1px solid #F3F4F6" }}>
          <StatPill label="Total Swings" value={String(MOCK_SWINGS.length)} />
          <StatPill label="Avg Confidence" value={`${avgConfidence}/10`} />
          <StatPill label="Top Issue" value="Slice" />
        </div>

        <div className="flex flex-col flex-1 px-4 py-4 gap-3">
          {MOCK_SWINGS.map((swing) => (
            <MobileSwingCard
              key={swing.id}
              swing={swing}
              isExpanded={expanded === swing.id}
              onToggle={() => setExpanded(expanded === swing.id ? null : swing.id)}
            />
          ))}
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:flex flex-col flex-1 overflow-y-auto" style={{ background: "#F7F8FA" }}>
        <div className="px-8 pt-8 pb-6">
          <h1 className="text-2xl font-extrabold mb-1" style={{ color: "#111111", letterSpacing: "-0.03em" }}>Swing History</h1>
          <p className="text-sm" style={{ color: "#9CA3AF" }}>Track your progress over time and spot patterns in your swing.</p>
        </div>

        {/* Stats row */}
        <div className="px-8 mb-6 grid grid-cols-4 gap-4">
          {DESKTOP_STATS.map((s) => (
            <div key={s.label} className="rounded-2xl p-5" style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div className="mb-2">{s.icon}</div>
              <p className="text-2xl font-extrabold mb-0.5" style={{ color: "#111111", letterSpacing: "-0.03em" }}>{s.value}</p>
              <p className="text-xs" style={{ color: "#9CA3AF" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* AI insight banner */}
        <div className="px-8 mb-6">
          <div
            className="rounded-2xl p-5 flex items-center justify-between"
            style={{ background: "linear-gradient(135deg, #1B5E20, #2E7D32)", boxShadow: "0 4px 16px rgba(27,94,32,0.2)" }}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>AI Insight</p>
              <p className="text-base font-bold text-white">
                Your most common fault is a slice — focus on the alignment stick drill this week.
              </p>
            </div>
            <div className="ml-4 shrink-0">
              <LightbulbIcon size={28} stroke="rgba(255,255,255,0.7)" strokeWidth={1.8} />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="px-8 pb-8">
          <div className="rounded-2xl overflow-hidden" style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div
              className="grid px-6 py-3"
              style={{ gridTemplateColumns: "120px 1fr 140px 120px 140px", borderBottom: "1px solid #F3F4F6", background: "#FAFAFA" }}
            >
              {["Date", "Issue Detected", "Category", "Confidence", "Drill Assigned"].map((h) => (
                <p key={h} className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#9CA3AF" }}>{h}</p>
              ))}
            </div>
            {MOCK_SWINGS.map((swing, i) => {
              const tag = TAG_COLORS[swing.tag];
              return (
                <div
                  key={swing.id}
                  className="grid px-6 py-4 items-center hover:bg-[#FAFAFA] transition-colors duration-100 cursor-pointer"
                  style={{ gridTemplateColumns: "120px 1fr 140px 120px 140px", borderTop: i > 0 ? "1px solid #F3F4F6" : "none" }}
                >
                  <p className="text-sm font-medium" style={{ color: "#6B7280" }}>{swing.shortDate}</p>
                  <p className="text-sm font-semibold" style={{ color: "#111111" }}>{swing.issue}</p>
                  <div>
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: tag.bg, color: tag.text }}>
                      {tag.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#E5E7EB", maxWidth: "56px" }}>
                      <div className="h-full rounded-full" style={{ width: `${swing.confidence * 10}%`, background: "linear-gradient(90deg, #1B5E20, #66BB6A)" }} />
                    </div>
                    <span className="text-sm font-bold" style={{ color: "#1B5E20" }}>{swing.confidence}/10</span>
                  </div>
                  <p className="text-sm" style={{ color: "#6B7280" }}>{swing.drill}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 rounded-2xl px-3 py-3 text-center" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
      <p className="text-base font-extrabold" style={{ color: "#1B5E20", letterSpacing: "-0.02em" }}>{value}</p>
      <p className="text-[10px] mt-0.5" style={{ color: "#9CA3AF" }}>{label}</p>
    </div>
  );
}

function MobileSwingCard({ swing, isExpanded, onToggle }: { swing: SwingEntry; isExpanded: boolean; onToggle: () => void }) {
  const tag = TAG_COLORS[swing.tag];
  return (
    <button
      onClick={onToggle}
      className="w-full text-left rounded-2xl p-4 transition-all duration-150 active:scale-[0.98]"
      style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: tag.bg, color: tag.text }}>
              {tag.label}
            </span>
            <span className="text-xs" style={{ color: "#9CA3AF" }}>{swing.date}</span>
          </div>
          <p className="text-sm font-semibold" style={{ color: "#111111" }}>{swing.issue}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-sm font-bold" style={{ color: "#1B5E20" }}>{swing.confidence}/10</span>
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
      <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: "#E5E7EB" }}>
        <div className="h-full rounded-full" style={{ width: `${swing.confidence * 10}%`, background: "linear-gradient(90deg, #1B5E20, #66BB6A)" }} />
      </div>
      {isExpanded && (
        <div className="mt-4 pt-4 flex flex-col gap-2 animate-fade-in" style={{ borderTop: "1px solid #F3F4F6" }}>
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium" style={{ color: "#374151" }}>
              Drill: <span style={{ color: "#1B5E20" }}>{swing.drill}</span>
            </p>
          </div>
          <p className="text-xs" style={{ color: "#9CA3AF" }}>Tap "Analyze" to run a new swing analysis</p>
        </div>
      )}
    </button>
  );
}
