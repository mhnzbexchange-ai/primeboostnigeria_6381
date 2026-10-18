import React from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, ShoppingCart } from 'lucide-react';
import { ALL_SERVICES, MINIMUM_ORDER_QTY } from '@/lib/pricing';
import PlatformIcon, { PLATFORM_META } from './PlatformIcon';

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

const featured = ALL_SERVICES.filter((s) => FEATURED_IDS.includes(s.id));

const formatNaira = (value: number): string => `₦${value.toLocaleString('en-NG')}`;

const platformStats = PLATFORM_META.map((meta) => {
  const items = ALL_SERVICES.filter((s) => s.platform === meta.catalogName);
  const lowest = items.length ? Math.min(...items.map((s) => s.pricePerUnit)) : null;
  return { ...meta, count: items.length, lowest };
}).filter((p) => p.count > 0);

const platformKeyByName: Record<string, string> = Object.fromEntries(
  PLATFORM_META.map((p) => [p.catalogName, p.key])
);
const platformColorByName: Record<string, string> = Object.fromEntries(
  PLATFORM_META.map((p) => [p.catalogName, p.color])
);

export default function HomepageServices() {
  return (
    <section id="services" className="bg-white py-16 sm:py-20" aria-labelledby="services-heading">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="section-label text-primary">Service discovery</p>
          <h2 id="services-heading" className="mt-2 text-hero-md font-bold text-navy">
            Choose a platform, then pick a service
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
            Every service shows its price in naira, minimum quantity and estimated start time before you order.
          </p>
        </div>

        {/* Platform categories */}
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {platformStats.map((p) => (
            <li key={p.key}>
              <Link
                href={`/service-catalog?platform=${encodeURIComponent(p.catalogName)}`}
                className="group flex h-full flex-col rounded-xl border border-border bg-white p-5 transition-all duration-150 hover:border-primary hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary"
                    style={{ color: p.color }}
                  >
                    <PlatformIcon platform={p.key} size={22} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-navy">{p.label}</h3>
                    <p className="text-[12px] text-muted-foreground">
                      {p.count} {p.count === 1 ? 'service' : 'services'}
                      {p.lowest !== null ? ` · from ${formatNaira(p.lowest)}` : ''}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-[13px] leading-6 text-muted-foreground">{p.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 pt-1 text-[13px] font-semibold text-primary">
                  View {p.label} services
                  <ArrowRight
                    size={14}
                    aria-hidden="true"
                    className="transition-transform duration-150 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Featured services */}
        <div className="mt-14">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <h3 className="text-lg font-bold text-navy">Popular services</h3>
            <Link
              href="/service-catalog"
              className="inline-flex min-h-[44px] items-center gap-1.5 text-[13px] font-semibold text-primary hover:underline"
            >
              View all services
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {featured.map((service) => (
              <article
                key={service.id}
                className="flex flex-col rounded-xl border border-border bg-white p-5 transition-shadow duration-150 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary"
                      style={{ color: platformColorByName[service.platform] }}
                    >
                      <PlatformIcon platform={platformKeyByName[service.platform] ?? ''} size={20} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {service.platform}
                      </p>
                      <h4 className="truncate text-sm font-bold text-navy">{service.service}</h4>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-lg font-extrabold tabular-nums text-navy">{formatNaira(service.pricePerUnit)}</p>
                    <p className="text-[11px] text-muted-foreground">{service.unit}</p>
                  </div>
                </div>

                <p className="mt-4 line-clamp-3 text-[13px] leading-6 text-muted-foreground">{service.description}</p>

                <dl className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-4 text-[12px]">
                  <div>
                    <dt className="text-muted-foreground">Min. order</dt>
                    <dd className="font-semibold tabular-nums text-navy">{service.minQty.toLocaleString('en-NG')}</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-1 text-muted-foreground">
                      <Clock size={11} aria-hidden="true" /> Delivery
                    </dt>
                    <dd className="font-semibold text-navy">{service.delivery}</dd>
                  </div>
                </dl>

                <Link
                  href="/order-form"
                  className="btn-primary mt-5 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md px-4 text-sm"
                  aria-label={`Order ${service.service} for ${service.platform}`}
                >
                  <ShoppingCart size={14} aria-hidden="true" />
                  Order Now
                </Link>
              </article>
            ))}
          </div>

          <p className="mt-6 text-[13px] text-muted-foreground">
            General minimum order: {MINIMUM_ORDER_QTY.toLocaleString('en-NG')} units. Facebook services have their own
            minimum shown on each service.
          </p>
        </div>
      </div>
    </section>
  );
}