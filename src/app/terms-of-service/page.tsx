import React from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | PrimeBoost Nigeria',
  description:
    'Terms of Service governing the use of PrimeBoost Nigeria services, accounts, orders, payments and website.',
};

export default function TermsOfServicePage() {
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

          <FileText
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
            Terms of Service
          </h1>

          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Last updated: August 10, 2026
          </p>
        </div>

        <div className="space-y-10 text-sm leading-7 text-muted-foreground">

          {/* 1 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              1. Acceptance of These Terms
            </h2>

            <p>
              By accessing or using PrimeBoost Nigeria, you agree to comply
              with these Terms of Service. If you do not agree with these
              terms, please do not use the website or its services.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              2. About PrimeBoost
            </h2>

            <p>
              PrimeBoost Nigeria provides social media promotion services for
              supported social platforms. Available services, pricing,
              minimum order quantities and estimated delivery times are
              displayed on the website and may change from time to time.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              3. Customer Accounts
            </h2>

            <p>
              Some PrimeBoost services require a customer account. You are
              responsible for providing accurate information and keeping your
              login credentials secure.
            </p>

            <p className="mt-3">
              You are responsible for activity carried out through your
              account unless the activity resulted from unauthorized access
              that was not caused by your failure to protect your credentials.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              4. Orders
            </h2>

            <p>
              Before placing an order, customers should carefully review the
              selected service, target information, quantity, price and other
              requirements.
            </p>

            <p className="mt-3">
              An order may not always be changed or cancelled after
              processing has started. Customers should contact support as soon
              as possible if an order contains incorrect information.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              5. Pricing and Payments
            </h2>

            <p>
              PrimeBoost displays service prices in Nigerian Naira (₦).
              Prices may change without prior notice, but the applicable price
              shown when an order is confirmed will normally apply to that
              order.
            </p>

            <p className="mt-3">
              Available payment methods are presented during the applicable
              payment or wallet-funding process.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              6. Wallet Balances
            </h2>

            <p>
              Where PrimeBoost provides wallet functionality, funds added to
              a customer wallet may be used for eligible services available
              through the platform.
            </p>

            <p className="mt-3">
              Customers should verify the amount and payment details before
              confirming a wallet transaction.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              7. Service Delivery
            </h2>

            <p>
              Estimated delivery or start times are provided for guidance and
              may vary depending on the service, order quantity, platform
              conditions and provider availability.
            </p>

            <p className="mt-3">
              A displayed estimated delivery time is not necessarily a
              guarantee of completion at an exact time.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              8. Customer Responsibilities
            </h2>

            <p>
              Customers must provide accurate information required to process
              an order and must have the appropriate rights or authorization
              to use the social media account, profile, page, channel or
              content associated with an order.
            </p>

            <p className="mt-3">
              Customers should not provide passwords or other unnecessary
              sensitive login credentials through standard order forms.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              9. Prohibited Use
            </h2>

            <p>
              You must not use PrimeBoost to engage in unlawful activity,
              fraud, harassment, impersonation, unauthorized access,
              distribution of malicious software, or activity that violates
              applicable laws or the rules of a relevant social media
              platform.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              10. Platform Rules
            </h2>

            <p>
              Social media platforms have their own terms, policies and
              enforcement systems. Customers are responsible for understanding
              and complying with the rules applicable to their accounts and
              content.
            </p>

            <p className="mt-3">
              PrimeBoost does not guarantee that using a promotion service
              will prevent a social media platform from changing, restricting
              or suspending an account.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              11. Refunds and Order Issues
            </h2>

            <p>
              Refunds, cancellations and order-related resolutions are
              handled according to the PrimeBoost Refund Policy and the
              circumstances of the individual order.
            </p>

            <p className="mt-3">
              Customers who experience an issue should contact support and
              provide their order details so the matter can be reviewed.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              12. Intellectual Property
            </h2>

            <p>
              The PrimeBoost website, branding, logos, graphics, text and
              original website content are protected by applicable
              intellectual property laws.
            </p>

            <p className="mt-3">
              You may not copy, reproduce, distribute or commercially exploit
              PrimeBoost content without appropriate authorization.
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              13. Third-Party Services
            </h2>

            <p>
              PrimeBoost may rely on third-party providers for services such
              as payment processing, authentication, hosting, communications,
              analytics and service fulfillment.
            </p>

            <p className="mt-3">
              Third-party services may have their own terms and policies.
            </p>
          </section>

          {/* 14 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              14. Service Availability
            </h2>

            <p>
              We aim to keep PrimeBoost available and operational, but we
              cannot guarantee uninterrupted access to the website or every
              service at all times.
            </p>

            <p className="mt-3">
              Services may temporarily become unavailable because of
              maintenance, technical issues, provider limitations or other
              circumstances outside our reasonable control.
            </p>
          </section>

          {/* 15 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              15. Limitation of Liability
            </h2>

            <p>
              To the extent permitted by applicable law, PrimeBoost is not
              responsible for losses resulting from circumstances outside its
              reasonable control, including changes to third-party platforms,
              account restrictions imposed by those platforms, network
              interruptions or third-party service failures.
            </p>
          </section>

          {/* 16 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              16. Termination
            </h2>

            <p>
              PrimeBoost may restrict or suspend access to an account where
              there is reasonable evidence of fraud, abuse, unauthorized
              activity, violation of these Terms, or other prohibited use.
            </p>
          </section>

          {/* 17 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              17. Changes to These Terms
            </h2>

            <p>
              PrimeBoost may update these Terms of Service from time to time.
              Updated terms will be published on this page together with a
              revised update date.
            </p>
          </section>

          {/* 18 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              18. Contact PrimeBoost
            </h2>

            <p>
              If you have questions about these Terms of Service, an order,
              payment or your account, please contact our support team.
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