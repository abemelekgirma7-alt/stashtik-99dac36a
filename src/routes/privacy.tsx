import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | SnapTok" },
      { name: "description", content: "How SnapTok handles your data and privacy." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <LegalPage title="Privacy Policy" updated="January 2026">
        <p>
          SnapTok ("we", "us", "our") respects your privacy. This Privacy Policy explains what limited
          information we process when you use snaptok.app.
        </p>
        <h2>Information we collect</h2>
        <p>
          We do not require an account and we do not ask for personal information. When you submit a TikTok URL,
          the link is sent to our server only to fetch the public media you requested. The URL is not stored.
        </p>
        <p>
          We may process anonymous analytics (page views, browser type, country) to understand traffic and improve
          the service. This data cannot identify you personally.
        </p>
        <h2>Cookies</h2>
        <p>
          SnapTok only uses essential cookies needed for the site to function. See our <a href="/cookies">Cookie Policy</a> for details.
        </p>
        <h2>Downloads</h2>
        <p>
          We do not permanently store the TikTok videos or audio you download. Files are streamed through our
          servers and discarded immediately after delivery.
        </p>
        <h2>Third parties</h2>
        <p>
          To fetch TikTok content we may rely on third-party endpoints. Those endpoints have their own privacy
          practices. We never share any identifying information with them.
        </p>
        <h2>Your rights</h2>
        <p>
          Because we don't collect personal information, there is nothing personally identifying to access, edit,
          or delete. For questions about this policy, contact us via the <a href="/contact">contact page</a>.
        </p>
        <h2>Changes</h2>
        <p>We may update this policy from time to time. The latest version is always available on this page.</p>
      </LegalPage>
    </SiteLayout>
  ),
});
