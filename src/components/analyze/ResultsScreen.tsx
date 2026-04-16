"use client";

import { GolfFlagIcon, DumbbellIcon, RefreshIcon, ArrowRightIcon } from "@/components/icons";

interface AnalysisResult {
  issue: string;
  why: string;
  fix: string[];
  drill: string;
  confidence: number;
}

interface ResultsScreenProps {
  result: AnalysisResult;
  onReset: () => void;
}

export function ResultsScreen({ result, onReset }: ResultsScreenProps) {
  const confidencePct = (result.confidence / 10) * 100;

  return (
    <>
      {/* ── MOBILE ── */}
      <div className="md:hidden flex flex-col flex-1 overflow-y-auto px-4 pb-6 pt-2 animate-slide-up">
        <MobileHeader />
        <IssueCard issue={result.issue} />
        <WhyCard why={result.why} />
        <FixCard fix={result.fix} />
        <DrillCard drill={result.drill} />
        <ConfidenceCard confidence={result.confidence} confidencePct={confidencePct} />
        <ResetButton onReset={onReset} />
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:flex flex-col flex-1 overflow-y-auto animate-slide-up" style={{ background: "#F7F8FA" }}>
        <div className="px-8 pt-8 pb-6 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#9CA3AF" }}>
              Swing Analysis Complete
            </p>
            <h2 className="text-2xl font-extrabold" style={{ color: "#111111", letterSpacing: "-0.03em" }}>
              Your Coaching Report
            </h2>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 hover:opacity-80"
            style={{ background: "linear-gradient(135deg, #1B5E20, #2E7D32)", color: "#FFFFFF", boxShadow: "0 4px 12px rgba(27,94,32,0.3)" }}
          >
            <RefreshIcon size={16} stroke="#FFFFFF" strokeWidth={2.2} />
            Analyze Another
          </button>
        </div>

        {/* Issue banner */}
        <div className="px-8 mb-6">
          <div
            className="rounded-3xl p-6 flex items-center justify-between"
            style={{ background: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)", boxShadow: "0 8px 24px rgba(27, 94, 32, 0.25)" }}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                Main Issue Detected
              </p>
              <h3 className="text-3xl font-extrabold text-white" style={{ letterSpacing: "-0.03em" }}>
                {result.issue}
              </h3>
            </div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.12)" }}>
              <GolfFlagIcon size={32} stroke="#FFFFFF" strokeWidth={1.8} />
            </div>
          </div>
        </div>

        {/* Two-column grid */}
        <div className="px-8 pb-8 grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl p-6" style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#9CA3AF" }}>Why It&apos;s Happening</p>
              <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>{result.why}</p>
            </div>
            <div className="rounded-2xl p-6" style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#9CA3AF" }}>How to Fix It</p>
              <div className="flex flex-col gap-4">
                {result.fix.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "#F1F8E9" }}>
                      <span className="text-xs font-bold" style={{ color: "#1B5E20" }}>{i + 1}</span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl p-6" style={{ background: "#F0FDF4", border: "1.5px solid #86EFAC", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
              <div className="flex items-center gap-2 mb-3">
                <DumbbellIcon size={16} stroke="#15803D" strokeWidth={2} />
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#15803D" }}>Practice Drill</p>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#166534" }}>{result.drill}</p>
            </div>

            <div className="rounded-2xl p-6" style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#9CA3AF" }}>Analysis Confidence</p>
                <span className="text-3xl font-extrabold" style={{ color: "#1B5E20", letterSpacing: "-0.03em" }}>
                  {result.confidence}<span className="text-base font-normal" style={{ color: "#9CA3AF" }}>/10</span>
                </span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden mb-3" style={{ background: "#E5E7EB" }}>
                <div className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${confidencePct}%`, background: "linear-gradient(90deg, #1B5E20, #66BB6A)" }} />
              </div>
              <p className="text-xs" style={{ color: "#9CA3AF" }}>Based on video clarity and swing visibility</p>
            </div>

            <div className="rounded-2xl p-6" style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#9CA3AF" }}>Recommended Next Steps</p>
              {["Practice the drill 3× this week", "Record another swing after 5 sessions", "Focus on one fix at a time"].map((step) => (
                <div key={step} className="flex items-center gap-2 mb-2 last:mb-0">
                  <ArrowRightIcon size={14} stroke="#4CAF50" strokeWidth={2.2} />
                  <p className="text-sm" style={{ color: "#374151" }}>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function MobileHeader() {
  return (
    <div className="flex items-center gap-3 mb-5 px-1">
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
        style={{ background: "linear-gradient(135deg, #1B5E20, #2E7D32)" }}>
        <GolfFlagIcon size={20} stroke="#FFFFFF" strokeWidth={2} />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#6B7280" }}>Swing Analysis</p>
        <h2 className="text-lg font-bold leading-tight" style={{ color: "#111111", letterSpacing: "-0.01em" }}>
          Your Coaching Report
        </h2>
      </div>
    </div>
  );
}

function IssueCard({ issue }: { issue: string }) {
  return (
    <div className="rounded-3xl p-5 mb-4"
      style={{ background: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)", boxShadow: "0 8px 24px rgba(27, 94, 32, 0.25)" }}>
      <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.65)" }}>Main Issue</p>
      <h3 className="text-2xl font-bold text-white leading-tight" style={{ letterSpacing: "-0.02em" }}>{issue}</h3>
    </div>
  );
}

function WhyCard({ why }: { why: string }) {
  return (
    <div className="rounded-3xl p-5 mb-4" style={{ background: "#FAFAFA", border: "1px solid #E5E7EB" }}>
      <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#6B7280" }}>Why It&apos;s Happening</p>
      <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>{why}</p>
    </div>
  );
}

function FixCard({ fix }: { fix: string[] }) {
  return (
    <div className="rounded-3xl p-5 mb-4" style={{ background: "#FAFAFA", border: "1px solid #E5E7EB" }}>
      <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#6B7280" }}>How to Fix It</p>
      <div className="flex flex-col gap-3">
        {fix.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5" style={{ background: "#F1F8E9" }}>
              <span className="text-xs font-bold" style={{ color: "#1B5E20" }}>{i + 1}</span>
            </div>
            <p className="text-sm leading-relaxed flex-1" style={{ color: "#374151" }}>{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DrillCard({ drill }: { drill: string }) {
  return (
    <div className="rounded-3xl p-5 mb-4" style={{ background: "#F0FDF4", border: "1.5px solid #86EFAC" }}>
      <div className="flex items-center gap-2 mb-2">
        <DumbbellIcon size={16} stroke="#15803D" strokeWidth={2} />
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#15803D" }}>Practice Drill</p>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: "#166534" }}>{drill}</p>
    </div>
  );
}

function ConfidenceCard({ confidence, confidencePct }: { confidence: number; confidencePct: number }) {
  return (
    <div className="rounded-3xl p-5 mb-6" style={{ background: "#FAFAFA", border: "1px solid #E5E7EB" }}>
      <div className="flex justify-between items-center mb-3">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#6B7280" }}>Confidence</p>
        <span className="text-2xl font-bold" style={{ color: "#1B5E20", letterSpacing: "-0.02em" }}>
          {confidence}<span className="text-sm font-normal" style={{ color: "#9CA3AF" }}>/10</span>
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "#E5E7EB" }}>
        <div className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${confidencePct}%`, background: "linear-gradient(90deg, #1B5E20, #66BB6A)" }} />
      </div>
      <p className="text-xs mt-2" style={{ color: "#9CA3AF" }}>Based on video clarity and swing visibility</p>
    </div>
  );
}

function ResetButton({ onReset }: { onReset: () => void }) {
  return (
    <button
      onClick={onReset}
      className="w-full h-14 rounded-2xl font-semibold text-base text-white flex items-center justify-center gap-2 transition-all duration-150 active:scale-95"
      style={{ background: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)", boxShadow: "0 4px 16px rgba(27, 94, 32, 0.35)" }}
    >
      <RefreshIcon size={18} stroke="#FFFFFF" strokeWidth={2.2} />
      Analyze Another Swing
    </button>
  );
}
