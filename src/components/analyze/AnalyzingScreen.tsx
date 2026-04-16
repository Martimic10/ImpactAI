"use client";

import { useEffect, useState } from "react";
import { GolfFlagIcon } from "@/components/icons";

const STEPS = [
  "Detecting swing path",
  "Checking clubface angle",
  "Evaluating body position",
  "Generating coaching feedback",
];

export function AnalyzingScreen() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timings = [800, 1600, 2400];
    const timers = timings.map((delay, i) => setTimeout(() => setActiveStep(i + 1), delay));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <div className="flex flex-col items-center justify-center flex-1 px-8 py-16 animate-fade-in">
        <div className="mb-10 relative flex items-center justify-center">
          <div
            className="w-24 h-24 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: "#E5E7EB", borderTopColor: "#1B5E20" }}
          />
          <div className="absolute">
            <GolfFlagIcon size={28} stroke="#1B5E20" strokeWidth={2} />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-2 text-center" style={{ color: "#111111", letterSpacing: "-0.01em" }}>
          Analyzing your swing…
        </h2>
        <p className="text-sm mb-10" style={{ color: "#6B7280" }}>Our AI coach is reviewing your footage</p>

        <div className="w-full flex flex-col gap-3" style={{ maxWidth: "340px" }}>
          {STEPS.map((step, i) => {
            const done = i < activeStep;
            const active = i === activeStep;
            return (
              <div
                key={step}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-500"
                style={{
                  background: done ? "#F1F8E9" : active ? "#FAFAFA" : "transparent",
                  opacity: i > activeStep ? 0.35 : 1,
                }}
              >
                <div
                  className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    background: done ? "#2E7D32" : active ? "#E5E7EB" : "transparent",
                    border: active ? "2px solid #2E7D32" : "none",
                  }}
                >
                  {done ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : active ? (
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#2E7D32" }} />
                  ) : (
                    <div className="w-2 h-2 rounded-full" style={{ background: "#D1D5DB" }} />
                  )}
                </div>
                <span className="text-sm font-medium" style={{ color: done ? "#1B5E20" : active ? "#111111" : "#9CA3AF" }}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
