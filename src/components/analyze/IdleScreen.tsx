"use client";

import { useRef } from "react";
import {
  TargetIcon, SwingIcon, ActivityIcon, ZapIcon,
  VideoIcon, CpuIcon, ClipboardIcon,
  UploadIcon, VideoIcon as RecordIcon,
  CheckIcon,
} from "@/components/icons";

interface IdleScreenProps {
  onFileSelected: (file: File) => void;
  onOpenCaptureAssistant: () => void;
}

const FEATURES = [
  { icon: <TargetIcon size={22} stroke="#1B5E20" strokeWidth={1.8} />, label: "Swing Path", desc: "In-to-out vs over-the-top" },
  { icon: <SwingIcon size={22} stroke="#1B5E20" strokeWidth={1.8} />, label: "Clubface Angle", desc: "Open, closed, or square" },
  { icon: <ActivityIcon size={22} stroke="#1B5E20" strokeWidth={1.8} />, label: "Body Position", desc: "Posture, spine, hip turn" },
  { icon: <ZapIcon size={22} stroke="#1B5E20" strokeWidth={1.8} />, label: "Impact Zone", desc: "Contact quality & timing" },
];

const STEPS = [
  { step: "1", title: "Upload your swing", desc: "Any angle — down-the-line or face-on", icon: <VideoIcon size={20} stroke="#A5D6A7" strokeWidth={1.8} /> },
  { step: "2", title: "AI scans your video", desc: "Detects path, face angle, body mechanics", icon: <CpuIcon size={20} stroke="#A5D6A7" strokeWidth={1.8} /> },
  { step: "3", title: "Get your coaching plan", desc: "Clear fixes and drills to improve fast", icon: <ClipboardIcon size={20} stroke="#A5D6A7" strokeWidth={1.8} /> },
];

const STEPS_MOBILE = [
  { step: "1", title: "Upload your swing", desc: "Any angle — down-the-line or face-on", icon: <VideoIcon size={20} stroke="#6B7280" strokeWidth={1.8} /> },
  { step: "2", title: "AI scans your video", desc: "Detects path, face angle, body mechanics", icon: <CpuIcon size={20} stroke="#6B7280" strokeWidth={1.8} /> },
  { step: "3", title: "Get your coaching plan", desc: "Clear fixes and drills to improve fast", icon: <ClipboardIcon size={20} stroke="#6B7280" strokeWidth={1.8} /> },
];

const STATS = [
  { value: "3 sec", label: "Avg. analysis" },
  { value: "92%", label: "Accuracy" },
  { value: "10+", label: "Swing faults" },
];

const TIPS = [
  "Film from down-the-line or face-on for best results",
  "Ensure good lighting so your full body is visible",
  "Keep the camera steady throughout the swing",
];

