import React from 'react';
import { CheckCircle, MessageCircle, ShieldCheck } from 'lucide-react';

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

          <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground">
            We believe customers should know what they are ordering,
            what it costs, and how to get help when they need it.
          </p>
        </div>

        {/* Trust cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

          {/* Card 1 */}
          <div className="card-base card-gradient-bg">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <ShieldCheck className="text-primary" size={22} />
            </div>

            <h3 className="mb-2 text-base font-bold">
              Clear Before You Order
            </h3>

            <p className="text-sm leading-relaxed text-muted-foreground">
              Service details, pricing and minimum order quantities are
              displayed before you place an order.
            </p>
          </div>

          {/* Card 2 */}
          <div className="card-base card-gradient-bg">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <CheckCircle className="text-primary" size={22} />
            </div>

            <h3 className="mb-2 text-base font-bold">
              Track Your Orders
            </h3>

            <p className="text-sm leading-relaxed text-muted-foreground">
              Orders can be managed through your PrimeBoost account so
              you can keep track of your activity.
            </p>
          </div>

          {/* Card 3 */}
          <div className="card-base card-gradient-bg">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <MessageCircle className="text-primary" size={22} />
            </div>

            <h3 className="mb-2 text-base font-bold">
              Customer Support
            </h3>

            <p className="text-sm leading-relaxed text-muted-foreground">
              If you have a question about an order or service, you can
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
            />
          </div>

          <h3 className="mb-2 text-sm font-bold">
            Transparency Matters
          </h3>

          <p className="text-xs leading-6 text-muted-foreground sm:text-sm">
            PrimeBoost does not use made-up customer numbers or
            fabricated reviews to make our platform appear larger than
            it is. As our customer base grows, genuine customer feedback
            can be added with permission.
          </p>

        </div>

      </div>
    </section>
  );
}