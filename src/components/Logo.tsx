import { Link } from "@tanstack/react-router";
import { Download } from "lucide-react";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dim = size === "lg" ? "h-12 w-12" : size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const text = size === "lg" ? "text-2xl" : "text-lg";
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <span
        className={`relative ${dim} flex-none rounded-2xl bg-brand-gradient p-[2px] shadow-brand transition-transform group-hover:scale-105`}
      >
        <span className="flex h-full w-full items-center justify-center rounded-[14px] bg-card">
          <Download
            aria-hidden
            className="h-1/2 w-1/2 text-brand-gradient-stroke transition-transform group-hover:translate-y-0.5"
            strokeWidth={2.6}
            style={{ stroke: "url(#logoGrad)" }}
          />
          <svg width="0" height="0" className="absolute">
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FF0050" />
                <stop offset="100%" stopColor="#FF6B00" />
              </linearGradient>
            </defs>
          </svg>
        </span>
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-brand-gradient shadow-[0_0_0_2px_var(--card)]" />
      </span>
      <span className={`${text} font-extrabold tracking-tight`}>
        <span className="text-brand-gradient">Snap</span>
        <span className="text-foreground">Tok</span>
      </span>
    </Link>
  );
}
