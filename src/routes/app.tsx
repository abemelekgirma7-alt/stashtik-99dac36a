import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { Smartphone, MonitorSmartphone, Zap, ShieldCheck, Globe, AppWindow } from "lucide-react";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Install SnapTok App — TikTok Downloader for Mobile & Desktop" },
      {
        name: "description",
        content:
          "Install SnapTok as a free Progressive Web App on iOS, Android, Windows, and macOS. Native apps and a browser extension are coming soon.",
      },
      { property: "og:title", content: "Install SnapTok App" },
      { property: "og:description", content: "Add SnapTok to your home screen for one-tap access." },
    ],
  }),
  component: AppPage,
});

function AppPage() {
  return (
    <SiteLayout>
      <PageHero
        title={<>Get the <span className="text-brand-gradient">SnapTok App</span></>}
        description="Add SnapTok to your home screen and use it like a native app — lightning fast."
      />

      <section className="container mx-auto max-w-4xl px-4 pb-6">
        <div className="rounded-2xl border border-border bg-brand-soft p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-gradient">Heads up</p>
          <h2 className="mt-1 text-xl font-bold">Native apps & browser extension — coming soon</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We're building dedicated SnapTok experiences across every platform. Until they launch, install the web
            app below for the smoothest experience.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <SoonCard icon={<Globe />} label="Browser Extension" sub="Chrome, Edge, Brave, Firefox" />
            <SoonCard icon={<Smartphone />} label="iOS App" sub="iPhone & iPad" />
            <SoonCard icon={<AppWindow />} label="Android App" sub="Phones & tablets" />
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-4xl px-4 pb-12">
        <div className="grid gap-6 md:grid-cols-2">
          <Card icon={<Smartphone />} title="On iPhone (Safari)">
            <ol className="ml-4 list-decimal space-y-1 text-sm text-muted-foreground">
              <li>Tap the Share button in Safari.</li>
              <li>Scroll and tap <strong>Add to Home Screen</strong>.</li>
              <li>Confirm to install SnapTok as an app.</li>
            </ol>
          </Card>
          <Card icon={<Smartphone />} title="On Android (Chrome)">
            <ol className="ml-4 list-decimal space-y-1 text-sm text-muted-foreground">
              <li>Tap the menu (⋮) in Chrome.</li>
              <li>Choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li>
              <li>Open SnapTok from your home screen.</li>
            </ol>
          </Card>
          <Card icon={<MonitorSmartphone />} title="On Desktop (Chrome / Edge)">
            <ol className="ml-4 list-decimal space-y-1 text-sm text-muted-foreground">
              <li>Click the install icon in the address bar.</li>
              <li>Confirm <strong>Install</strong>.</li>
              <li>Launch SnapTok from your dock or start menu.</li>
            </ol>
          </Card>
          <Card icon={<Zap />} title="Why install?">
            <ul className="ml-4 list-disc space-y-1 text-sm text-muted-foreground">
              <li>One-tap launch, just like a native app.</li>
              <li>Works offline for the app shell.</li>
              <li>Lightweight — under 1MB on disk.</li>
            </ul>
          </Card>
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-border bg-secondary/40 p-5 text-sm text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-foreground" />
          <p>
            SnapTok is a web app — no APK, no third-party store, no permissions beyond your browser. Installing
            just creates a shortcut so the site behaves like a standalone app.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-brand [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function SoonCard({ icon, label, sub }: { icon: React.ReactNode; label: string; sub: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient text-white shadow-brand [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </div>
      <p className="text-sm font-semibold">{label}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
      <span className="mt-2 inline-block rounded-full bg-card px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground ring-1 ring-border">
        Coming soon
      </span>
    </div>
  );
}
