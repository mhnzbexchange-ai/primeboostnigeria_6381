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
    <section className="bg-background py-24">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">

        {/* Section heading */}
        <div className="mb-14 text-center">
          <p className="section-label mb-3">
            OUR SERVICES
          </p>

          <h2 className="text-hero-md mb-4 font-bold">
            Social Media{' '}
            <span className="gold-gradient-text">
              Promotion Services
            </span>
          </h2>

          <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground">
            Choose from our available social media promotion services.
            Pricing is displayed in Nigerian Naira so you can see the cost
            before placing an order.
          </p>

          <p className="mt-3 text-xs text-muted-foreground">
            Minimum order: {MINIMUM_ORDER_QTY?.toLocaleString()} units
          </p>
        </div>

        {/* Services */}
        <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services?.map((service) => (
            <div
              key={service?.id}
              className="card-base card-gradient-bg group flex flex-col transition-all duration-300 hover:border-primary/40 hover:glow-gold-sm"
            >

              {/* Service header */}
              <div className="mb-5 flex items-start justify-between gap-4">

                <div className="flex items-center gap-3">

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${service?.platformBg}`}
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

                    <p className="mt-0.5 text-sm font-bold">
                      {service?.service}
                    </p>
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

              {/* Description */}
              <p className="mb-5 flex-1 text-sm leading-relaxed text-muted-foreground">
                {service?.description}
              </p>

              {/* Service information */}
              <div className="mb-5 grid grid-cols-2 gap-2">

                <div className="rounded-lg bg-muted/30 p-3 text-center">
                  <Clock
                    size={14}
                    className="mx-auto mb-1.5 text-primary"
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
              >
                <ShoppingCart size={14} />
                Order Now
                <ArrowRight size={14} />
              </Link>

            </div>
          ))}
        </div>

        {/* All services */}
        <div className="text-center">
          <Link
            href="/service-catalog"
            className="btn-primary inline-flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-semibold"
          >
            Explore All Services
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
}