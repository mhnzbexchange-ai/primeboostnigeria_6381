import React from 'react';
import Link from 'next/link';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export const metadata = {
  title: 'Refund Policy | PrimeBoost Nigeria',
  description:
    'Refund and cancellation policy for PrimeBoost Nigeria orders, wallet funding and social media promotion services.',
};

export default function RefundPolicyPage() {
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

          <RotateCcw
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
            Refund Policy
          </h1>

          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Last updated: August 10, 2026
          </p>
        </div>

        <div className="space-y-10 text-sm leading-7 text-muted-foreground">

          {/* 1 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              1. Overview
            </h2>

            <p>
              PrimeBoost Nigeria aims to provide clear service information
              and reliable order processing. Because social media promotion
              services may begin processing shortly after an order is placed,
              refund eligibility can depend on the status of the order.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              2. Before Placing an Order
            </h2>

            <p>
              Customers should carefully review the service description,
              platform, target information, quantity, pricing, minimum order
              requirements and estimated delivery information before
              confirming an order.
            </p>

            <p className="mt-3">
              Customers are responsible for ensuring that the information
              submitted with an order is accurate.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              3. Cancellation Requests
            </h2>

            <p>
              A cancellation request may be considered if an order has not
              started processing. Once an order has entered processing or has
              already been completed, cancellation may no longer be possible.
            </p>

            <p className="mt-3">
              Customers should contact support as soon as possible if they
              believe an order needs to be cancelled.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              4. Failed or Incomplete Orders
            </h2>

            <p>
              If an order cannot be completed because of a technical problem,
              provider issue or other circumstance affecting fulfillment,
              PrimeBoost may review the order and determine an appropriate
              resolution.
            </p>

            <p className="mt-3">
              Depending on the circumstances, the resolution may include
              allowing the order to continue, replacing an affected service,
              providing an eligible refund or returning eligible funds to a
              customer wallet.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              5. Incorrect Order Information
            </h2>

            <p>
              Customers are responsible for entering correct information when
              placing an order.
            </p>

            <p className="mt-3">
              If incorrect information is submitted and the order has already
              started processing, PrimeBoost may not be able to recover or
              redirect the order.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              6. Completed Orders
            </h2>

            <p>
              Completed orders are generally not eligible for cancellation or
              refund solely because a customer later changes their mind.
            </p>

            <p className="mt-3">
              If you believe a completed order has a genuine issue, contact
              support with the order details so the matter can be reviewed.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              7. Wallet Funding
            </h2>

            <p>
              Wallet funding transactions should be checked carefully before
              confirmation. If a payment has been successfully processed but
              the wallet balance does not update correctly, contact PrimeBoost
              support and provide the relevant transaction information.
            </p>

            <p className="mt-3">
              Wallet funds may be subject to applicable payment-provider
              requirements and PrimeBoost's account and refund rules.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              8. Payment Provider Issues
            </h2>

            <p>
              If a payment is reversed, declined, disputed or otherwise
              affected by a payment provider, the transaction may need to be
              reviewed with the applicable payment provider.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              9. Fraudulent or Unauthorized Transactions
            </h2>

            <p>
              PrimeBoost may investigate transactions that appear fraudulent,
              unauthorized or inconsistent with normal account activity.
              Accounts or transactions may be temporarily restricted while
              an investigation is carried out.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              10. How to Request Help
            </h2>

            <p>
              To request a refund review or report an order problem, contact
              PrimeBoost support and provide as much relevant information as
              possible.
            </p>

            <p className="mt-3">
              Helpful information may include your account email, order
              number, service purchased, transaction reference and a clear
              description of the issue.
            </p>

            <div className="mt-4 rounded-xl border border-border bg-card p-5">

              <p className="font-semibold text-foreground">
                PrimeBoost Nigeria Support
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

          {/* 11 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              11. Review of Refund Requests
            </h2>

            <p>
              Refund requests are reviewed based on the order status,
              transaction status, service purchased, information provided by
              the customer and the circumstances of the request.
            </p>

            <p className="mt-3">
              Submitting a refund request does not automatically guarantee
              that a refund will be approved.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">
              12. Changes to This Refund Policy
            </h2>

            <p>
              PrimeBoost may update this Refund Policy when necessary.
              Changes will be published on this page together with an updated
              revision date.
            </p>
          </section>

        </div>

      </article>
    </main>
  );
}