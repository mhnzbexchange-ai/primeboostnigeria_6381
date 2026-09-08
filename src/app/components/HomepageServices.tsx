import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Clock,
  ShoppingCart,
  TrendingUp,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { ALL_SERVICES, MINIMUM_ORDER_QTY } from '@/lib/pricing';

const FEATURED_IDS = [
  'svc-tt-followers',
  'svc-ig-likes',
  'svc-fb-followers',
  'svc-fb-page-likes',
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
      className="relative overflow-hidden bg-background py-24 sm:py-28"
      aria-labelledby="services-heading"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-screen-xl px-4 lg:px-8">

        {/* Section heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
            <Sparkles
              size={14}
              className="text-primary"
              aria-hidden="true"
            />

            <span className="text-xs font-bold tracking-widest text-primary">
              PREMIUM SERVICES
            </span>
          </div>

          <h2
            id="services-heading"
            className="text-hero-md font-bold tracking-tight"
          >
            Grow Your{' '}
            <span className="gold-gradient-text">
              Social Presence
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Choose from professional social media promotion services designed
            for creators, businesses, brands, and individuals. See clear
            pricing and order requirements before you begin.
          </p>

          {/* Trust indicators */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">

            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-xs font-semibold text-muted-foreground backdrop-blur">
              <ShieldCheck
                size={14}
                className="text-primary"
                aria-hidden="true"
              />
              Transparent pricing
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-xs font-semibold text-muted-foreground backdrop-blur">
              <TrendingUp
                size={14}
                className="text-primary"
                aria-hidden="true"
              />
              Multiple platforms
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-xs font-semibold text-muted-foreground backdrop-blur">
              <Clock
                size={14}
                className="text-primary"
                aria-hidden="true"
              />
              Fast service delivery
            </div>

          </div>

          <p className="mt-5 text-xs font-medium text-muted-foreground">
            General minimum order: {MINIMUM_ORDER_QTY?.toLocaleString()} units.
            Individual services may have different minimum requirements.
          </p>

        </div>

        {/* Featured services */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

          {services?.map((service) => (
            <article
              key={service?.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card/70 p-5 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:glow-gold-sm"
            >

              {/* Top accent */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Service header */}
              <div className="mb-5 flex items-start justify-between gap-3">

                <div className="flex min-w-0 items-center gap-3">

                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${service?.platformBg} transition-transform duration-300 group-hover:scale-105`}
                    aria-hidden="true"
                  >
                    <span className="text-xl">
                      {service?.emoji}
                    </span>
                  </div>

                  <div className="min-w-0">

                    <p
                      className={`text-[11px] font-bold uppercase tracking-wider ${service?.platformColor}`}
                    >
                      {service?.platform}
                    </p>

                    <h3 className="mt-1 truncate text-sm font-bold text-foreground">
                      {service?.service}
                    </h3>

                  </div>

                </div>

                <div className="shrink-0 text-right">

                  <p className="gold-gradient-text text-lg font-extrabold tabular-nums">
                    ₦{service?.pricePerUnit?.toLocaleString('en-NG')}
                  </p>

                  <p className="text-[10px] text-muted-foreground">
                    {service?.unit}
                  </p>

                </div>

              </div>

              {/* Service description */}
              <p className="mb-5 min-h-[72px] text-sm leading-6 text-muted-foreground">
                {service?.description}
              </p>

              {/* Service information */}
              <div className="mb-5 grid grid-cols-2 gap-2">

                <div className="rounded-xl border border-border/60 bg-muted/20 p-3 text-center transition-colors group-hover:bg-muted/30">

                  <Clock
                    size={14}
                    className="mx-auto mb-1.5 text-primary"
                    aria-hidden="true"
                  />

                  <p className="text-xs font-bold">
                    {service?.delivery}
                  </p>

                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    Estimated start
                  </p>

                </div>

                <div className="rounded-xl border border-border/60 bg-muted/20 p-3 text-center transition-colors group-hover:bg-muted/30">

                  <TrendingUp
                    size={14}
                    className="mx-auto mb-1.5 text-primary"
                    aria-hidden="true"
                  />

                  <p className="text-xs font-bold tabular-nums">
                    {service?.minQty?.toLocaleString()}
                  </p>

                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    Minimum order
                  </p>

                </div>

              </div>

              {/* Order button */}
              <Link
                href="/order-form"
                className="mt-auto flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/5 py-3 text-sm font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                aria-label={`Order ${service?.service} for ${service?.platform}`}
              >
                <ShoppingCart
                  size={14}
                  aria-hidden="true"
                />

                Order Now

                <ArrowRight
                  size={14}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

            </article>
          ))}

        </div>

        {/* Browse all services */}
        <div className="mt-14 text-center">

          <div className="mx-auto mb-5 h-px max-w-xs bg-gradient-to-r from-transparent via-border to-transparent" />

          <p className="mx-auto mb-5 max-w-xl text-xs leading-6 text-muted-foreground">
            Looking for something specific? Explore our complete catalog to
            discover all available platforms and promotion services.
          </p>

          <Link
            href="/service-catalog"
            className="btn-primary inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold shadow-lg transition-transform hover:-translate-y-0.5"
          >
            Explore All Services
            <ArrowRight
              size={16}
              aria-hidden="true"
            />
          </Link>

        </div>

      </div>
    </section>
  );
}