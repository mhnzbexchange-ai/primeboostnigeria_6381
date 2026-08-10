import React from 'react';
import {
  CheckCircle,
  MessageCircle,
  ShieldCheck,
  Info,
} from 'lucide-react';

export default function HomepageTestimonials() {
  return (
    <section className="bg-secondary/20 py-24">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">

        {/* Heading */}
        <div className="mb-14 text-center">
          <p className="section-label mb-3">
            WHY PRIMEBOOST
          </p>

          <h2 className="text-hero-md mb-4 font-bold">
            A Simpler Way to{' '}
            <span className="gold-gradient-text">
              Promote Your Socials
            </span>
          </h2>

          <p className="mx-auto max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            PrimeBoost Nigeria is designed to make social media promotion
            straightforward. Customers can review available services,
            pricing, order requirements, and estimated delivery information
            before deciding to place an order.
          </p>
        </div>

        {/* Trust cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

          {/* Card 1 */}
          <div className="card-base card-gradient-bg">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <ShieldCheck
                className="text-primary"
                size={22}
                aria-hidden="true"
              />
            </div>

            <h3 className="mb-2 text-base font-bold">
              Clear Before You Order
            </h3>

            <p className="text-sm leading-7 text-muted-foreground">
              Service details, pricing, minimum quantities, and available
              options are displayed before you place an order.
            </p>
          </div>

          {/* Card 2 */}
          <div className="card-base card-gradient-bg">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <CheckCircle
                className="text-primary"
                size={22}
                aria-hidden="true"
              />
            </div>

            <h3 className="mb-2 text-base font-bold">
              Manage Your Orders
            </h3>

            <p className="text-sm leading-7 text-muted-foreground">
              Registered customers can use their PrimeBoost account to
              manage their orders and review their account activity.
            </p>
          </div>

          {/* Card 3 */}
          <div className="card-base card-gradient-bg">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <MessageCircle
                className="text-primary"
                size={22}
                aria-hidden="true"
              />
            </div>

            <h3 className="mb-2 text-base font-bold">
              Customer Support
            </h3>

            <p className="text-sm leading-7 text-muted-foreground">
              If you have a question about a service or order, you can
              contact our support team for assistance.
            </p>
          </div>

        </div>

        {/* Transparency notice */}
        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-primary/20 bg-card/60 p-6 text-center">

          <div className="mb-3 flex justify-center">
            <ShieldCheck
              size={24}
              className="text-primary"
              aria-hidden="true"
            />
          </div>

          <h3 className="mb-2 text-sm font-bold">
            Transparency Matters
          </h3>

          <p className="text-xs leading-6 text-muted-foreground sm:text-sm">
            PrimeBoost aims to provide clear information about its services,
            pricing, order requirements, and estimated delivery times.
            We do not use fabricated customer numbers or made-up reviews to
            misrepresent the size or popularity of our platform.
          </p>

        </div>

        {/* Service information notice */}
        <div className="mx-auto mt-5 flex max-w-3xl items-start gap-3 rounded-2xl border border-border bg-card/40 p-5 text-left">

          <Info
            size={19}
            className="mt-0.5 shrink-0 text-primary"
            aria-hidden="true"
          />

          <div>
            <h3 className="mb-1 text-sm font-bold">
              Please Review Service Requirements
            </h3>

            <p className="text-xs leading-6 text-muted-foreground sm:text-sm">
              Service availability, delivery estimates, and requirements
              can vary by platform and service. Please review the information
              shown on the relevant service and order pages before submitting
              an order. Customers should also use social media services in
              accordance with the applicable platform's terms and policies.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}