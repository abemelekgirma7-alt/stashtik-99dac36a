import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-secondary/40 md:mt-24">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-6 max-w-md md:mb-10">
          <Logo />
          <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
            Free TikTok downloader — videos without watermark, stories, photos, and MP3 audio. Works on any device.
          </p>
        </div>
        <div className="grid grid-cols-4 gap-3 sm:gap-6">
          <FooterCol title="Tools">
            <FLink to="/">Video</FLink>
            <FLink to="/stories">Stories</FLink>
            <FLink to="/photos">Photos</FLink>
            <FLink to="/mp3">Audio / MP3</FLink>
            <FLink to="/app">Install App</FLink>
          </FooterCol>
          <FooterCol title="Company">
            <FLink to="/about">About Us</FLink>
            <FLink to="/how-to">How to Use</FLink>
            <FLink to="/contact">Contact</FLink>
          </FooterCol>
          <FooterCol title="Legal">
            <FLink to="/privacy">Privacy Policy</FLink>
            <FLink to="/cookies">Cookie Policy</FLink>
            <FLink to="/terms">Terms of Service</FLink>
          </FooterCol>
          <FooterCol title="Support">
            <FLink to="/contact">Report a bug</FLink>
            <FLink to="/contact">Takedown</FLink>
          </FooterCol>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container mx-auto flex flex-col items-center justify-between gap-1 px-4 py-4 text-[10px] text-muted-foreground sm:text-xs md:flex-row md:py-5">
          <p>© {new Date().getFullYear()} StashTik. Not affiliated with TikTok or ByteDance.</p>
          <p>For personal, non-commercial use only.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-2 text-[11px] font-semibold text-foreground sm:mb-3 sm:text-sm">{title}</h4>
      <ul className="space-y-1.5 text-[11px] sm:space-y-2 sm:text-sm">{children}</ul>
    </div>
  );
}

function FLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link to={to} className="text-muted-foreground transition-colors hover:text-foreground">
        {children}
      </Link>
    </li>
  );
}
