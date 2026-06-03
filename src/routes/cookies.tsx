import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy | SnapTok" },
      { name: "description", content: "How SnapTok uses cookies." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <LegalPage title="Cookie Policy" updated="January 2026">
        <p>
          This Cookie Policy explains how SnapTok uses cookies and similar technologies when you visit snaptok.app.
        </p>
        <h2>What cookies are</h2>
        <p>
          Cookies are small text files stored on your device by your browser. They help websites remember
          preferences and provide a smoother experience.
        </p>
        <h2>Cookies we use</h2>
        <ul>
          <li>
            <strong>Essential cookies</strong> — required for the site to function (for example, remembering
            your theme preference or session state).
          </li>
          <li>
            <strong>Anonymous analytics</strong> — aggregate statistics about page views, with no personal
            identifiers attached.
          </li>
        </ul>
        <h2>Cookies we do not use</h2>
        <p>We do not use advertising cookies, cross-site tracking, or third-party marketing pixels.</p>
        <h2>Managing cookies</h2>
        <p>
          You can clear or block cookies through your browser settings at any time. Disabling essential cookies
          may affect site functionality.
        </p>
      </LegalPage>
    </SiteLayout>
  ),
});
