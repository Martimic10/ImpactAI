"use client";

import { useState, useRef } from "react";
import Image from "next/image";
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
      <div className="relative rounded-3xl overflow-hidden mb-6"
        style={{ background: "linear-gradient(170deg, #0A1A0B 0%, #0F2210 60%, #0A1A0B 100%)" }}>
        {/* Top label */}
        <div className="absolute top-3 left-0 right-0 flex justify-center z-10">
          <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ background: "rgba(166,255,140,0.12)", color: "rgba(166,255,140,0.7)" }}>
            {config.guideLabel}
          </span>
        </div>

        {/* Main content row */}
        <div className="flex items-end justify-center gap-6 px-6 pt-10 pb-4">
          {/* Phone frame (portrait) */}
          <div className="relative flex flex-col items-center shrink-0">
            <div className="relative rounded-2xl flex items-center justify-center"
              style={{ width: 70, height: 120, border: "2.5px solid rgba(166,255,140,0.55)", background: "rgba(166,255,140,0.05)" }}>
              {/* Phone notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full"
                style={{ background: "rgba(166,255,140,0.3)" }} />
              {/* Golfer in frame */}
              <svg width="36" height="80" viewBox="0 0 36 80" fill="none">
                {/* Head */}
                <circle cx="18" cy="10" r="5" fill="rgba(166,255,140,0.6)" />
                {/* Torso */}
                <rect x="14" y="16" width="8" height="18" rx="3" fill="rgba(166,255,140,0.45)" />
                {/* Club arm */}
                <line x1="22" y1="22" x2="30" y2="30" stroke="rgba(166,255,140,0.5)" strokeWidth="2" strokeLinecap="round" />
                {/* Club shaft */}
                <line x1="30" y1="30" x2="34" y2="50" stroke="rgba(166,255,140,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                {/* Left leg */}
                <rect x="13" y="32" width="5" height="22" rx="2.5" fill="rgba(166,255,140,0.4)" />
                {/* Right leg */}
                <rect x="19" y="32" width="5" height="22" rx="2.5" fill="rgba(166,255,140,0.4)" />
                {/* Feet */}
                <rect x="11" y="52" width="8" height="3" rx="1.5" fill="rgba(166,255,140,0.35)" />
                <rect x="18" y="52" width="8" height="3" rx="1.5" fill="rgba(166,255,140,0.35)" />
                {/* Ground line */}
                <line x1="4" y1="57" x2="32" y2="57" stroke="rgba(166,255,140,0.2)" strokeWidth="1" />
              </svg>
              {/* Dashed frame overlay */}
              <div className="absolute rounded-xl" style={{ inset: "14px 6px 6px 6px", border: "1.5px dashed rgba(166,255,140,0.25)" }} />
            </div>
            <p className="text-[10px] font-semibold mt-2" style={{ color: "rgba(166,255,140,0.5)" }}>Your phone</p>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center gap-1 pb-6">
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: `rgba(166,255,140,${0.2 + i * 0.15})` }} />
              ))}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5h6M6 2l3 3-3 3" stroke="rgba(166,255,140,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-[9px] font-medium" style={{ color: "rgba(166,255,140,0.4)" }}>
              {config.lineDir === "vertical" ? "8–10 ft" : "10–12 ft"}
            </p>
          </div>

          {/* Golfer position */}
          <div className="flex flex-col items-center shrink-0 pb-2">
            <svg width="48" height="90" viewBox="0 0 48 90" fill="none">
              {/* Head */}
              <circle cx="24" cy="10" r="6" fill="rgba(255,255,255,0.15)" stroke="rgba(166,255,140,0.5)" strokeWidth="1.5" />
              {/* Torso */}
              <path d="M18 18 Q24 16 30 18 L28 38 Q24 40 20 38 Z" fill="rgba(166,255,140,0.2)" stroke="rgba(166,255,140,0.4)" strokeWidth="1" />
              {/* Club arm extended */}
              <line x1="28" y1="24" x2="42" y2="32" stroke="rgba(166,255,140,0.5)" strokeWidth="2" strokeLinecap="round" />
              {/* Club shaft */}
              <line x1="42" y1="32" x2="46" y2="60" stroke="rgba(166,255,140,0.35)" strokeWidth="1.5" strokeLinecap="round" />
              {/* Legs */}
              <path d="M20 38 L17 62" stroke="rgba(166,255,140,0.4)" strokeWidth="4" strokeLinecap="round" />
              <path d="M28 38 L31 62" stroke="rgba(166,255,140,0.4)" strokeWidth="4" strokeLinecap="round" />
              {/* Shoes */}
              <ellipse cx="16" cy="63" rx="5" ry="2" fill="rgba(166,255,140,0.3)" />
              <ellipse cx="32" cy="63" rx="5" ry="2" fill="rgba(166,255,140,0.3)" />
              {/* Ground */}
              <line x1="4" y1="66" x2="44" y2="66" stroke="rgba(166,255,140,0.2)" strokeWidth="1.5" />
              {/* Grass tufts */}
              <line x1="8" y1="66" x2="7" y2="62" stroke="rgba(166,255,140,0.2)" strokeWidth="1" />
              <line x1="14" y1="66" x2="13" y2="63" stroke="rgba(166,255,140,0.2)" strokeWidth="1" />
              <line x1="36" y1="66" x2="35" y2="62" stroke="rgba(166,255,140,0.2)" strokeWidth="1" />
            </svg>
            <p className="text-[10px] font-semibold" style={{ color: "rgba(166,255,140,0.5)" }}>You</p>
          </div>
        </div>

        {/* Bottom badge */}
        <div className="flex justify-center pb-4">
          <span className="text-[10px] font-semibold px-3 py-1.5 rounded-full"
            style={{ background: "rgba(166,255,140,0.1)", color: "rgba(166,255,140,0.6)", border: "1px solid rgba(166,255,140,0.15)" }}>
            Keep entire body in frame
          </span>
        </div>
      </div>

      {/* Tips */}
      <div className="rounded-3xl mb-6 overflow-hidden"
        style={{ border: "1px solid #E5E7EB" }}>
        {config.tips.map((tip, i) => (
          <div key={tip} className="flex items-center gap-3 px-5 py-3.5"
            style={{ borderTop: i > 0 ? "1px solid #F3F4F6" : "none", background: "#FFFFFF" }}>
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
    <Image
      src="/downtheline-removebg-preview.png"
      alt="Down the line"
      width={48}
      height={48}
      className="w-10 h-10 object-contain"
    />
  );
}

function FaceOnIllustration() {
  return (
    <Image
      src="/facingyou-removebg-preview.png"
      alt="Face on"
      width={48}
      height={48}
      className="w-10 h-10 object-contain invert"
    />
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
