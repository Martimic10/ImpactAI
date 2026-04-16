"use client";

import { useState, useRef } from "react";
import { CheckIcon } from "@/components/icons";

type Angle = "dtl" | "faceOn";
type Step = 1 | 2 | 3;

const ANGLE_CONFIG = {
  dtl: {
    label: "Down the Line",
    tagline: "Best for swing path, club plane, and slice/hook diagnosis.",
    tips: [
      "Place camera waist-high",
      "8–10 feet directly behind your hands",
      "Keep full body and club visible",
      "Record from setup to follow-through",
    ],
    guideLabel: "Camera behind you",
    lineDir: "vertical" as const,
  },
  faceOn: {
    label: "Face On",
    tagline: "Best for posture, weight shift, balance, and rotation.",
    tips: [
      "Place camera chest-high",
      "Stand directly side-on to target",
      "Keep full body and club visible",
      "Record full motion from start to finish",
    ],
    guideLabel: "Camera facing you",
    lineDir: "vertical" as const,
  },
};

interface Props {
  onFileSelected: (file: File) => void;
  onCancel: () => void;
}

export function CaptureAssistantScreen({ onFileSelected, onCancel }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [angle, setAngle] = useState<Angle | null>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
    e.target.value = "";
  }

  function openLibrary() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) onFileSelected(file);
    };
    input.click();
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      {/* Progress header */}
      <div className="shrink-0 flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #F3F4F6" }}>
        <button
          onClick={step === 1 ? onCancel : () => setStep((s) => (s - 1) as Step)}
          className="text-sm font-semibold"
          style={{ color: "#6B7280" }}
        >
          {step === 1 ? "Cancel" : "Back"}
        </button>
        <div className="flex items-center gap-1.5">
          {([1, 2, 3] as Step[]).map((s) => (
            <div
              key={s}
              className="rounded-full transition-all duration-300"
              style={{
                width: step === s ? 20 : 6,
                height: 6,
                background: step >= s ? "#1B5E20" : "#E5E7EB",
              }}
            />
          ))}
        </div>
        <div style={{ width: 52 }} />
      </div>

      {step === 1 && (
        <StepOne angle={angle} onSelect={setAngle} onNext={() => setStep(2)} />
      )}
      {step === 2 && angle && (
        <StepTwo config={ANGLE_CONFIG[angle]} onNext={() => setStep(3)} />
      )}
      {step === 3 && angle && (
        <StepThree
          config={ANGLE_CONFIG[angle]}
          onRecord={() => cameraRef.current?.click()}
          onUpload={openLibrary}
        />
      )}

      <input
        ref={cameraRef}
        type="file"
        accept="video/*"
        capture="environment"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

// ─── Step 1: Choose Angle ─────────────────────────────────────────────────────

function StepOne({
  angle,
  onSelect,
  onNext,
}: {
  angle: Angle | null;
  onSelect: (a: Angle) => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto px-5 pt-7 pb-8">
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#9CA3AF" }}>
          Step 1 of 3
        </p>
        <h1 className="text-2xl font-extrabold mb-2" style={{ color: "#111111", letterSpacing: "-0.03em" }}>
          Choose Your Angle
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
          Select the camera position you&apos;ll be filming from.
        </p>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        <AngleCard
          selected={angle === "dtl"}
          onSelect={() => onSelect("dtl")}
          title="Down the Line"
          desc="Best for swing path, club plane, and slice/hook diagnosis."
          illustration={<DTLIllustration />}
        />
        <AngleCard
          selected={angle === "faceOn"}
          onSelect={() => onSelect("faceOn")}
          title="Face On"
          desc="Best for posture, weight shift, balance, and rotation."
          illustration={<FaceOnIllustration />}
        />
      </div>

      <button
        onClick={onNext}
        disabled={!angle}
        className="mt-6 w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.97]"
        style={{
          background: angle ? "linear-gradient(135deg, #1B5E20, #2E7D32)" : "#F3F4F6",
          color: angle ? "#FFFFFF" : "#9CA3AF",
          boxShadow: angle ? "0 6px 20px rgba(27,94,32,0.3)" : "none",
        }}
      >
        Continue
      </button>
    </div>
  );
}

