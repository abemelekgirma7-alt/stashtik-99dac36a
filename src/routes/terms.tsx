import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | SnapTok" },
      { name: "description", content: "Terms of Service for using SnapTok." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <LegalPage title="Terms of Service" updated="January 2026">
        <p>
          By using SnapTok ("the service") you agree to these Terms of Service. If you do not agree, please do
          not use the service.
        </p>
        <h2>1. Not affiliated with TikTok</h2>
        <p>
          SnapTok is an independent project and is not affiliated with, endorsed by, or connected to TikTok,
          ByteDance Ltd., or Douyin. All trademarks belong to their respective owners.
        </p>
        <h2>2. Personal use only</h2>
        <p>
          The service is intended for personal, non-commercial use. You may not redistribute, resell, or use
          downloaded content commercially without explicit permission from the original creator.
        </p>
        <h2>3. Copyright</h2>
        <p>
          You are responsible for the content you choose to download. You must have the legal right to download
          and use the material. Respect the original creator and applicable copyright law.
        </p>
        <h2>4. Prohibited use</h2>
        <ul>
          <li>Automated scraping, bots, or any activity that overloads the service.</li>
          <li>Downloading private content you are not authorized to access.</li>
          <li>Using SnapTok to facilitate harassment, infringement, or illegal activity.</li>
          <li>Reselling, repackaging, or commercializing the service or its output.</li>
        </ul>
        <h2>5. Availability</h2>
        <p>
          The service is provided on an "as-is" and "as-available" basis. We do not guarantee uninterrupted
          access and may modify or discontinue features at any time.
        </p>
        <h2>6. Disclaimer of warranties</h2>
        <p>
          To the maximum extent permitted by law, SnapTok disclaims all warranties, express or implied, including
          warranties of merchantability, fitness for a particular purpose, and non-infringement.
        </p>
        <h2>7. Limitation of liability</h2>
        <p>
          SnapTok and its team shall not be liable for any indirect, incidental, or consequential damages arising
          from your use of the service.
        </p>
        <h2>8. Changes</h2>
        <p>
          We may update these Terms at any time. Continued use of the service after changes take effect
          constitutes acceptance of the updated Terms.
        </p>
        <h2>9. Contact</h2>
        <p>
          For questions about these Terms, please reach out via the <a href="/contact">contact page</a>.
        </p>
      </LegalPage>
    </SiteLayout>
  ),
});
