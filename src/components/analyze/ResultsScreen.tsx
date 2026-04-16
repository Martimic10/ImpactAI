"use client";

import { useRef, useState, useEffect } from "react";
import { DumbbellIcon, RefreshIcon } from "@/components/icons";

interface AnalysisResult {
  issue: string;
  why: string;
  fix: string[];
  drill: string;
  confidence: number;
}

interface ResultsScreenProps {
  result: AnalysisResult;
  videoUrl?: string | null;
  onReset: () => void;
}

const SPEEDS = [
  { label: "0.25x", value: 0.25 },
  { label: "0.5x", value: 0.5 },
  { label: "1x", value: 1 },
];

export function ResultsScreen({ result, videoUrl, onReset }: ResultsScreenProps) {
  const confidencePct = (result.confidence / 10) * 100;

  return (
    <>
      {/* ── MOBILE ── */}
      <div className="md:hidden flex flex-col flex-1 overflow-y-auto pb-8 animate-fade-in">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 flex items-center justify-between shrink-0">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#9CA3AF" }}>
              Analysis Complete
            </p>
            <h2 className="text-xl font-extrabold leading-tight" style={{ color: "#111111", letterSpacing: "-0.02em" }}>
              Your Coaching Report
            </h2>
          </div>
        </div>

        {/* Video player */}
        {videoUrl && (
          <div className="px-4 mb-4">
            <VideoPlayer url={videoUrl} />
          </div>
        )}

        {/* Cards */}
        <div className="px-4 flex flex-col gap-3">
          <IssueCard issue={result.issue} />
          <WhyCard why={result.why} />
          <FixCard fix={result.fix} />
          <DrillCard drill={result.drill} />
          <ConfidenceCard confidence={result.confidence} confidencePct={confidencePct} />

          <button
            onClick={onReset}
            className="w-full h-14 rounded-2xl font-bold text-base text-white flex items-center justify-center gap-2 active:scale-[0.97] transition-transform mt-2"
            style={{ background: "linear-gradient(135deg, #1B5E20, #2E7D32)", boxShadow: "0 6px 20px rgba(27,94,32,0.3)" }}
          >
            <RefreshIcon size={18} stroke="#FFFFFF" strokeWidth={2.2} />
            Analyze Another Swing
          </button>
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:flex flex-col flex-1 overflow-y-auto animate-fade-in" style={{ background: "#F7F8FA" }}>
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
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-80 active:scale-95 transition-all"
            style={{ background: "linear-gradient(135deg, #1B5E20, #2E7D32)", color: "#FFFFFF", boxShadow: "0 4px 12px rgba(27,94,32,0.3)" }}
          >
            <RefreshIcon size={15} stroke="#FFFFFF" strokeWidth={2.2} />
            Analyze Another
          </button>
        </div>

        <div className="px-8 pb-8 flex flex-col gap-5">
          {/* Issue banner */}
          <div
            className="rounded-3xl p-6 flex items-center justify-between"
            style={{ background: "linear-gradient(135deg, #1B5E20, #2E7D32)", boxShadow: "0 8px 24px rgba(27,94,32,0.25)" }}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                Main Issue Detected
              </p>
              <h3 className="text-3xl font-extrabold text-white" style={{ letterSpacing: "-0.03em" }}>
                {result.issue}
              </h3>
            </div>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(255,255,255,0.12)" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
              </svg>
            </div>
          </div>

          {/* Two-column grid */}
          <div className="grid grid-cols-2 gap-5">
            {/* Left column */}
            <div className="flex flex-col gap-4">
              {/* Video player */}
              {videoUrl && <VideoPlayer url={videoUrl} />}

              <div className="rounded-2xl p-5" style={{ background: "#FFFFFF", border: "1px solid #E5E7EB" }}>
                <Label>Why It&apos;s Happening</Label>
                <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>{result.why}</p>
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl p-5" style={{ background: "#FFFFFF", border: "1px solid #E5E7EB" }}>
                <Label>How to Fix It</Label>
                <div className="flex flex-col gap-3">
                  {result.fix.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: "#F0FDF4" }}>
                        <span className="text-xs font-bold" style={{ color: "#1B5E20" }}>{i + 1}</span>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl p-5" style={{ background: "#F0FDF4", border: "1.5px solid #86EFAC" }}>
                <div className="flex items-center gap-2 mb-3">
                  <DumbbellIcon size={15} stroke="#15803D" strokeWidth={2} />
                  <Label green>Practice Drill</Label>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#166534" }}>{result.drill}</p>
              </div>

              <div className="rounded-2xl p-5" style={{ background: "#FFFFFF", border: "1px solid #E5E7EB" }}>
                <div className="flex items-center justify-between mb-3">
                  <Label>Confidence</Label>
                  <span className="text-2xl font-extrabold" style={{ color: "#1B5E20", letterSpacing: "-0.03em" }}>
                    {result.confidence}<span className="text-sm font-normal" style={{ color: "#9CA3AF" }}>/10</span>
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "#E5E7EB" }}>
                  <div className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${confidencePct}%`, background: "linear-gradient(90deg, #1B5E20, #66BB6A)" }} />
                </div>
                <p className="text-xs mt-2" style={{ color: "#9CA3AF" }}>Based on video clarity and swing visibility</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Video Player ─────────────────────────────────────────────────────────────

function VideoPlayer({ url }: { url: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(true);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setProgress(v.duration ? (v.currentTime / v.duration) * 100 : 0);
    const onEnd = () => setPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnd);
    return () => { v.removeEventListener("timeupdate", onTime); v.removeEventListener("ended", onEnd); };
  }, []);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  }

  function seek(e: React.ChangeEvent<HTMLInputElement>) {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const pct = Number(e.target.value);
    v.currentTime = (pct / 100) * v.duration;
    setProgress(pct);
  }

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  function setPlaybackSpeed(s: number) {
    const v = videoRef.current;
    if (v) v.playbackRate = s;
    setSpeed(s);
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "#0A0A0A" }}>
      {/* Video */}
      <div className="relative" style={{ aspectRatio: "9/16", maxHeight: "360px" }}>
        <video
          ref={videoRef}
          src={url}
          className="w-full h-full object-contain"
          playsInline
          muted={muted}
          loop
        />
        <button onClick={togglePlay} className="absolute inset-0 flex items-center justify-center">
          {!playing && (
            <div className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          )}
        </button>
      </div>

      {/* Controls */}
      <div className="px-4 pt-3 pb-3" style={{ background: "#111111" }}>
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-3">
          <button onClick={togglePlay} className="shrink-0">
            {playing ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.8)">
                <rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.8)">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </button>

          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={seek}
            className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #2E7D32 ${progress}%, rgba(255,255,255,0.15) ${progress}%)`,
              accentColor: "#2E7D32",
            }}
          />

          <button onClick={toggleMute} className="shrink-0">
            {muted ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round">
                <path d="M11 5L6 9H2v6h4l5 4V5z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round">
                <path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            )}
          </button>
        </div>

        {/* Speed buttons */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest mr-1" style={{ color: "rgba(255,255,255,0.35)" }}>
            Speed
          </span>
          {SPEEDS.map((s) => (
            <button
              key={s.value}
              onClick={() => setPlaybackSpeed(s.value)}
              className="px-3 h-7 rounded-lg text-xs font-bold transition-all active:scale-95"
              style={{
                background: speed === s.value ? "#2E7D32" : "rgba(255,255,255,0.08)",
                color: speed === s.value ? "#FFFFFF" : "rgba(255,255,255,0.5)",
                border: speed === s.value ? "none" : "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Mobile card sub-components ───────────────────────────────────────────────

function IssueCard({ issue }: { issue: string }) {
  return (
    <div className="rounded-3xl p-5"
      style={{ background: "linear-gradient(135deg, #1B5E20, #2E7D32)", boxShadow: "0 8px 24px rgba(27,94,32,0.25)" }}>
      <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>
        Main Issue Detected
      </p>
      <h3 className="text-xl font-extrabold text-white leading-tight" style={{ letterSpacing: "-0.02em" }}>{issue}</h3>
    </div>
  );
}

function WhyCard({ why }: { why: string }) {
  return (
    <div className="rounded-3xl p-5" style={{ background: "#FAFAFA", border: "1px solid #E5E7EB" }}>
      <Label>Why It&apos;s Happening</Label>
      <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>{why}</p>
    </div>
  );
}

function FixCard({ fix }: { fix: string[] }) {
  return (
    <div className="rounded-3xl p-5" style={{ background: "#FAFAFA", border: "1px solid #E5E7EB" }}>
      <Label>How to Fix It</Label>
      <div className="flex flex-col gap-3">
        {fix.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
              style={{ background: "#F0FDF4" }}>
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
    <div className="rounded-3xl p-5" style={{ background: "#F0FDF4", border: "1.5px solid #86EFAC" }}>
      <div className="flex items-center gap-2 mb-2">
        <DumbbellIcon size={15} stroke="#15803D" strokeWidth={2} />
        <Label green>Practice Drill</Label>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: "#166534" }}>{drill}</p>
    </div>
  );
}

function ConfidenceCard({ confidence, confidencePct }: { confidence: number; confidencePct: number }) {
  return (
    <div className="rounded-3xl p-5" style={{ background: "#FAFAFA", border: "1px solid #E5E7EB" }}>
      <div className="flex justify-between items-center mb-3">
        <Label>Confidence Score</Label>
        <span className="text-2xl font-extrabold" style={{ color: "#1B5E20", letterSpacing: "-0.02em" }}>
          {confidence}<span className="text-sm font-normal" style={{ color: "#9CA3AF" }}>/10</span>
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: "#E5E7EB" }}>
        <div className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${confidencePct}%`, background: "linear-gradient(90deg, #1B5E20, #66BB6A)" }} />
      </div>
      <p className="text-xs" style={{ color: "#9CA3AF" }}>Based on video clarity and swing visibility</p>
    </div>
  );
}

function Label({ children, green }: { children: React.ReactNode; green?: boolean }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest mb-3"
      style={{ color: green ? "#15803D" : "#9CA3AF" }}>
      {children}
    </p>
  );
}
