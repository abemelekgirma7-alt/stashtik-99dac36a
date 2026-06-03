import { Link } from "@tanstack/react-router";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dim = size === "lg" ? "h-12 w-12" : size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const text = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <LogoMark className={dim} />
      <span className={`${text} font-extrabold tracking-tight`}>
        <span className="text-brand-gradient">Stash</span>
        <span className="text-foreground">Tik</span>
      </span>
    </Link>
  );
}

export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <span className={`relative inline-flex flex-none ${className}`}>
      <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="h-full w-full drop-shadow-[0_6px_18px_rgba(255,0,80,0.35)]">
        <defs>
          <linearGradient id="stMarkGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF0050" />
            <stop offset="100%" stopColor="#FF6B00" />
          </linearGradient>
        </defs>
        {/* Squircle brand tile */}
        <rect x="2" y="2" width="44" height="44" rx="13" fill="url(#stMarkGrad)" />
        {/* Stylized download arrow into tray (S-stash motif) */}
        <path
          d="M24 11.5 V26 M17.5 21 L24 27.5 L30.5 21"
          fill="none"
          stroke="white"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 32 H34 V35.5 a2.5 2.5 0 0 1 -2.5 2.5 H16.5 a2.5 2.5 0 0 1 -2.5 -2.5 Z"
          fill="white"
          fillOpacity="0.95"
        />
      </svg>
    </span>
  );
}
