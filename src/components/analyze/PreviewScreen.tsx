"use client";

import { useRef, useState } from "react";

interface Props {
  videoUrl: string;
  onConfirm: () => void;
  onRetake: () => void;
  onCancel: () => void;
}

export function PreviewScreen({ videoUrl, onConfirm, onRetake, onCancel }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-black">
      {/* Video area */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-contain"
          playsInline
          muted
          loop
          onEnded={() => setPlaying(false)}
        />

        {/* Play/Pause overlay */}
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center"
        >
          {!playing && (
            <div className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          )}
        </button>

        {/* Top label */}
        <div className="absolute top-4 left-0 right-0 flex justify-center pointer-events-none">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ background: "rgba(0,0,0,0.55)", color: "rgba(255,255,255,0.85)", backdropFilter: "blur(4px)" }}>
            Preview — Tap to play
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="shrink-0 px-5 pt-5 pb-8 flex flex-col gap-3"
        style={{ background: "#0A0A0A", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <p className="text-center text-sm font-semibold mb-1" style={{ color: "rgba(255,255,255,0.7)" }}>
          Happy with this swing?
        </p>
        <button
          onClick={onConfirm}
          className="w-full h-14 rounded-2xl font-bold text-base text-white flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
          style={{ background: "linear-gradient(135deg, #1B5E20, #2E7D32)", boxShadow: "0 6px 20px rgba(27,94,32,0.4)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Use This Swing
        </button>
        <div className="flex gap-3">
          <button
            onClick={onRetake}
            className="flex-1 h-12 rounded-2xl font-semibold text-sm active:scale-[0.97] transition-transform"
            style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            Retake
          </button>
          <button
            onClick={onCancel}
            className="flex-1 h-12 rounded-2xl font-semibold text-sm active:scale-[0.97] transition-transform"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
