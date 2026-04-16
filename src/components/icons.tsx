// Shared SVG icon library — no emojis anywhere in the app

interface IconProps {
  size?: number;
  stroke?: string;
  strokeWidth?: number;
  className?: string;
}

const defaults = (p: IconProps) => ({
  width: p.size ?? 20,
  height: p.size ?? 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: p.stroke ?? "currentColor",
  strokeWidth: p.strokeWidth ?? 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: p.className,
});

export function GolfFlagIcon(p: IconProps) {
  return (
    <svg {...defaults(p)}>
      {/* flagpole */}
      <line x1="6" y1="3" x2="6" y2="21" />
      {/* flag */}
      <polyline points="6 3 18 7 6 11" />
      {/* ground / hole */}
      <ellipse cx="6" cy="21" rx="4" ry="1.5" />
    </svg>
  );
}

export function SwingIcon(p: IconProps) {
  // Stylised golfer silhouette — arc + club shaft
  return (
    <svg {...defaults(p)}>
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7 C9 10 7 13 8 17" />
      <path d="M12 7 C15 10 17 13 16 17" />
      <path d="M8 17 Q12 20 16 17" />
      <path d="M10 13 L5 18" />
    </svg>
  );
}

export function ClipboardIcon(p: IconProps) {
  return (
    <svg {...defaults(p)}>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="13" y2="16" />
    </svg>
  );
}

export function UserIcon(p: IconProps) {
  return (
    <svg {...defaults(p)}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function TargetIcon(p: IconProps) {
  return (
    <svg {...defaults(p)}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

export function ActivityIcon(p: IconProps) {
  return (
    <svg {...defaults(p)}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

export function ZapIcon(p: IconProps) {
  return (
    <svg {...defaults(p)}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

export function VideoIcon(p: IconProps) {
  return (
    <svg {...defaults(p)}>
      <path d="M23 7l-7 5 7 5V7z" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}

export function CpuIcon(p: IconProps) {
  return (
    <svg {...defaults(p)}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  );
}

export function DumbbellIcon(p: IconProps) {
  return (
    <svg {...defaults(p)}>
      <path d="M6 5v14" />
      <path d="M18 5v14" />
      <path d="M3 8h3" />
      <path d="M3 16h3" />
      <path d="M18 8h3" />
      <path d="M18 16h3" />
      <line x1="6" y1="12" x2="18" y2="12" />
    </svg>
  );
}

export function LightbulbIcon(p: IconProps) {
  return (
    <svg {...defaults(p)}>
      <line x1="9" y1="18" x2="15" y2="18" />
      <line x1="10" y1="22" x2="14" y2="22" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  );
}

export function FilmIcon(p: IconProps) {
  return (
    <svg {...defaults(p)}>
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
      <line x1="7" y1="2" x2="7" y2="22" />
      <line x1="17" y1="2" x2="17" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="2" y1="7" x2="7" y2="7" />
      <line x1="2" y1="17" x2="7" y2="17" />
      <line x1="17" y1="17" x2="22" y2="17" />
      <line x1="17" y1="7" x2="22" y2="7" />
    </svg>
  );
}

export function CalendarIcon(p: IconProps) {
  return (
    <svg {...defaults(p)}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export function BarChartIcon(p: IconProps) {
  return (
    <svg {...defaults(p)}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  );
}

export function StarIcon(p: IconProps) {
  return (
    <svg {...defaults(p)}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function LockIcon(p: IconProps) {
  return (
    <svg {...defaults(p)}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export function FileTextIcon(p: IconProps) {
  return (
    <svg {...defaults(p)}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

export function MessageIcon(p: IconProps) {
  return (
    <svg {...defaults(p)}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function CheckIcon(p: IconProps) {
  return (
    <svg {...defaults(p)}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function ArrowRightIcon(p: IconProps) {
  return (
    <svg {...defaults(p)}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function TrendUpIcon(p: IconProps) {
  return (
    <svg {...defaults(p)}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

export function ShieldIcon(p: IconProps) {
  return (
    <svg {...defaults(p)}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export function UploadIcon(p: IconProps) {
  return (
    <svg {...defaults(p)}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

export function RefreshIcon(p: IconProps) {
  return (
    <svg {...defaults(p)}>
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

export function SearchPlusIcon(p: IconProps) {
  return (
    <svg {...defaults(p)}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}
