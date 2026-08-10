import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | PrimeBoost Nigeria',
  description:
    'Privacy Policy for PrimeBoost Nigeria explaining how we collect, use, protect and manage customer information.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-5">

          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft size={16} />
            Back to PrimeBoost
          </Link>

          <ShieldCheck
            size={22}
            className="text-primary"
          />

        </div>
      </header>

      {/* Content */}
      <article className="mx-auto max-w-4xl px-4 py-12 sm:py-16">

        <div className="mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
            Legal Information
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Privacy Policy
          </h1>

          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Last updated: August 10, 2026
          </p>
        </div>

        <div className="space-y-10 text-sm leading-7 text-muted-foreground">

          {/* Introduction */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              1. Introduction
            </h2>

            <p>
              PrimeBoost Nigeria respects your privacy and is committed to
              protecting the personal information you provide when using our
              website and services.
            </p>

            <p className="mt-3">
              This Privacy Policy explains what information we may collect,
              how we use it, how we protect it, and the choices available to
              you when using PrimeBoost Nigeria.
            </p>
          </section>

          {/* Information collected */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              2. Information We Collect
            </h2>

            <p>
              Depending on how you use our website, we may collect information
              such as:
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Your name or account information.</li>
              <li>Your email address.</li>
              <li>Contact information you provide to customer support.</li>
              <li>Order and transaction information.</li>
              <li>Information required to process a service order.</li>
              <li>Technical information such as browser, device and website usage data.</li>
            </ul>
          </section>

          {/* How information is used */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              3. How We Use Your Information
            </h2>

            <p>
              Information collected through PrimeBoost may be used to:
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Create and manage customer accounts.</li>
              <li>Process and manage orders.</li>
              <li>Process payments and wallet transactions.</li>
              <li>Provide customer support.</li>
              <li>Communicate with customers about their accounts or orders.</li>
              <li>Improve website functionality and user experience.</li>
              <li>Detect, prevent or investigate fraudulent or unauthorized activity.</li>
              <li>Maintain the security and reliability of our services.</li>
            </ul>
          </section>

          {/* Payments */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              4. Payments
            </h2>

            <p>
              Payments may be processed through third-party payment providers.
              PrimeBoost does not intend to store complete payment card
              details on its own servers when those details are handled by
              the applicable payment provider.
            </p>

            <p className="mt-3">
              Payment providers may collect and process information according
              to their own privacy policies and terms.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              5. Cookies and Similar Technologies
            </h2>

            <p>
              PrimeBoost may use cookies and similar technologies to help
              operate the website, remember preferences, understand website
              usage and improve the user experience.
            </p>

            <p className="mt-3">
              Third-party services, including advertising services such as
              Google AdSense, may also use cookies or similar technologies
              where applicable.
            </p>
          </section>

          {/* Advertising */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              6. Advertising
            </h2>

            <p>
              PrimeBoost may display advertisements provided by third-party
              advertising services.
            </p>

            <p className="mt-3">
              If Google AdSense is used on the website, Google and its
              advertising partners may use cookies or similar technologies
              to provide, personalize or measure advertisements, subject to
              applicable settings and policies.
            </p>
          </section>

          {/* Third parties */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              7. Third-Party Services
            </h2>

            <p>
              PrimeBoost may use trusted third-party services to provide
              website hosting, authentication, payment processing, analytics,
              security, communications and other necessary functions.
            </p>

            <p className="mt-3">
              These providers may process information according to their own
              terms and privacy policies.
            </p>
          </section>

          {/* Data protection */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              8. Data Security
            </h2>

            <p>
              We take reasonable measures to protect information against
              unauthorized access, loss, misuse, alteration or disclosure.
              However, no internet-based service can guarantee absolute
              security.
            </p>
          </section>

          {/* Passwords */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              9. Account and Password Security
            </h2>

            <p>
              Customers are responsible for keeping their account credentials
              confidential and should not share their passwords with other
              people.
            </p>

            <p className="mt-3">
              PrimeBoost will not normally require your social media account
              password to place a standard promotion order.
            </p>
          </section>

          {/* Data retention */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              10. Data Retention
            </h2>

            <p>
              We may retain information for as long as reasonably necessary
              to provide our services, maintain business records, comply with
              applicable obligations, resolve disputes and enforce our
              agreements.
            </p>
          </section>

          {/* User choices */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              11. Your Choices
            </h2>

            <p>
              Depending on applicable law, you may have rights regarding your
              personal information, including requesting access, correction
              or deletion of certain information.
            </p>

            <p className="mt-3">
              You may contact us if you would like to ask about information
              associated with your account.
            </p>
          </section>

          {/* Children's privacy */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              12. Children's Privacy
            </h2>

            <p>
              PrimeBoost is not intended for children who are not permitted
              to use online services under applicable law. We do not knowingly
              collect personal information from children in violation of
              applicable requirements.
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              13. Changes to This Policy
            </h2>

            <p>
              We may update this Privacy Policy from time to time. Changes
              will be posted on this page with an updated revision date.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              14. Contact Us
            </h2>

            <p>
              If you have questions about this Privacy Policy or how your
              information is handled, please contact PrimeBoost Nigeria.
            </p>

            <div className="mt-4 rounded-xl border border-border bg-card p-5">
              <p className="font-semibold text-foreground">
                PrimeBoost Nigeria
              </p>

              <p className="mt-2">
                Email:{' '}
                <a
                  href="mailto:primeboostnigeria@gmail.com"
                  className="text-primary hover:underline"
                >
                  primeboostnigeria@gmail.com
                </a>
              </p>

              <p>
                WhatsApp:{' '}
                <a
                  href="https://wa.me/2347082653790"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  +234 708 265 3790
                </a>
              </p>
            </div>
          </section>

        </div>

      </article>
    </main>
  );
}