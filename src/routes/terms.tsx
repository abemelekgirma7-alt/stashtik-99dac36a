import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | SnapTok" },
      { name: "description", content: "Terms and conditions governing your use of SnapTok." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <LegalPage title="Terms of Service" updated="January 2026">
        <p>
          These Terms of Service ("Terms") constitute a legally binding agreement between you ("you", "User", or
          "End User") and SnapTok ("SnapTok", "we", "us", or "our") governing your access to and use of the
          website located at snaptok.app and any related services, features, content, or applications offered by
          SnapTok (collectively, the "Service"). By accessing or using the Service, you represent that you have
          read, understood, and agree to be bound by these Terms in their entirety. If you do not agree to any
          provision hereof, you must not access or use the Service.
        </p>

        <h2>1. Eligibility</h2>
        <p>
          You represent and warrant that (a) you are at least the age of majority in your jurisdiction of
          residence, or, if you are a minor, that you have obtained the consent of your parent or legal guardian
          to access the Service; (b) your use of the Service does not violate any applicable law, regulation, or
          contractual obligation; and (c) you have the full right, power, and authority to enter into and comply
          with these Terms.
        </p>

        <h2>2. No Affiliation with TikTok</h2>
        <p>
          The Service is operated independently. SnapTok is not affiliated with, endorsed by, sponsored by, or
          connected to TikTok Inc., ByteDance Ltd., Douyin, or any of their parents, subsidiaries, or affiliates.
          All product names, logos, trademarks, and service marks referenced on the Service are the property of
          their respective owners. Use of such marks does not imply any affiliation with or endorsement by the
          owners thereof.
        </p>

        <h2>3. Description of the Service</h2>
        <p>
          The Service enables End Users to retrieve copies of publicly available media assets that have been
          made accessible on TikTok by their respective rights holders. The Service operates solely as a
          conduit: when you submit a URL, the Service retrieves the corresponding publicly available media and
          transmits it to you. The Service does not host, store, or otherwise retain media files following
          delivery.
        </p>

        <h2>4. License Grant</h2>
        <p>
          Subject to your continuing compliance with these Terms, SnapTok grants you a limited, personal,
          non-exclusive, non-transferable, non-sublicensable, revocable license to access and use the Service
          solely for your own personal, non-commercial purposes. All rights not expressly granted herein are
          reserved.
        </p>

        <h2>5. Acceptable Use</h2>
        <p>
          You agree that you will not, and will not permit any third party to:
        </p>
        <ul>
          <li>access or use the Service in violation of any applicable law, regulation, or court order;</li>
          <li>
            download, retrieve, or otherwise process any content for which you do not hold the necessary rights,
            licenses, consents, releases, permissions, or authority;
          </li>
          <li>
            use the Service to infringe, misappropriate, or otherwise violate any intellectual-property right,
            right of publicity, right of privacy, or other proprietary right of any person or entity;
          </li>
          <li>
            employ any automated means (including bots, scrapers, spiders, or scripts) to access the Service, or
            otherwise impose an unreasonable or disproportionately large load on our infrastructure;
          </li>
          <li>
            attempt to gain unauthorized access to any portion of the Service, related systems, or networks, or
            interfere with, disrupt, or circumvent any security or access-control mechanism;
          </li>
          <li>
            resell, sublicense, redistribute, repackage, or otherwise commercialize the Service or any output
            obtained therefrom; or
          </li>
          <li>
            use the Service to facilitate harassment, defamation, infringement, or any other unlawful activity.
          </li>
        </ul>

        <h2>6. Intellectual Property; User Responsibility</h2>
        <p>
          You acknowledge and agree that all media accessible through the Service is the property of the
          respective rights holders and is subject to applicable copyright and related laws. You are solely and
          exclusively responsible for ensuring that your retrieval, retention, and any subsequent use of such
          media complies with all applicable law, including but not limited to the Digital Millennium Copyright
          Act (17 U.S.C. § 512), Directive (EU) 2019/790 on copyright and related rights, and the terms of
          service of the platform from which the media originates.
        </p>

        <h2>7. Disclaimers</h2>
        <p>
          THE SERVICE IS PROVIDED ON AN "AS-IS" AND "AS-AVAILABLE" BASIS, WITHOUT REPRESENTATION OR WARRANTY OF
          ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE. TO THE MAXIMUM EXTENT PERMITTED BY
          APPLICABLE LAW, SNAPTOK EXPRESSLY DISCLAIMS ALL WARRANTIES, INCLUDING, WITHOUT LIMITATION, THE IMPLIED
          WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT, AND ANY
          WARRANTIES ARISING OUT OF COURSE OF DEALING, USAGE, OR TRADE PRACTICE. SNAPTOK DOES NOT WARRANT THAT
          THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE.
        </p>

        <h2>8. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL SNAPTOK, ITS AFFILIATES, OR ITS
          RESPECTIVE OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
          CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, GOODWILL, OR
          OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO YOUR ACCESS TO OR USE OF, OR INABILITY TO
          ACCESS OR USE, THE SERVICE, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), STATUTE,
          OR ANY OTHER LEGAL THEORY, AND WHETHER OR NOT SNAPTOK HAS BEEN INFORMED OF THE POSSIBILITY OF SUCH
          DAMAGE.
        </p>

        <h2>9. Indemnification</h2>
        <p>
          You agree to defend, indemnify, and hold harmless SnapTok and its affiliates, officers, directors,
          employees, and agents from and against any and all claims, damages, obligations, losses, liabilities,
          costs, or debt, and expenses (including but not limited to reasonable attorneys' fees) arising out of
          or relating to (a) your use of the Service; (b) your violation of these Terms; or (c) your violation
          of any third-party right, including without limitation any intellectual-property or privacy right.
        </p>

        <h2>10. DMCA / Takedown Notices</h2>
        <p>
          If you believe that content accessible through the Service infringes a copyright that you own or
          control, you may submit a notification to us via the <a href="/contact">contact page</a>, including:
          (i) a physical or electronic signature; (ii) identification of the copyrighted work claimed to have
          been infringed; (iii) the URL or sufficient description of the material in question; (iv) your
          contact information; (v) a statement of good-faith belief that the use is not authorized; and (vi) a
          statement, under penalty of perjury, that the information in the notification is accurate and that you
          are authorized to act on behalf of the rights holder.
        </p>

        <h2>11. Modification or Termination</h2>
        <p>
          We reserve the right, at our sole discretion and without prior notice, to modify, suspend, or terminate
          the Service (or any portion thereof), and to revise these Terms at any time. The "Last updated" date
          at the top of this page reflects the date of the most recent revision. Your continued use of the
          Service following any such revision constitutes your acceptance of the revised Terms.
        </p>

        <h2>12. Governing Law; Severability</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in
          which SnapTok is established, without regard to its conflict-of-laws provisions. If any provision of
          these Terms is held by a court of competent jurisdiction to be invalid, illegal, or unenforceable, the
          remaining provisions shall remain in full force and effect.
        </p>

        <h2>13. Entire Agreement</h2>
        <p>
          These Terms, together with the <a href="/privacy">Privacy Policy</a> and the
          <a href="/cookies"> Cookie Policy</a>, constitute the entire agreement between you and SnapTok with
          respect to the Service, and supersede all prior or contemporaneous communications, proposals, and
          agreements, whether oral or written.
        </p>

        <h2>14. Contact</h2>
        <p>
          For questions regarding these Terms, please contact us via the
          <a href="/contact"> contact page</a>.
        </p>
      </LegalPage>
    </SiteLayout>
  ),
});
