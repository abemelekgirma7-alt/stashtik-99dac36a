import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { Smartphone, MonitorSmartphone, Zap, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Install SnapTok App — TikTok Downloader for Mobile & Desktop" },
      {
        name: "description",
        content:
          "Install SnapTok as a free Progressive Web App on iOS, Android, Windows, and macOS. Download TikToks like a native app.",
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
        eyebrow="Install"
        title={<>Get the <span className="text-brand-gradient">SnapTok App</span></>}
        description="Add SnapTok to your home screen and use it like a native app — offline-ready and lightning fast."
      />
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
