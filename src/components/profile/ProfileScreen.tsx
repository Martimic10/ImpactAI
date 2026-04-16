"use client";

import { useState } from "react";
import {
  UserIcon, FilmIcon, TargetIcon, BarChartIcon, SwingIcon,
  LockIcon, FileTextIcon, MessageIcon,
  StarIcon, CheckIcon, ArrowRightIcon,
} from "@/components/icons";

const USER = {
  name: "Michael M.",
  email: "Martimicm1010@gmail.com",
  initials: "M",
  handicap: 14,
  plan: "Free",
  memberSince: "January 2026",
  swingsAnalyzed: 6,
  avgConfidence: 7,
  topFault: "Slice",
};

const STATS = [
  { label: "Swings Analyzed", value: String(USER.swingsAnalyzed), icon: <FilmIcon size={18} stroke="#1B5E20" strokeWidth={1.8} /> },
  { label: "Avg Confidence", value: `${USER.avgConfidence}/10`, icon: <TargetIcon size={18} stroke="#1B5E20" strokeWidth={1.8} /> },
  { label: "Top Fault", value: USER.topFault, icon: <BarChartIcon size={18} stroke="#1B5E20" strokeWidth={1.8} /> },
  { label: "Handicap", value: String(USER.handicap), icon: <SwingIcon size={18} stroke="#1B5E20" strokeWidth={1.8} /> },
];

const LINKS = [
  { icon: <LockIcon size={16} stroke="#6B7280" strokeWidth={2} />, label: "Privacy Policy" },
  { icon: <FileTextIcon size={16} stroke="#6B7280" strokeWidth={2} />, label: "Terms of Service" },
  { icon: <MessageIcon size={16} stroke="#6B7280" strokeWidth={2} />, label: "Send Feedback" },
];

type Section = "account" | "preferences" | "plan" | null;

