"use client";

import { useState } from "react";
import { GolfFlagIcon } from "@/components/icons";
import { useAuth } from "@/lib/auth";

type Mode = "signin" | "signup";

export function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        if (!name.trim()) { setError("Please enter your name."); setLoading(false); return; }
        await signUp(name.trim(), email.trim(), password);
      } else {
        await signIn(email.trim(), password);
      }
    } catch (err: unknown) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setMode(mode === "signin" ? "signup" : "signin");
    setError("");
    setName("");
    setEmail("");
    setPassword("");
  }

  return (
    <div className="flex flex-col h-full items-center justify-center px-6 bg-white">
      {/* Logo */}
      <div className="flex flex-col items-center mb-10">
        <div
          className="w-16 h-16 rounded-3xl flex items-center justify-center mb-4"
          style={{ background: "linear-gradient(135deg, #1B5E20, #2E7D32)", boxShadow: "0 8px 24px rgba(27,94,32,0.3)" }}
        >
          <GolfFlagIcon size={28} stroke="#FFFFFF" strokeWidth={2.2} />
        </div>
        <h1 className="text-3xl font-extrabold" style={{ color: "#111111", letterSpacing: "-0.03em" }}>ImpactAI</h1>
        <p className="text-sm mt-1" style={{ color: "#9CA3AF" }}>Your personal golf swing coach</p>
      </div>

      {/* Card */}
      <div className="w-full" style={{ maxWidth: "380px" }}>
        <div className="rounded-3xl p-7" style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <h2 className="text-xl font-extrabold mb-1" style={{ color: "#111111", letterSpacing: "-0.02em" }}>
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-sm mb-6" style={{ color: "#9CA3AF" }}>
            {mode === "signin" ? "Sign in to continue analyzing your swing." : "Join ImpactAI and start improving your game."}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {mode === "signup" && (
              <Field label="Full Name" type="text" value={name} onChange={setName} placeholder="Michael M." autoComplete="name" />
            )}
            <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" autoComplete="email" />
            <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" autoComplete={mode === "signin" ? "current-password" : "new-password"} />

            {error && (
              <p className="text-xs px-3 py-2.5 rounded-xl" style={{ color: "#DC2626", background: "#FEF2F2", border: "1px solid #FECACA" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="h-12 rounded-2xl font-bold text-sm text-white mt-1 transition-opacity active:scale-95"
              style={{
                background: "linear-gradient(135deg, #1B5E20, #2E7D32)",
                boxShadow: "0 4px 16px rgba(27,94,32,0.3)",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm mt-5" style={{ color: "#9CA3AF" }}>
          {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={switchMode} className="font-semibold" style={{ color: "#1B5E20" }}>
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

function Field({
  label, type, value, onChange, placeholder, autoComplete,
}: {
  label: string; type: string; value: string;
  onChange: (v: string) => void; placeholder: string; autoComplete?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all"
        style={{
          background: "#F9FAFB",
          border: "1px solid #E5E7EB",
          color: "#111111",
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "#2E7D32"; e.currentTarget.style.background = "#FFFFFF"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.background = "#F9FAFB"; }}
      />
    </div>
  );
}

function friendlyError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? "";
  const map: Record<string, string> = {
    "auth/user-not-found": "No account found with that email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/network-request-failed": "Network error. Check your connection.",
  };
  return map[code] ?? "Something went wrong. Please try again.";
}
