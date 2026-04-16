"use client";

import { useState, useEffect } from "react";
import { GolfFlagIcon } from "@/components/icons";
import { useAuth } from "@/lib/auth";

type Mode = "signin" | "signup";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: Props) {
  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Close when user signs in
  useEffect(() => {
    if (user && open) onClose();
  }, [user, open, onClose]);

  if (!open) return null;

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

  async function handleGoogle() {
    setError("");
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      setError(friendlyError(err));
    } finally {
      setGoogleLoading(false);
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
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full md:w-auto md:min-w-96 rounded-t-3xl md:rounded-3xl p-7 animate-fade-in"
        style={{ background: "#FFFFFF", boxShadow: "0 -4px 40px rgba(0,0,0,0.12)" }}
      >
        {/* Drag handle (mobile) */}
        <div className="md:hidden w-10 h-1 rounded-full mx-auto mb-6" style={{ background: "#E5E7EB" }} />

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #1B5E20, #2E7D32)" }}
          >
            <GolfFlagIcon size={18} stroke="#FFFFFF" strokeWidth={2.2} />
          </div>
          <div>
            <h2 className="text-lg font-extrabold leading-tight" style={{ color: "#111111", letterSpacing: "-0.02em" }}>
              {mode === "signin" ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-xs" style={{ color: "#9CA3AF" }}>
              {mode === "signin" ? "Sign in to save your progress" : "Start improving your game"}
            </p>
          </div>
        </div>

        {/* Google button */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          className="w-full h-12 rounded-2xl flex items-center justify-center gap-3 text-sm font-semibold mb-4 transition-colors hover:bg-gray-50 active:scale-95"
          style={{ border: "1px solid #E5E7EB", color: "#374151", opacity: googleLoading ? 0.6 : 1 }}
        >
          {googleLoading ? (
            <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#9CA3AF", borderTopColor: "transparent" }} />
          ) : (
            <GoogleIcon />
          )}
          {googleLoading ? "Signing in…" : "Continue with Google"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px" style={{ background: "#F3F4F6" }} />
          <span className="text-xs font-medium" style={{ color: "#D1D5DB" }}>or</span>
          <div className="flex-1 h-px" style={{ background: "#F3F4F6" }} />
        </div>

        {/* Email/password form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === "signup" && (
            <Field label="Full Name" type="text" value={name} onChange={setName} placeholder="Your name" autoComplete="name" />
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
            className="h-12 rounded-2xl font-bold text-sm text-white mt-1 active:scale-95 transition-transform"
            style={{
              background: "linear-gradient(135deg, #1B5E20, #2E7D32)",
              boxShadow: "0 4px 16px rgba(27,94,32,0.3)",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* Switch mode */}
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
        style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", color: "#111111" }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "#2E7D32"; e.currentTarget.style.background = "#FFFFFF"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.background = "#F9FAFB"; }}
      />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
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
    "auth/popup-closed-by-user": "Sign-in cancelled.",
    "auth/popup-blocked": "Popup blocked by browser. Please allow popups.",
  };
  return map[code] ?? "Something went wrong. Please try again.";
}