export function ProfileScreen() {
  const [openSection, setOpenSection] = useState<Section>(null);
  const [notifications, setNotifications] = useState(true);
  const [tips, setTips] = useState(true);

  const toggleSection = (s: Section) => setOpenSection(openSection === s ? null : s);

  return (
    <>
      {/* ── MOBILE ── */}
      <div className="md:hidden flex flex-col flex-1 overflow-y-auto pb-6">
        {/* Avatar card */}
        <div
          className="mx-4 mt-5 mb-4 rounded-3xl p-5"
          style={{ background: "linear-gradient(135deg, #1B5E20, #2E7D32)", boxShadow: "0 8px 24px rgba(27,94,32,0.25)" }}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-extrabold text-white shrink-0"
              style={{ background: "rgba(255,255,255,0.2)" }}>
              {USER.initials}
            </div>
            <div>
              <p className="text-lg font-extrabold text-white" style={{ letterSpacing: "-0.02em" }}>{USER.name}</p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>{USER.email}</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                style={{ background: "rgba(255,255,255,0.2)", color: "#A5D6A7" }}>
                {USER.plan} Plan
              </span>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="flex gap-3 px-4 mb-4">
          {[
            { label: "Swings", value: String(USER.swingsAnalyzed) },
            { label: "Avg Score", value: `${USER.avgConfidence}/10` },
            { label: "Top Fault", value: USER.topFault },
          ].map((s) => (
            <div key={s.label} className="flex-1 rounded-2xl py-3 px-2 text-center"
              style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
              <p className="text-base font-extrabold" style={{ color: "#1B5E20", letterSpacing: "-0.02em" }}>{s.value}</p>
              <p className="text-[10px] mt-0.5" style={{ color: "#9CA3AF" }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col px-4 gap-3">
          <MobileSection id="account" open={openSection === "account"} onToggle={() => toggleSection("account")}
            icon={<UserIcon size={18} stroke="#374151" strokeWidth={2} />} title="Account" subtitle={USER.email}>
            <SettingRow label="Full Name" value={USER.name} />
            <SettingRow label="Email" value={USER.email} />
            <SettingRow label="Handicap" value={String(USER.handicap)} />
            <SettingRow label="Member Since" value={USER.memberSince} />
          </MobileSection>

          <MobileSection id="preferences" open={openSection === "preferences"} onToggle={() => toggleSection("preferences")}
            icon={<BarChartIcon size={18} stroke="#374151" strokeWidth={2} />} title="Preferences" subtitle="Notifications & tips">
            <ToggleRow label="Session Reminders" desc="Get reminded to analyze your swing" value={notifications} onChange={setNotifications} />
            <ToggleRow label="Weekly Tips" desc="Receive AI coaching tips each week" value={tips} onChange={setTips} />
          </MobileSection>

          <MobileSection id="plan" open={openSection === "plan"} onToggle={() => toggleSection("plan")}
            icon={<StarIcon size={18} stroke="#374151" strokeWidth={2} />} title="Subscription" subtitle="Free Plan · Upgrade available">
            <div className="p-4"><PlanCard /></div>
          </MobileSection>

          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #E5E7EB" }}>
            {LINKS.map((item, i) => (
              <button key={item.label} className="w-full flex items-center justify-between px-4 py-4 active:bg-gray-50"
                style={{ borderTop: i > 0 ? "1px solid #F3F4F6" : "none", background: "#FFFFFF" }}>
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-sm font-medium" style={{ color: "#374151" }}>{item.label}</span>
                </div>
                <ChevronRight />
              </button>
            ))}
          </div>

          <p className="text-center text-xs pt-2" style={{ color: "#D1D5DB" }}>ImpactAI v1.0.0</p>
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:flex flex-col flex-1 overflow-y-auto" style={{ background: "#F7F8FA" }}>
        <div className="px-8 pt-8 pb-6">
          <h1 className="text-2xl font-extrabold mb-1" style={{ color: "#111111", letterSpacing: "-0.03em" }}>Profile</h1>
          <p className="text-sm" style={{ color: "#9CA3AF" }}>Manage your account, preferences, and subscription.</p>
        </div>

        <div className="px-8 pb-8 grid grid-cols-3 gap-6 items-start">
          {/* Left column */}
          <div className="flex flex-col gap-4">
            <div className="rounded-3xl p-6" style={{ background: "linear-gradient(135deg, #1B5E20, #2E7D32)", boxShadow: "0 8px 24px rgba(27,94,32,0.25)" }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-extrabold text-white mb-4"
                style={{ background: "rgba(255,255,255,0.2)" }}>
                {USER.initials}
              </div>
              <p className="text-xl font-extrabold text-white mb-0.5" style={{ letterSpacing: "-0.03em" }}>{USER.name}</p>
              <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.6)" }}>{USER.email}</p>
              <div className="flex gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(255,255,255,0.15)", color: "#A5D6A7" }}>
                  {USER.plan} Plan
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(255,255,255,0.15)", color: "#A5D6A7" }}>
                  Since {USER.memberSince}
                </span>
              </div>
            </div>

            <div className="rounded-2xl p-5" style={{ background: "#FFFFFF", border: "1px solid #E5E7EB" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#9CA3AF" }}>Your Stats</p>
              <div className="flex flex-col gap-4">
                {STATS.map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {s.icon}
                      <p className="text-sm" style={{ color: "#6B7280" }}>{s.label}</p>
                    </div>
                    <p className="text-sm font-bold" style={{ color: "#111111" }}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden" style={{ background: "#FFFFFF", border: "1px solid #E5E7EB" }}>
              {LINKS.map((item, i) => (
                <button key={item.label} className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors"
                  style={{ borderTop: i > 0 ? "1px solid #F3F4F6" : "none" }}>
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-sm" style={{ color: "#374151" }}>{item.label}</span>
                  </div>
                  <ChevronRight />
                </button>
              ))}
            </div>
          </div>

          {/* Right two columns */}
          <div className="col-span-2 flex flex-col gap-4">
            <div className="rounded-2xl" style={{ background: "#FFFFFF", border: "1px solid #E5E7EB" }}>
              <div className="px-6 py-5" style={{ borderBottom: "1px solid #F3F4F6" }}>
                <p className="text-sm font-bold" style={{ color: "#111111" }}>Account Information</p>
                <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>Your personal details</p>
              </div>
              <div className="grid grid-cols-2">
                {[
                  { label: "Full Name", value: USER.name },
                  { label: "Email Address", value: USER.email },
                  { label: "Handicap Index", value: String(USER.handicap) },
                  { label: "Member Since", value: USER.memberSince },
                ].map((field, i) => (
                  <div key={field.label} className="px-6 py-4"
                    style={{ borderTop: i >= 2 ? "1px solid #F3F4F6" : "none", borderRight: i % 2 === 0 ? "1px solid #F3F4F6" : "none" }}>
                    <p className="text-xs font-medium mb-1" style={{ color: "#9CA3AF" }}>{field.label}</p>
                    <p className="text-sm font-semibold" style={{ color: "#111111" }}>{field.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl" style={{ background: "#FFFFFF", border: "1px solid #E5E7EB" }}>
              <div className="px-6 py-5" style={{ borderBottom: "1px solid #F3F4F6" }}>
                <p className="text-sm font-bold" style={{ color: "#111111" }}>Preferences</p>
                <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>Notifications and coaching settings</p>
              </div>
              <DesktopToggleRow label="Session Reminders" desc="Get reminded to analyze your swing weekly" value={notifications} onChange={setNotifications} border={false} />
              <DesktopToggleRow label="Weekly Coaching Tips" desc="Receive AI-generated tips based on your history" value={tips} onChange={setTips} border />
            </div>

            <div className="rounded-2xl" style={{ background: "#FFFFFF", border: "1px solid #E5E7EB" }}>
              <div className="px-6 py-5" style={{ borderBottom: "1px solid #F3F4F6" }}>
                <p className="text-sm font-bold" style={{ color: "#111111" }}>Subscription</p>
                <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>Your current plan and usage</p>
              </div>
              <div className="p-6"><PlanCard /></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function MobileSection({ open, onToggle, icon, title, subtitle, children }: {
  id: string; open: boolean; onToggle: () => void;
  icon: React.ReactNode; title: string; subtitle: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #E5E7EB", background: "#FFFFFF" }}>
      <button onClick={onToggle} className="w-full flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          {icon}
          <div className="text-left">
            <p className="text-sm font-semibold" style={{ color: "#111111" }}>{title}</p>
            <p className="text-xs" style={{ color: "#9CA3AF" }}>{subtitle}</p>
          </div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && <div className="animate-fade-in" style={{ borderTop: "1px solid #F3F4F6" }}>{children}</div>}
    </div>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: "1px solid #F9FAFB" }}>
      <p className="text-sm" style={{ color: "#6B7280" }}>{label}</p>
      <p className="text-sm font-semibold" style={{ color: "#111111" }}>{value}</p>
    </div>
  );
}

function ToggleRow({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5" style={{ borderTop: "1px solid #F9FAFB" }}>
      <div>
        <p className="text-sm font-medium" style={{ color: "#111111" }}>{label}</p>
        <p className="text-xs" style={{ color: "#9CA3AF" }}>{desc}</p>
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  );
}

function DesktopToggleRow({ label, desc, value, onChange, border }: {
  label: string; desc: string; value: boolean; onChange: (v: boolean) => void; border: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: border ? "1px solid #F3F4F6" : "none" }}>
      <div>
        <p className="text-sm font-semibold" style={{ color: "#111111" }}>{label}</p>
        <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>{desc}</p>
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)}
      className="relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0"
      style={{ background: value ? "#2E7D32" : "#E5E7EB" }}>
      <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
        style={{ transform: value ? "translateX(20px)" : "translateX(0px)" }} />
    </button>
  );
}

function PlanCard() {
  return (
    <div>
      <div className="rounded-2xl p-4 mb-3" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#9CA3AF" }}>Current Plan</p>
            <p className="text-lg font-extrabold" style={{ color: "#111111", letterSpacing: "-0.02em" }}>Free</p>
          </div>
          <SwingIcon size={28} stroke="#9CA3AF" strokeWidth={1.8} />
        </div>
        <div className="flex flex-col gap-1.5">
          {["5 swing analyses / month", "Basic coaching feedback", "Drill recommendations"].map((f) => (
            <div key={f} className="flex items-center gap-2 text-xs" style={{ color: "#6B7280" }}>
              <CheckIcon size={12} stroke="#4CAF50" strokeWidth={2.5} />
              {f}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl p-4" style={{ background: "linear-gradient(135deg, #1B5E20, #2E7D32)", boxShadow: "0 4px 16px rgba(27,94,32,0.25)" }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>Upgrade To</p>
            <p className="text-lg font-extrabold text-white" style={{ letterSpacing: "-0.02em" }}>Pro · $8/mo</p>
          </div>
          <StarIcon size={24} stroke="rgba(255,255,255,0.8)" strokeWidth={1.8} />
        </div>
        <div className="flex flex-col gap-1.5 mb-4">
          {["Unlimited swing analyses", "Advanced AI coaching", "Video progress tracking", "Priority support"].map((f) => (
            <div key={f} className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.8)" }}>
              <ArrowRightIcon size={12} stroke="#A5D6A7" strokeWidth={2.5} />
              {f}
            </div>
          ))}
        </div>
        <button className="w-full h-10 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
          style={{ background: "#FFFFFF", color: "#1B5E20" }}>
          Upgrade to Pro
        </button>
      </div>
    </div>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
