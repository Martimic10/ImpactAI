"use client";

import { SwingIcon } from "@/components/icons";

interface UploadingScreenProps {
  progress: number;
}

export function UploadingScreen({ progress }: UploadingScreenProps) {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <div className="flex flex-col items-center justify-center flex-1 px-8 py-16 animate-fade-in">
        <div className="mb-8 relative">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center" style={{ background: "#F1F8E9" }}>
            <SwingIcon size={40} stroke="#2E7D32" strokeWidth={1.5} />
          </div>
          <div className="absolute inset-0 rounded-3xl animate-ping opacity-20" style={{ background: "#2E7D32" }} />
        </div>

        <h2 className="text-2xl font-bold mb-2 text-center" style={{ color: "#111111", letterSpacing: "-0.01em" }}>
          Uploading your swing…
        </h2>
        <p className="text-sm mb-8" style={{ color: "#6B7280" }}>This will only take a moment</p>

        <div className="w-full" style={{ maxWidth: "320px" }}>
          <div className="flex justify-between text-xs mb-2" style={{ color: "#9CA3AF" }}>
            <span>Uploading</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "#E5E7EB" }}>
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%`, background: "linear-gradient(90deg, #1B5E20, #66BB6A)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
