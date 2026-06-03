import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | StashTik" },
      { name: "description", content: "How StashTik handles your data and privacy." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <LegalPage title="Privacy Policy" updated="January 2026">
        <p>
          This Privacy Policy ("Policy") describes the practices of StashTik ("StashTik", "we", "us", or "our")
          regarding the collection, use, disclosure, retention, and protection of information in connection with
          your use of the website located at stashtik.app and any related services, features, content, or
          applications offered by StashTik (collectively, the "Service"). By accessing or using the Service, you
          acknowledge that you have read, understood, and agree to be bound by the terms set forth herein.
        </p>

        <h2>1. Scope and Application</h2>
        <p>
          This Policy applies solely to information collected through the Service and does not apply to any
          third-party websites, applications, or services that may be linked to, referenced from, or accessible
          via the Service. The processing of personal data by such third parties is governed exclusively by their
          respective privacy policies.
        </p>

        <h2>2. Categories of Information We Process</h2>
        <p>
          The Service is designed to operate without the creation of user accounts or the submission of personally
          identifying registration information. In the ordinary course of providing the Service, we may process
          the following limited categories of information:
        </p>
        <ul>
          <li>
            <strong>Submitted URLs.</strong> When you submit a link to a publicly available TikTok video, story,
            or audio asset, the URL is transmitted to our servers solely for the purpose of retrieving the
            requested public media on your behalf. Submitted URLs are not retained beyond the duration of the
            request and are not associated with any identifier capable of linking them to you.
          </li>
          <li>
            <strong>Technical access data.</strong> Our servers and infrastructure providers automatically log
            standard request metadata, including Internet Protocol (IP) address, user-agent string, referrer URL,
            and timestamp, for the purposes of security monitoring, abuse prevention, capacity planning, and the
            generation of aggregated, non-identifying analytics.
          </li>
          <li>
            <strong>Cookies and similar technologies.</strong> The Service uses strictly necessary cookies and
            local storage to remember user-selected preferences (such as theme selection) and to enable the
            Service to function as intended. See the <a href="/cookies">Cookie Policy</a> for further detail.
          </li>
        </ul>

        <h2>3. Information We Expressly Do Not Collect</h2>
        <p>
          We do not request, require, or knowingly collect: (i) your name, email address, telephone number, or
          physical address; (ii) TikTok account credentials or any other third-party login information; (iii)
          payment-card or financial-account information; (iv) precise geolocation data; or (v) any "special
          category" or "sensitive" personal data within the meaning of applicable data-protection law.
        </p>

        <h2>4. Legal Bases for Processing</h2>
        <p>
          To the extent the General Data Protection Regulation (Regulation (EU) 2016/679, "GDPR") or analogous
          legislation applies, the legal bases on which we rely to process the limited information described in
          Section 2 are: (a) our legitimate interests in operating, securing, and improving the Service
          (Art. 6(1)(f) GDPR); and (b) our compliance with applicable legal obligations (Art. 6(1)(c) GDPR).
        </p>

        <h2>5. Retention</h2>
        <p>
          Submitted URLs are processed in-memory and are not persisted to durable storage. Technical access logs
          are retained for a rolling period not exceeding ninety (90) days, after which they are deleted or
          irreversibly anonymized. Downloaded media files are streamed through the Service and are not retained
          following delivery to the requesting client.
        </p>

        <h2>6. Disclosure to Third Parties</h2>
        <p>
          We do not sell, rent, lease, or otherwise commercialize any information collected through the Service.
          We may disclose information only: (i) to infrastructure providers acting as data processors strictly in
          furtherance of operating the Service; (ii) where required to comply with a valid legal process,
          court order, subpoena, or governmental request; or (iii) where reasonably necessary to investigate,
          prevent, or take action regarding suspected or actual unlawful activity or violations of the
          <a href="/terms"> Terms of Service</a>.
        </p>

        <h2>7. International Transfers</h2>
        <p>
          The Service is operated from infrastructure located across multiple jurisdictions. By using the Service,
          you acknowledge that any information processed in connection therewith may be transferred to and
          processed in countries other than your country of residence. Where required, we rely on appropriate
          safeguards (including Standard Contractual Clauses) for such transfers.
        </p>

        <h2>8. Your Rights</h2>
        <p>
          Because we do not collect information that identifies you, requests to access, rectify, erase, restrict,
          or port personal data are generally not applicable. To the extent any such right is nevertheless
          exercisable under applicable law, you may contact us via the <a href="/contact">contact page</a>. We
          will respond within the timeframes required by applicable law.
        </p>

        <h2>9. Children's Privacy</h2>
        <p>
          The Service is not directed to children under the age of thirteen (13), and we do not knowingly collect
          information from children. If you believe a child has provided information to us, please contact us and
          we will take reasonable steps to delete such information.
        </p>

        <h2>10. Security</h2>
        <p>
          We implement and maintain reasonable administrative, technical, and physical safeguards designed to
          protect information processed through the Service. Notwithstanding the foregoing, no method of
          transmission or storage is one hundred percent (100%) secure, and we cannot guarantee absolute security.
        </p>

        <h2>11. Modifications</h2>
        <p>
          We reserve the right to amend this Policy at any time. The "Last updated" date at the top of this
          page reflects the date of the most recent revision. Continued use of the Service following the
          posting of an amended Policy constitutes your acceptance of the amended Policy.
        </p>

        <h2>12. Contact</h2>
        <p>
          Questions, complaints, or requests regarding this Policy may be directed to us via the
          <a href="/contact"> contact page</a>.
        </p>
      </LegalPage>
    </SiteLayout>
  ),
});
