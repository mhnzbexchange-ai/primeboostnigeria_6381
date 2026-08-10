import React from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, ShoppingCart, TrendingUp } from 'lucide-react';
import { ALL_SERVICES, MINIMUM_ORDER_QTY } from '@/lib/pricing';

const FEATURED_IDS = [
  'svc-tt-followers',
  'svc-ig-likes',
  'svc-tg-channel',
  'svc-x-followers',
  'svc-yt-subscribers',
  'svc-yt-views',
];

const services = ALL_SERVICES?.filter((service) =>
  FEATURED_IDS.includes(service?.id)
);

export default function HomepageServices() {
  return (
    <section
      id="featured-services"
      className="bg-background py-24"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">

        {/* Section heading */}
        <div className="mb-14 text-center">
          <p className="section-label mb-3">
            OUR SERVICES
          </p>

          <h2
            id="services-heading"
            className="text-hero-md mb-4 font-bold"
          >
            Social Media{' '}
            <span className="gold-gradient-text">
              Promotion Services
            </span>
          </h2>

          <p className="mx-auto max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            PrimeBoost Nigeria provides social media promotion services for
            creators, businesses, and individuals. Browse our featured
            services, review the available pricing and order requirements,
            and choose an option that fits your needs.
          </p>

          <p className="mx-auto mt-3 max-w-2xl text-xs leading-6 text-muted-foreground">
            Prices and service requirements are displayed before you place an
            order. Delivery times are estimates and may vary depending on the
            service and platform.
          </p>

          <p className="mt-3 text-xs font-medium text-muted-foreground">
            Minimum order: {MINIMUM_ORDER_QTY?.toLocaleString()} units
          </p>
        </div>

        {/* Featured services */}
        <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services?.map((service) => (
            <article
              key={service?.id}
              className="card-base card-gradient-bg group flex flex-col transition-all duration-300 hover:border-primary/40 hover:glow-gold-sm"
            >

              {/* Service header */}
              <div className="mb-5 flex items-start justify-between gap-4">

                <div className="flex items-center gap-3">

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${service?.platformBg}`}
                    aria-hidden="true"
                  >
                    <span className="text-lg">
                      {service?.emoji}
                    </span>
                  </div>

                  <div>
                    <p
                      className={`text-xs font-semibold ${service?.platformColor}`}
                    >
                      {service?.platform}
                    </p>

                    <h3 className="mt-0.5 text-sm font-bold">
                      {service?.service}
                    </h3>
                  </div>

                </div>

                <div className="text-right">
                  <p className="gold-gradient-text text-lg font-extrabold tabular-nums">
                    ₦
                    {service?.pricePerUnit?.toLocaleString('en-NG')}
                  </p>

                  <p className="text-[11px] text-muted-foreground">
                    {service?.unit}
                  </p>
                </div>

              </div>

              {/* Service description */}
              <p className="mb-5 flex-1 text-sm leading-7 text-muted-foreground">
                {service?.description}
              </p>

              {/* Service information */}
              <div className="mb-5 grid grid-cols-2 gap-2">

                <div className="rounded-lg bg-muted/30 p-3 text-center">
                  <Clock
                    size={14}
                    className="mx-auto mb-1.5 text-primary"
                    aria-hidden="true"
                  />

                  <p className="text-xs font-semibold">
                    {service?.delivery}
                  </p>

                  <p className="text-[10px] text-muted-foreground">
                    Estimated start
                  </p>
                </div>

                <div className="rounded-lg bg-muted/30 p-3 text-center">
                  <TrendingUp
                    size={14}
                    className="mx-auto mb-1.5 text-primary"
                    aria-hidden="true"
                  />

                  <p className="text-xs font-semibold tabular-nums">
                    {service?.minQty?.toLocaleString()}
                  </p>

                  <p className="text-[10px] text-muted-foreground">
                    Minimum order
                  </p>
                </div>

              </div>

              {/* Order button */}
              <Link
                href="/order-form"
                className="btn-outline-gold flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all group-hover:btn-primary"
                aria-label={`Order ${service?.service} for ${service?.platform}`}
              >
                <ShoppingCart size={14} aria-hidden="true" />
                Order Now
                <ArrowRight size={14} aria-hidden="true" />
              </Link>

            </article>
          ))}
        </div>

        {/* Browse all services */}
        <div className="text-center">
          <p className="mx-auto mb-4 max-w-xl text-xs leading-6 text-muted-foreground">
            Looking for another platform or service? Browse the complete
            service catalog to see all currently available options.
          </p>

          <Link
            href="/service-catalog"
            className="btn-primary inline-flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-semibold"
          >
            Explore All Services
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

      </div>
    </section>
  );
}