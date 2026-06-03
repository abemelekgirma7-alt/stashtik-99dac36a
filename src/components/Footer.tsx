import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Free TikTok downloader — videos without watermark, stories, and MP3 audio. Works on any device.
          </p>
        </div>
        <FooterCol title="Tools">
          <FLink to="/">Video Downloader</FLink>
          <FLink to="/stories">Story Downloader</FLink>
          <FLink to="/mp3">Audio / MP3 Downloader</FLink>
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
      </div>
      <div className="border-t border-border">
        <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground md:flex-row">
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
      <h4 className="mb-3 text-sm font-semibold text-foreground">{title}</h4>
      <ul className="space-y-2 text-sm">{children}</ul>
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
