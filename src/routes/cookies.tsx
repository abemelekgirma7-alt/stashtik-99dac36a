import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy | SnapTok" },
      { name: "description", content: "How SnapTok uses cookies and similar technologies." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <LegalPage title="Cookie Policy" updated="January 2026">
        <p>
          This Cookie Policy ("Policy") explains how SnapTok ("SnapTok", "we", "us", or "our") uses cookies, local
          storage, and similar tracking technologies (collectively, "Cookies") in connection with the website
          located at snaptok.app (the "Service"). This Policy should be read together with our
          <a href="/privacy"> Privacy Policy</a>.
        </p>

        <h2>1. What Cookies Are</h2>
        <p>
          A Cookie is a small text file that a website places on your device when you visit. Cookies are widely
          used to make websites function correctly, to operate more efficiently, and to provide information to
          the operators of the website. Similar technologies include HTML5 local storage and session storage,
          which allow websites to store data locally within your browser.
        </p>

        <h2>2. Categories of Cookies We Use</h2>
        <p>The Service uses the following categories of Cookies:</p>
        <ul>
          <li>
            <strong>Strictly necessary Cookies.</strong> These Cookies are required for the operation of the
            Service and cannot be disabled in our systems. They are typically set in response to actions made
            by you which amount to a request for services, such as setting your theme preference.
          </li>
          <li>
            <strong>Aggregated analytics.</strong> Where applicable, we may employ first-party analytics tools
            that collect aggregated, non-identifying usage statistics (such as page views and country-level
            traffic) to help us understand how the Service is used and to improve it.
          </li>
        </ul>

        <h2>3. Cookies We Do Not Use</h2>
        <p>
          We do not use advertising Cookies, cross-site tracking Cookies, social-media tracking pixels, or
          third-party marketing tags on the Service. We do not engage in behavioral profiling for advertising
          purposes.
        </p>

        <h2>4. Legal Basis</h2>
        <p>
          To the extent the ePrivacy Directive (Directive 2002/58/EC, as amended) and the GDPR apply, strictly
          necessary Cookies are deployed on the legal basis that they are essential to provide a service
          expressly requested by you. Any non-essential Cookie or analytics technology will be deployed only
          where permitted by applicable law.
        </p>

        <h2>5. Managing Cookies</h2>
        <p>
          You may control, accept, refuse, or delete Cookies through your browser settings. Please note that
          disabling strictly necessary Cookies may impair the functionality of the Service or render parts of it
          inoperable. For guidance, consult the help documentation provided with your browser.
        </p>

        <h2>6. Changes</h2>
        <p>
          We may update this Policy from time to time. The "Last updated" date at the top of this page reflects
          the date of the most recent revision. Continued use of the Service following any revision constitutes
          your acceptance of the revised Policy.
        </p>

        <h2>7. Contact</h2>
        <p>
          For questions about this Policy, please contact us via the
          <a href="/contact"> contact page</a>.
        </p>
      </LegalPage>
    </SiteLayout>
  ),
});
