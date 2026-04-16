"use client";

import { useState } from "react";
import Image from "next/image";
import { RefreshIcon } from "@/components/icons";
import { IdleScreen } from "./IdleScreen";
import { CaptureAssistantScreen } from "./CaptureAssistantScreen";
import { PreviewScreen } from "./PreviewScreen";
import { UploadingScreen } from "./UploadingScreen";
import { AnalyzingScreen } from "./AnalyzingScreen";
import { ResultsScreen } from "./ResultsScreen";
import { useAuth } from "@/lib/auth";
import { useOpenAuthModal } from "@/components/Providers";

type AppState = "idle" | "captureAssistant" | "preview" | "uploading" | "analyzing" | "result" | "error";

interface AnalysisResult {
  issue: string;
  why: string;
  fix: string[];
  drill: string;
  confidence: number;
}

// ─── Client-side frame extraction ─────────────────────────────────────────────

const FRAME_PERCENTAGES = [0.08, 0.22, 0.38, 0.54, 0.70, 0.88];
const FRAME_MAX_WIDTH = 768;
const FRAME_QUALITY = 0.82;

function seekVideo(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve) => {
    const timeout = setTimeout(resolve, 2000);
    video.onseeked = () => { clearTimeout(timeout); resolve(); };
    video.currentTime = time;
  });
}

async function extractFrames(
  file: File,
  onProgress: (pct: number) => void
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);
    video.src = url;
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read this video file. Please try MP4 or MOV."));
    };

    video.onloadedmetadata = async () => {
      try {
        const duration = video.duration;
        if (!duration || !isFinite(duration) || duration <= 0) {
          throw new Error("Video duration is invalid. Please try a different file.");
        }
        const scale = Math.min(1, FRAME_MAX_WIDTH / video.videoWidth);
        const w = Math.round(video.videoWidth * scale);
        const h = Math.round(video.videoHeight * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        const frames: string[] = [];

        for (let i = 0; i < FRAME_PERCENTAGES.length; i++) {
          await seekVideo(video, FRAME_PERCENTAGES[i] * duration);
          ctx.drawImage(video, 0, 0, w, h);
          frames.push(canvas.toDataURL("image/jpeg", FRAME_QUALITY).split(",")[1]);
          onProgress(10 + ((i + 1) / FRAME_PERCENTAGES.length) * 80);
        }
        URL.revokeObjectURL(url);
        resolve(frames);
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };
    video.load();
  });
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AnalyzeScreen() {
  const { user } = useAuth();
  const openAuthModal = useOpenAuthModal();
  const [state, setState] = useState<AppState>("idle");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadLabel, setUploadLabel] = useState("Preparing your swing…");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  function handleFileSelected(file: File) {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    const url = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoUrl(url);
    setState("preview");
  }

  async function handleConfirmVideo() {
    if (!videoFile) return;
    setErrorMessage("");
    setUploadProgress(5);
    setUploadLabel("Reading video…");
    setState("uploading");

    let frames: string[];
    try {
      setUploadLabel("Extracting frames…");
      frames = await extractFrames(videoFile, (pct) => setUploadProgress(pct));
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Could not process video.");
      setState("error");
      return;
    }

    setUploadProgress(95);
    setUploadLabel("Sending to AI…");
    await new Promise((r) => setTimeout(r, 300));
    setUploadProgress(100);
    await new Promise((r) => setTimeout(r, 200));

    setState("analyzing");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frames }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `Server error ${res.status}`);
      setResult(data as AnalysisResult);
      setState("result");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setState("error");
    }
  }

  function handleReset() {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(null);
    setVideoFile(null);
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
        style={{
          height: "56px",
          borderBottom: state === "idle" || state === "captureAssistant" ? "none" : "1px solid #F3F4F6",
        }}
      >
        <div className="flex items-center gap-2">
          <Image
            src="/ImpactAI-logo-removebg-preview.png"
            alt="ImpactAI logo"
            width={36}
            height={36}
            priority
            className="w-8 h-8 object-contain"
          />
          <span className="font-bold text-lg" style={{ color: "#1B5E20", letterSpacing: "-0.02em" }}>ImpactAI</span>
        </div>
        {(state === "uploading" || state === "analyzing") ? (
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#2E7D32" }} />
            <span className="text-xs font-medium" style={{ color: "#6B7280" }}>
              {state === "uploading" ? "Preparing" : "Analyzing"}
            </span>
          </div>
        ) : !user && state === "idle" ? (
          <button
            onClick={openAuthModal}
            className="px-3 h-8 rounded-xl text-xs font-semibold text-white active:scale-95 transition-transform"
            style={{ background: "linear-gradient(135deg, #1B5E20, #2E7D32)" }}
          >
            Sign Up
          </button>
        ) : null}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {state === "idle" && (
          <IdleScreen
            onFileSelected={handleFileSelected}
            onOpenCaptureAssistant={() => setState("captureAssistant")}
          />
        )}
        {state === "captureAssistant" && (
          <CaptureAssistantScreen
            onFileSelected={handleFileSelected}
            onCancel={() => setState("idle")}
          />
        )}
        {state === "preview" && videoUrl && videoFile && (
          <PreviewScreen
            videoUrl={videoUrl}
            onConfirm={handleConfirmVideo}
            onRetake={() => setState("captureAssistant")}
            onCancel={handleReset}
          />
        )}
        {state === "uploading" && (
          <UploadingScreen progress={uploadProgress} label={uploadLabel} />
        )}
        {state === "analyzing" && <AnalyzingScreen />}
        {state === "result" && result && (
          <ResultsScreen result={result} videoUrl={videoUrl} onReset={handleReset} />
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
      <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
        style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h2 className="text-xl font-bold mb-2 text-center" style={{ color: "#111111", letterSpacing: "-0.01em" }}>Analysis Failed</h2>
      <p className="text-sm text-center mb-8 leading-relaxed" style={{ color: "#6B7280", maxWidth: "280px" }}>{message}</p>
      <button onClick={onReset}
        className="flex items-center gap-2 px-6 h-12 rounded-2xl font-semibold text-sm text-white active:scale-95 transition-transform duration-100"
        style={{ background: "linear-gradient(135deg, #1B5E20, #2E7D32)", boxShadow: "0 4px 16px rgba(27,94,32,0.3)" }}>
        <RefreshIcon size={16} stroke="#FFFFFF" strokeWidth={2.2} />
        Try Again
      </button>
    </div>
  );
}
