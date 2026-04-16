"use client";

import { useEffect, useState } from "react";

const STEPS = [
  "Reviewing setup position",
  "Detecting swing path",
  "Checking clubface angle",
  "Evaluating body motion",
  "Creating coaching plan",
];

export function AnalyzingScreen() {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    STEPS.forEach((_, i) => {
      // Mark each step active then complete
      timers.push(setTimeout(() => setActiveStep(i), i * 1200));
      if (i < STEPS.length - 1) {
        timers.push(setTimeout(() => setCompletedSteps((prev) => [...prev, i]), i * 1200 + 900));
      }
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex flex-col flex-1 items-center justify-center px-8 py-16 animate-fade-in">
      {/* Spinner */}
      <div className="relative mb-10 flex items-center justify-center">
        <div
          className="w-20 h-20 rounded-full border-[3px] border-t-transparent animate-spin"
          style={{ borderColor: "#E5E7EB", borderTopColor: "#1B5E20" }}
        />
        <div className="absolute w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #1B5E20, #2E7D32)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-extrabold mb-2 text-center" style={{ color: "#111111", letterSpacing: "-0.02em" }}>
        Analyzing your swing…
      </h2>
      <p className="text-sm mb-10 text-center" style={{ color: "#9CA3AF" }}>
        Your AI coach is reviewing the footage
      </p>

      {/* Steps */}
      <div className="w-full flex flex-col gap-2.5" style={{ maxWidth: "320px" }}>
        {STEPS.map((step, i) => {
          const done = completedSteps.includes(i);
          const active = i === activeStep && !done;
          const pending = i > activeStep;

          return (
            <div
              key={step}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-500"
              style={{
                background: done ? "#F0FDF4" : active ? "#FAFAFA" : "transparent",
                opacity: pending ? 0.3 : 1,
                transform: active ? "scale(1.02)" : "scale(1)",
              }}
            >
              <div
                className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  background: done ? "#2E7D32" : active ? "transparent" : "transparent",
                  border: active ? "2px solid #2E7D32" : done ? "none" : "2px solid #E5E7EB",
                }}
              >
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : active ? (
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#1B5E20" }} />
                ) : null}
              </div>
              <span
                className="text-sm font-semibold transition-colors duration-300"
                style={{ color: done ? "#15803D" : active ? "#111111" : "#9CA3AF" }}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
