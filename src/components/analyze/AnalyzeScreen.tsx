"use client";

import { useState } from "react";
import { GolfFlagIcon, RefreshIcon } from "@/components/icons";
import { IdleScreen } from "./IdleScreen";
import { UploadingScreen } from "./UploadingScreen";
import { AnalyzingScreen } from "./AnalyzingScreen";
import { ResultsScreen } from "./ResultsScreen";

type AppState = "idle" | "uploading" | "analyzing" | "result" | "error";

interface AnalysisResult {
  issue: string;
  why: string;
  fix: string[];
  drill: string;
  confidence: number;
}

export function AnalyzeScreen() {
  const [state, setState] = useState<AppState>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function handleFileSelected(file: File) {
    setErrorMessage("");
    setState("uploading");
    setUploadProgress(0);

    // Animate upload bar while file is being read
    const progressTimer = animateProgress((p) => setUploadProgress(p), 1400);

    let formData: FormData;
    try {
      formData = new FormData();
      formData.append("video", file);
    } catch {
      progressTimer.cancel();
      setErrorMessage("Could not read the video file. Please try again.");
      setState("error");
      return;
    }

    progressTimer.finish();
    setUploadProgress(100);

    // Short pause so the user sees 100% before switching state
    await delay(300);
    setState("analyzing");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? `Server error ${res.status}`);
      }

      setResult(data as AnalysisResult);
      setState("result");
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setErrorMessage(msg);
      setState("error");
    }
  }

  function handleReset() {
    setResult(null);
    setUploadProgress(0);
    setErrorMessage("");
    setState("idle");
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Mobile-only top bar */}
      <div
        className="md:hidden shrink-0 flex items-center justify-between px-5"
        style={{ height: "56px", borderBottom: state === "idle" ? "none" : "1px solid #F3F4F6" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #1B5E20, #2E7D32)" }}
          >
            <GolfFlagIcon size={14} stroke="#FFFFFF" strokeWidth={2.2} />
          </div>
          <span className="font-bold text-lg" style={{ color: "#1B5E20", letterSpacing: "-0.02em" }}>
            ImpactAI
          </span>
        </div>
        {(state === "uploading" || state === "analyzing") && (
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#2E7D32" }} />
            <span className="text-xs font-medium" style={{ color: "#6B7280" }}>
              {state === "uploading" ? "Uploading" : "Analyzing"}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 overflow-hidden" key={state}>
        {state === "idle" && (
          <IdleScreen onFileSelected={handleFileSelected} />
        )}
        {state === "uploading" && (
          <UploadingScreen progress={uploadProgress} />
        )}
        {state === "analyzing" && (
          <AnalyzingScreen />
        )}
        {state === "result" && result && (
          <ResultsScreen result={result} onReset={handleReset} />
        )}
        {state === "error" && (
          <ErrorScreen message={errorMessage} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}

// ─── Error screen ─────────────────────────────────────────────────────────────

function ErrorScreen({ message, onReset }: { message: string; onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-8 py-16 animate-fade-in">
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
        style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <h2 className="text-xl font-bold mb-2 text-center" style={{ color: "#111111", letterSpacing: "-0.01em" }}>
        Analysis Failed
      </h2>
      <p className="text-sm text-center mb-8 leading-relaxed" style={{ color: "#6B7280", maxWidth: "280px" }}>
        {message}
      </p>

      <button
        onClick={onReset}
        className="flex items-center gap-2 px-6 h-12 rounded-2xl font-semibold text-sm text-white active:scale-95 transition-transform duration-100"
        style={{
          background: "linear-gradient(135deg, #1B5E20, #2E7D32)",
          boxShadow: "0 4px 16px rgba(27,94,32,0.3)",
        }}
      >
        <RefreshIcon size={16} stroke="#FFFFFF" strokeWidth={2.2} />
        Try Again
      </button>
    </div>
  );
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

interface ProgressController {
  finish: () => void;
  cancel: () => void;
}

function animateProgress(
  onProgress: (p: number) => void,
  durationMs: number
): ProgressController {
  const start = Date.now();
  let rafId: number;
  let done = false;

  const tick = () => {
    if (done) return;
    const elapsed = Date.now() - start;
    const progress = Math.min((elapsed / durationMs) * 95, 95);
    onProgress(progress);
    if (elapsed < durationMs * 2) {
      rafId = requestAnimationFrame(tick);
    }
  };

  rafId = requestAnimationFrame(tick);

  return {
    finish: () => {
      done = true;
      cancelAnimationFrame(rafId);
    },
    cancel: () => {
      done = true;
      cancelAnimationFrame(rafId);
    },
  };
}