function AngleCard({
  selected, onSelect, title, desc, illustration,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  desc: string;
  illustration: React.ReactNode;
}) {
  return (
    <button
      onClick={onSelect}
      className="w-full text-left rounded-3xl p-5 flex items-center gap-4 transition-all duration-150 active:scale-[0.98]"
      style={{
        background: selected ? "#F0FDF4" : "#FAFAFA",
        border: selected ? "2px solid #2E7D32" : "2px solid #E5E7EB",
        boxShadow: selected ? "0 4px 16px rgba(27,94,32,0.12)" : "none",
      }}
    >
      <div className="shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: selected ? "#DCF5DC" : "#F3F4F6" }}>
        {illustration}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-base font-bold mb-1" style={{ color: selected ? "#1B5E20" : "#111111", letterSpacing: "-0.01em" }}>
          {title}
        </p>
        <p className="text-xs leading-snug" style={{ color: selected ? "#2E7D32" : "#9CA3AF" }}>{desc}</p>
      </div>
      <div
        className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all"
        style={{ background: selected ? "#2E7D32" : "#E5E7EB" }}
      >
        {selected && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
    </button>
  );
}

// ─── Step 2: Setup Guide ─────────────────────────────────────────────────────

function StepTwo({
  config,
  onNext,
}: {
  config: (typeof ANGLE_CONFIG)[Angle];
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto px-5 pt-7 pb-8">
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#9CA3AF" }}>
          Step 2 of 3 · {config.label}
        </p>
        <h1 className="text-2xl font-extrabold mb-2" style={{ color: "#111111", letterSpacing: "-0.03em" }}>
          Position Your Camera
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{config.tagline}</p>
      </div>

      {/* Visual frame guide */}
      <div className="relative rounded-3xl overflow-hidden mb-6 flex items-center justify-center"
        style={{ height: 180, background: "#0F1A10" }}>
        {/* Dashed framing box */}
        <div className="absolute rounded-xl" style={{
          inset: "20px 40px",
          border: "2px dashed rgba(166,255,140,0.4)",
        }} />
        {/* Center line */}
        <div className="absolute top-5 bottom-5 left-1/2 -translate-x-px w-px"
          style={{ background: "rgba(166,255,140,0.25)" }} />
        {/* Golfer silhouette */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-4 h-4 rounded-full mb-1" style={{ background: "rgba(166,255,140,0.5)" }} />
          <div className="w-1 h-10 rounded-full" style={{ background: "rgba(166,255,140,0.4)" }} />
          <div className="w-8 h-1 rounded-full -mt-5 rotate-12" style={{ background: "rgba(166,255,140,0.35)" }} />
        </div>
        <p className="absolute bottom-3 left-0 right-0 text-center text-[10px] font-semibold"
          style={{ color: "rgba(166,255,140,0.6)" }}>
          Keep entire body in frame
        </p>
      </div>

      {/* Tips */}
      <div className="rounded-3xl p-5 mb-6 flex flex-col gap-3"
        style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
        {config.tips.map((tip) => (
          <div key={tip} className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center"
              style={{ background: "#F0FDF4" }}>
              <CheckIcon size={12} stroke="#2E7D32" strokeWidth={2.5} />
            </div>
            <p className="text-sm font-medium" style={{ color: "#374151" }}>{tip}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        className="w-full h-14 rounded-2xl font-bold text-base text-white flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
        style={{ background: "linear-gradient(135deg, #1B5E20, #2E7D32)", boxShadow: "0 6px 20px rgba(27,94,32,0.3)" }}
      >
        Ready — Show Camera
      </button>
    </div>
  );
}

// ─── Step 3: Capture ─────────────────────────────────────────────────────────

function StepThree({
  config,
  onRecord,
  onUpload,
}: {
  config: (typeof ANGLE_CONFIG)[Angle];
  onRecord: () => void;
  onUpload: () => void;
}) {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto px-5 pt-7 pb-8">
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#9CA3AF" }}>
          Step 3 of 3 · {config.label}
        </p>
        <h1 className="text-2xl font-extrabold mb-2" style={{ color: "#111111", letterSpacing: "-0.03em" }}>
          Record Your Swing
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
          Tap Record Now to open your camera with the correct setup.
        </p>
      </div>

      {/* Viewfinder guide */}
      <div className="relative rounded-3xl overflow-hidden mb-6"
        style={{ height: 220, background: "linear-gradient(160deg, #0A1A0B, #0F2210)" }}>
        {/* Corner brackets */}
        {["top-4 left-6", "top-4 right-6", "bottom-4 left-6", "bottom-4 right-6"].map((pos, i) => (
          <div key={i} className={`absolute w-5 h-5 ${pos}`} style={{
            borderTop: i < 2 ? "2px solid rgba(166,255,140,0.5)" : "none",
            borderBottom: i >= 2 ? "2px solid rgba(166,255,140,0.5)" : "none",
            borderLeft: i % 2 === 0 ? "2px solid rgba(166,255,140,0.5)" : "none",
            borderRight: i % 2 === 1 ? "2px solid rgba(166,255,140,0.5)" : "none",
          }} />
        ))}
        {/* Safe zone box */}
        <div className="absolute rounded-lg" style={{
          inset: "28px 32px",
          border: "1px dashed rgba(166,255,140,0.2)",
        }} />
        {/* Center line */}
        <div className="absolute top-7 bottom-7 left-1/2 -translate-x-px w-px"
          style={{ background: "rgba(166,255,140,0.15)" }} />
        {/* Tip text */}
        <div className="absolute top-0 left-0 right-0 flex justify-center pt-3">
          <span className="text-[10px] font-semibold px-3 py-1 rounded-full"
            style={{ background: "rgba(166,255,140,0.15)", color: "rgba(166,255,140,0.8)" }}>
            Keep entire body and club in frame
          </span>
        </div>
        {/* Label */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center">
          <span className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>
            {config.guideLabel}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={onRecord}
          className="w-full h-14 rounded-2xl font-bold text-base text-white flex items-center justify-center gap-3 active:scale-[0.97] transition-transform"
          style={{ background: "linear-gradient(135deg, #1B5E20, #2E7D32)", boxShadow: "0 6px 20px rgba(27,94,32,0.3)" }}
        >
          <CameraIcon />
          Record Now
        </button>
        <button
          onClick={onUpload}
          className="w-full h-12 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
          style={{ background: "#F1F8E9", border: "1.5px solid #C8E6C9", color: "#1B5E20" }}
        >
          Upload from Library
        </button>
      </div>
    </div>
  );
}

// ─── Inline icons / illustrations ────────────────────────────────────────────

function DTLIllustration() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="8" r="4" fill="#2E7D32" opacity="0.7" />
      <rect x="16" y="13" width="4" height="12" rx="2" fill="#2E7D32" opacity="0.6" />
      <rect x="10" y="17" width="8" height="3" rx="1.5" fill="#2E7D32" opacity="0.5" />
      <rect x="20" y="24" width="3" height="8" rx="1.5" fill="#2E7D32" opacity="0.5" transform="rotate(15 20 24)" />
      <rect x="15" y="24" width="3" height="8" rx="1.5" fill="#2E7D32" opacity="0.5" transform="rotate(-5 15 24)" />
      <rect x="2" y="16" width="6" height="4" rx="1" fill="#1B5E20" opacity="0.4" />
      <circle cx="5" cy="18" r="1" fill="#2E7D32" opacity="0.7" />
    </svg>
  );
}

function FaceOnIllustration() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="8" r="4" fill="#2E7D32" opacity="0.7" />
      <rect x="16" y="13" width="4" height="12" rx="2" fill="#2E7D32" opacity="0.6" />
      <rect x="12" y="16" width="12" height="3" rx="1.5" fill="#2E7D32" opacity="0.5" />
      <rect x="20" y="24" width="3" height="8" rx="1.5" fill="#2E7D32" opacity="0.5" />
      <rect x="15" y="24" width="3" height="8" rx="1.5" fill="#2E7D32" opacity="0.5" />
      <rect x="27" y="14" width="6" height="4" rx="1" fill="#1B5E20" opacity="0.4" />
      <circle cx="30" cy="16" r="1" fill="#2E7D32" opacity="0.7" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 7l-7 5 7 5V7z" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}
