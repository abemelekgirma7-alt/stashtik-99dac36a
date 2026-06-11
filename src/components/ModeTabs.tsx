import { Link } from "@tanstack/react-router";
import { Video, Film, Image as ImageIcon, Music } from "lucide-react";

const tabs = [
  { to: "/", label: "Video", icon: Video },
  { to: "/stories", label: "Stories", icon: Film },
  { to: "/photos", label: "Photos", icon: ImageIcon },
  { to: "/mp3", label: "Audio", icon: Music },
] as const;

/** Mobile-only quick switcher between the four downloader modes. */
export function ModeTabs() {
  return (
    <div className="glass-pill mx-auto mt-3 grid w-full max-w-[260px] grid-cols-4 gap-1 p-1 md:hidden">
      {tabs.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          activeOptions={{ exact: to === "/" }}
          className="flex flex-col items-center justify-center gap-0.5 rounded-full px-0.5 py-1.5 text-[9px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
          activeProps={{ className: "bg-brand-gradient text-white shadow-brand" }}
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </Link>
      ))}
    </div>
  );
}
