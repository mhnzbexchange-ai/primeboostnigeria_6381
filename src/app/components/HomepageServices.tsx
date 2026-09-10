import React from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, ShoppingCart, TrendingUp, Sparkles, ShieldCheck } from 'lucide-react';
import { ALL_SERVICES, MINIMUM_ORDER_QTY } from '@/lib/pricing';
import Icon from '@/components/ui/AppIcon';


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

const services = ALL_SERVICES?.filter((service) => FEATURED_IDS?.includes(service?.id));

export default function HomepageServices() {
  return (
    <section
      id="services"
      className="relative overflow-hidden bg-background py-24 sm:py-28"
      aria-labelledby="services-heading"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/6 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-80 w-80 rounded-full bg-accent/4 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-screen-xl px-4 lg:px-8">

        {/* Section heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
            <Sparkles size={13} className="text-primary" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              Featured Services
            </span>
          </div>

          <h2 id="services-heading" className="text-hero-md font-bold tracking-tight">
            Grow Your{' '}
            <span className="gold-gradient-text">Social Presence</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Professional social media promotion services for creators, businesses, and brands.
            Clear pricing, minimum quantities, and delivery info — before you order.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {[
              { icon: ShieldCheck, label: 'Transparent pricing' },
              { icon: TrendingUp, label: 'Multiple platforms' },
              { icon: Clock, label: 'Fast delivery' },
            ]?.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-[12px] font-semibold text-muted-foreground backdrop-blur"
              >
                <Icon size={13} className="text-primary" aria-hidden="true" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {services?.map((service) => (
            <article
              key={service?.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] hover:glow-gold-sm"
            >
              {/* Top shimmer on hover */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Service header */}
              <div className="mb-5 flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${service?.platformBg} transition-transform duration-300 group-hover:scale-110`}
                    aria-hidden="true"
                  >
                    <span className="text-xl">{service?.emoji}</span>
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${service?.platformColor}`}>
                      {service?.platform}
                    </p>
                    <h3 className="mt-0.5 truncate text-sm font-bold text-foreground">
                      {service?.service}
                    </h3>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="gold-gradient-text text-lg font-extrabold tabular-nums">
                    ₦{service?.pricePerUnit?.toLocaleString('en-NG')}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{service?.unit}</p>
                </div>
              </div>

              {/* Description */}
              <p className="mb-5 min-h-[64px] text-[13px] leading-6 text-muted-foreground">
                {service?.description}
              </p>

              {/* Meta info */}
              <div className="mb-5 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-border/50 bg-muted/15 p-3 text-center transition-colors group-hover:bg-muted/25">
                  <Clock size={13} className="mx-auto mb-1.5 text-primary" aria-hidden="true" />
                  <p className="text-[11px] font-bold">{service?.delivery}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">Est. start</p>
                </div>
                <div className="rounded-xl border border-border/50 bg-muted/15 p-3 text-center transition-colors group-hover:bg-muted/25">
                  <TrendingUp size={13} className="mx-auto mb-1.5 text-primary" aria-hidden="true" />
                  <p className="text-[11px] font-bold tabular-nums">{service?.minQty?.toLocaleString()}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">Min. order</p>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/order-form"
                className="mt-auto flex items-center justify-center gap-2 rounded-xl border border-primary/35 bg-primary/6 py-3 text-sm font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                aria-label={`Order ${service?.service} for ${service?.platform}`}
              >
                <ShoppingCart size={14} aria-hidden="true" />
                Order Now
                <ArrowRight size={14} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </article>
          ))}
        </div>

        {/* Browse all */}
        <div className="mt-14 text-center">
          <div className="mx-auto mb-5 h-px max-w-xs bg-gradient-to-r from-transparent via-border to-transparent" />
          <p className="mx-auto mb-6 max-w-xl text-[13px] leading-6 text-muted-foreground">
            Explore our complete catalog to discover all available platforms and promotion services.
            General minimum order: {MINIMUM_ORDER_QTY?.toLocaleString()} units.
          </p>
          <Link
            href="/service-catalog"
            className="btn-primary inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all duration-300 hover:-translate-y-0.5"
          >
            View All Services
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>

      </div>
    </section>
  );
}