export function IdleScreen({ onFileSelected, onOpenCaptureAssistant }: IdleScreenProps) {
  const uploadRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
    e.target.value = "";
  };

  return (
    <>
      {/* ── MOBILE ── */}
      <div className="md:hidden flex flex-col flex-1 overflow-y-auto">
        <MobileHero />
        <div className="px-5 pt-6 pb-4 flex flex-col gap-3">
          <UploadButton onClick={() => uploadRef.current?.click()} />
          <RecordButton onClick={onOpenCaptureAssistant} />
        </div>
        <div className="px-5 pb-4">
          <SectionLabel>What ImpactAI Analyzes</SectionLabel>
          <div className="grid grid-cols-2 gap-2.5">
            {FEATURES.map((f) => <FeatureCard key={f.label} icon={f.icon} label={f.label} desc={f.desc} />)}
          </div>
        </div>
        <div className="px-5 pb-6">
          <SectionLabel>How It Works</SectionLabel>
          <StepsList steps={STEPS_MOBILE} />
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        {/* Left hero panel */}
        <div
          className="relative flex flex-col justify-between p-10 overflow-hidden shrink-0"
          style={{ width: "420px", background: "linear-gradient(160deg, #0A3A0F 0%, #1B5E20 45%, #2E7D32 80%, #388E3C 100%)" }}
        >
          <div className="absolute -top-16 -right-16 rounded-full opacity-10" style={{ width: 260, height: 260, background: "#66BB6A" }} />
          <div className="absolute top-20 right-8 rounded-full opacity-10" style={{ width: 120, height: 120, background: "#A5D6A7" }} />
          <div className="absolute -bottom-10 -left-10 rounded-full opacity-10" style={{ width: 200, height: 200, background: "#1B5E20" }} />

          <div>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: "rgba(255,255,255,0.15)", color: "#A5D6A7" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-300 inline-block animate-pulse" />
              AI Powered Coaching
            </span>
          </div>

          <div>
            <h1 className="text-5xl font-extrabold leading-[1.05] text-white mb-4" style={{ letterSpacing: "-0.04em" }}>
              Improve Your<br />Golf Swing.
            </h1>
            <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.68)", maxWidth: "300px" }}>
              Upload a video and get instant, personalized coaching feedback — just like having a PGA pro on your bag.
            </p>
            <div className="flex gap-8">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-bold text-white" style={{ letterSpacing: "-0.03em" }}>{s.value}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
              How It Works
            </p>
            <div className="flex flex-col gap-4">
              {STEPS.map((s) => (
                <div key={s.step} className="flex items-start gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-black"
                    style={{ background: "rgba(255,255,255,0.12)", color: "#A5D6A7" }}
                  >
                    {s.step}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{s.title}</p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col flex-1 overflow-y-auto p-8" style={{ background: "#F7F8FA" }}>
          <div
            className="rounded-3xl p-7 mb-6"
            style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
          >
            <h2 className="text-xl font-bold mb-1" style={{ color: "#111111", letterSpacing: "-0.02em" }}>Analyze a Swing</h2>
            <p className="text-sm mb-6" style={{ color: "#6B7280" }}>Upload a video or record directly with your camera.</p>
            <div className="flex flex-col gap-3">
              <UploadButton onClick={() => uploadRef.current?.click()} />
              <RecordButton onClick={onOpenCaptureAssistant} />
            </div>
            <p className="text-xs mt-4 text-center" style={{ color: "#D1D5DB" }}>Supports MP4, MOV, AVI · Up to 500 MB</p>
          </div>

          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#9CA3AF" }}>What We Analyze</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {FEATURES.map((f) => <FeatureCard key={f.label} icon={f.icon} label={f.label} desc={f.desc} />)}
          </div>

          <div className="rounded-2xl p-5" style={{ background: "#F0FDF4", border: "1px solid #C8E6C9" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#15803D" }}>
              Tips for the Best Analysis
            </p>
            <ul className="flex flex-col gap-2">
              {TIPS.map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-sm" style={{ color: "#166534" }}>
                  <CheckIcon size={14} stroke="#4CAF50" strokeWidth={2.5} className="mt-0.5 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <input ref={uploadRef} type="file" accept="video/*" className="hidden" onChange={handleFile} />
    </>
  );
}

function MobileHero() {
  return (
    <div
      className="relative flex flex-col justify-end px-5 pt-10 pb-7 overflow-hidden"
      style={{ minHeight: "340px", background: "linear-gradient(160deg, #0A3A0F 0%, #1B5E20 40%, #2E7D32 75%, #388E3C 100%)" }}
    >
      <div className="absolute -top-15 -right-15 rounded-full opacity-10" style={{ width: 220, height: 220, background: "#66BB6A" }} />
      <div className="absolute top-7.5 right-5 rounded-full opacity-15" style={{ width: 100, height: 100, background: "#A5D6A7" }} />
      <div className="absolute -bottom-7.5 -left-10 rounded-full opacity-10" style={{ width: 160, height: 160, background: "#1B5E20" }} />
      <div className="mb-5">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
          style={{ background: "rgba(255,255,255,0.15)", color: "#A5D6A7" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-300 inline-block animate-pulse" />
          AI Powered Coaching
        </span>
      </div>
      <h1 className="text-[2.4rem] font-extrabold leading-[1.1] text-white mb-3" style={{ letterSpacing: "-0.03em" }}>
        Improve Your<br />Golf Swing.
      </h1>
      <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.72)", maxWidth: "280px" }}>
        Upload a video and get instant, personalized coaching feedback.
      </p>
      <div className="flex gap-5">
        {STATS.map((s) => (
          <div key={s.label}>
            <p className="text-xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>{s.value}</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#9CA3AF" }}>{children}</p>;
}

function FeatureCard({ icon, label, desc }: { icon: React.ReactNode; label: string; desc: string }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: "#FFFFFF", border: "1px solid #E5E7EB" }}>
      <div className="mb-2">{icon}</div>
      <p className="text-sm font-semibold mb-0.5" style={{ color: "#111111" }}>{label}</p>
      <p className="text-xs leading-snug" style={{ color: "#9CA3AF" }}>{desc}</p>
    </div>
  );
}

function StepsList({ steps }: { steps: typeof STEPS_MOBILE }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #E5E7EB" }}>
      {steps.map((item, i) => (
        <div
          key={item.step}
          className="flex items-start gap-4 px-4 py-4"
          style={{ borderTop: i > 0 ? "1px solid #E5E7EB" : "none", background: "#FFFFFF" }}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-black"
            style={{ background: "#F1F8E9", color: "#1B5E20" }}>
            {item.step}
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-sm font-semibold mb-0.5" style={{ color: "#111111" }}>{item.title}</p>
            <p className="text-xs leading-snug" style={{ color: "#9CA3AF" }}>{item.desc}</p>
          </div>
          <span className="shrink-0 pt-0.5">{item.icon}</span>
        </div>
      ))}
    </div>
  );
}

function UploadButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full h-14.5 rounded-2xl font-bold text-[15px] text-white flex items-center justify-center gap-2.5 active:scale-[0.97] transition-transform duration-100"
      style={{ background: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)", boxShadow: "0 6px 20px rgba(27, 94, 32, 0.35)" }}
    >
      <UploadIcon size={19} stroke="#FFFFFF" strokeWidth={2.5} />
      Upload Swing Video
    </button>
  );
}

function RecordButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full h-14.5 rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2.5 active:scale-[0.97] transition-transform duration-100"
      style={{ color: "#1B5E20", background: "#F1F8E9", border: "1.5px solid #C8E6C9" }}
    >
      <RecordIcon size={19} stroke="#1B5E20" strokeWidth={2.5} />
      Record with Camera
    </button>
  );
}
