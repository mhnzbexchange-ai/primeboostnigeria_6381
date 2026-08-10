'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Clock,
  TrendingUp,
  Users,
  ArrowRight,
  Filter,
  SlidersHorizontal,
  ShieldCheck,
  Info,
} from 'lucide-react';
import {
  ALL_SERVICES,
  PLATFORMS,
  MINIMUM_ORDER_QTY,
} from '@/lib/pricing';

const platforms = ['All', ...PLATFORMS];

const categories = [
  'All',
  'Followers',
  'Likes',
  'Views',
  'Subscribers',
  'Members',
];

type SortOption =
  | 'price-asc'
  | 'price-desc'
  | 'popular'
  | 'delivery';

export default function ServiceCatalogContent() {
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] =
    useState<SortOption>('popular');

  const filtered = useMemo(() => {
    let result = [...ALL_SERVICES];

    // Platform filter
    if (selectedPlatform !== 'All') {
      result = result.filter(
        (service) =>
          service.platform === selectedPlatform
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(
        (service) =>
          service.category ===
          selectedCategory.toLowerCase()
      );
    }

    // Search
    if (search.trim()) {
      const query = search.toLowerCase().trim();

      result = result.filter((service) => {
        return (
          service.service
            .toLowerCase()
            .includes(query) ||
          service.platform
            .toLowerCase()
            .includes(query) ||
          service.description
            .toLowerCase()
            .includes(query)
        );
      });
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort(
        (a, b) =>
          a.pricePerUnit - b.pricePerUnit
      );
    }

    if (sortBy === 'price-desc') {
      result.sort(
        (a, b) =>
          b.pricePerUnit - a.pricePerUnit
      );
    }

    if (sortBy === 'popular') {
      result.sort(
        (a, b) =>
          Number(b.popular) - Number(a.popular)
      );
    }

    if (sortBy === 'delivery') {
      result.sort((a, b) => {
        const extractMinutes = (
          value: string
        ): number => {
          const text = value.toLowerCase();

          const hourMatch =
            text.match(/(\d+(?:\.\d+)?)\s*hour/);

          const minuteMatch =
            text.match(/(\d+(?:\.\d+)?)\s*min/);

          if (hourMatch) {
            return (
              Number(hourMatch[1]) * 60
            );
          }

          if (minuteMatch) {
            return Number(minuteMatch[1]);
          }

          return Number.MAX_SAFE_INTEGER;
        };

        return (
          extractMinutes(a.delivery) -
          extractMinutes(b.delivery)
        );
      });
    }

    return result;
  }, [
    selectedPlatform,
    selectedCategory,
    search,
    sortBy,
  ]);

  const clearFilters = () => {
    setSearch('');
    setSelectedPlatform('All');
    setSelectedCategory('All');
    setSortBy('popular');
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Social Media Service Catalog
          </h1>

          <p className="text-sm text-muted-foreground mt-1 max-w-3xl leading-relaxed">
            Browse the social media promotion services
            currently available on PrimeBoost Nigeria.
            Prices are displayed in Nigerian Naira (₦)
            so you can review the cost before placing an
            order.
          </p>

          <p className="text-xs text-muted-foreground mt-2">
            {ALL_SERVICES.length} services available
            {' · '}
            Minimum order: {MINIMUM_ORDER_QTY.toLocaleString()}
            {' · '}
            Prices shown before checkout
          </p>
        </div>

        <Link
          href="/order-form"
          className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
        >
          Place Order
          <ArrowRight size={15} />
        </Link>
      </div>

      {/* Important information */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Info
            size={20}
            className="mt-0.5 flex-shrink-0 text-primary"
          />

          <div>
            <h2 className="text-sm font-bold">
              Before You Order
            </h2>

            <p className="mt-1 text-xs sm:text-sm leading-6 text-muted-foreground">
              PrimeBoost provides promotional services for
              supported social media platforms. These
              services are intended to support visibility
              and promotional activity and should not be
              considered a replacement for organic audience
              growth.
            </p>

            <p className="mt-2 text-xs sm:text-sm leading-6 text-muted-foreground">
              Results, delivery times and retention can vary
              depending on the platform, service, order
              quantity and current provider availability.
              Please review the service information and
              requirements before placing an order.
            </p>
          </div>
        </div>
      </div>

      {/* Search + Sort */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-muted/40 rounded-xl px-3 py-2.5 flex-1 min-w-[200px]">
          <Search
            size={15}
            className="text-muted-foreground flex-shrink-0"
          />

          <input
            type="text"
            placeholder="Search services, platforms..."
            aria-label="Search services and platforms"
            className="bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground w-full"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <div className="flex items-center gap-2 bg-muted/40 rounded-xl px-3 py-2.5">
          <SlidersHorizontal
            size={14}
            className="text-muted-foreground"
          />

          <select
            aria-label="Sort services"
            className="bg-transparent text-sm outline-none text-foreground cursor-pointer"
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value as SortOption
              )
            }
          >
            <option value="popular">
              Most Popular
            </option>

            <option value="price-asc">
              Price: Low to High
            </option>

            <option value="price-desc">
              Price: High to Low
            </option>

            <option value="delivery">
              Fastest Estimated Start
            </option>
          </select>
        </div>
      </div>

      {/* Platform filter */}
      <div>
        <p className="section-label mb-3">
          FILTER BY PLATFORM
        </p>

        <div className="flex flex-wrap gap-2">
          {platforms.map((platform) => (
            <button
              key={`platform-filter-${platform
                .toLowerCase()
                .replace(/[\s()]/g, '-')}`}
              type="button"
              onClick={() =>
                setSelectedPlatform(platform)
              }
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                selectedPlatform === platform
                  ? 'gold-gradient-bg text-primary-foreground border-transparent glow-gold-sm'
                  : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/40 bg-transparent'
              }`}
            >
              {platform === 'TikTok' && '🎵 '}
              {platform === 'Instagram' && '📸 '}
              {platform === 'Telegram' && '✈️ '}
              {platform === 'Snapchat' && '👻 '}
              {platform === 'X (Twitter)' && '𝕏 '}
              {platform === 'YouTube' && '▶️ '}

              {platform}
            </button>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div>
        <p className="section-label mb-3">
          FILTER BY SERVICE TYPE
        </p>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={`cat-filter-${category.toLowerCase()}`}
              type="button"
              onClick={() =>
                setSelectedCategory(category)
              }
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === category
                  ? 'bg-primary/20 text-primary border border-primary/40'
                  : 'bg-muted/40 text-muted-foreground hover:text-foreground border border-transparent'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center gap-2">
        <Filter
          size={13}
          className="text-muted-foreground"
        />

        <p className="text-xs text-muted-foreground">
          Showing{' '}
          <span className="font-semibold text-foreground">
            {filtered.length}
          </span>{' '}
          services

          {selectedPlatform !== 'All' && (
            <>
              {' '}
              for{' '}
              <span className="text-primary">
                {selectedPlatform}
              </span>
            </>
          )}
        </p>
      </div>

      {/* Service grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">

          {filtered.map((service) => {
            const minTotal = Math.round(
              service.pricePerUnit *
                service.minQty
            );

            return (
              <article
                key={service.id}
                className="card-base card-gradient-bg group hover:border-primary/40 transition-all duration-300 hover:glow-gold-sm flex flex-col relative"
              >

                {/* Popular badge */}
                {service.popular && (
                  <div className="absolute top-3 right-3">
                    <span className="badge-base status-completed text-[10px]">
                      ⭐ Popular
                    </span>
                  </div>
                )}

                {/* Platform + service header */}
                <div className="flex items-center gap-2.5 mb-3">
                  <div
                    className={`p-2 rounded-lg ${service.platformBg} flex-shrink-0`}
                  >
                    <span className="text-xl">
                      {service.emoji}
                    </span>
                  </div>

                  <div>
                    <p
                      className={`text-xs font-semibold ${service.platformColor}`}
                    >
                      {service.platform}
                    </p>

                    <h2 className="font-bold text-sm">
                      {service.service}
                    </h2>
                  </div>
                </div>

                {/* Service type */}
                <div className="mb-3">
                  <span
                    className={`badge-base text-[10px] ${
                      service.quality === 'Premium'
                        ? 'status-completed'
                        : service.quality === 'High'
                        ? 'status-processing'
                        : 'status-cancelled'
                    }`}
                  >
                    {service.quality} Service
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">
                  {service.description}
                </p>

                {/* Pricing */}
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/15 mb-4">

                  <div className="flex items-center justify-between mb-1 gap-3">
                    <span className="text-xs text-muted-foreground">
                      Price per unit
                    </span>

                    <span className="font-extrabold gold-gradient-text tabular-nums text-right">
                      ₦
                      {service.pricePerUnit.toLocaleString(
                        'en-NG'
                      )}{' '}
                      {service.unit}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-1 gap-3">
                    <span className="text-xs text-muted-foreground">
                      Minimum quantity
                    </span>

                    <span className="text-xs font-semibold tabular-nums">
                      {service.minQty.toLocaleString(
                        'en-NG'
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">
                      Minimum order total
                    </span>

                    <span className="text-xs font-semibold tabular-nums">
                      ₦
                      {minTotal.toLocaleString(
                        'en-NG'
                      )}
                    </span>
                  </div>
                </div>

                {/* Service information */}
                <div className="grid grid-cols-3 gap-1.5 mb-4">

                  <div className="bg-muted/30 rounded-lg p-2 text-center">
                    <Clock
                      size={11}
                      className="text-muted-foreground mx-auto mb-0.5"
                    />

                    <p className="text-[10px] font-semibold leading-tight">
                      {service.delivery}
                    </p>

                    <p className="text-[9px] text-muted-foreground">
                      Estimated start
                    </p>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-2 text-center">
                    <TrendingUp
                      size={11}
                      className="text-muted-foreground mx-auto mb-0.5"
                    />

                    <p className="text-[10px] font-semibold leading-tight tabular-nums">
                      {service.minQty.toLocaleString()}
                    </p>

                    <p className="text-[9px] text-muted-foreground">
                      Minimum
                    </p>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-2 text-center">
                    <Users
                      size={11}
                      className="text-muted-foreground mx-auto mb-0.5"
                    />

                    <p className="text-[10px] font-semibold leading-tight tabular-nums">
                      {service.maxQty >= 1000000
                        ? `${(
                            service.maxQty /
                            1000000
                          ).toFixed(1)}M`
                        : `${(
                            service.maxQty /
                            1000
                          ).toFixed(0)}K`}
                    </p>

                    <p className="text-[9px] text-muted-foreground">
                      Maximum
                    </p>
                  </div>

                </div>

                {/* Order button */}
                <Link
                  href={`/order-form?service=${service.id}`}
                  className="btn-outline-gold flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold group-hover:gold-gradient-bg group-hover:text-primary-foreground group-hover:border-transparent transition-all"
                >
                  Order {service.service}
                  <ArrowRight size={13} />
                </Link>

              </article>
            );
          })}

        </div>
      ) : (
        /* No results */
        <div className="text-center py-20">

          <div className="text-5xl mb-4">
            🔍
          </div>

          <h3 className="font-bold text-lg mb-2">
            No services found
          </h3>

          <p className="text-sm text-muted-foreground mb-6">
            No services match your current filters.
            Try adjusting your search or filters.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold"
          >
            Clear All Filters
          </button>

        </div>
      )}

      {/* Transparency / service information */}
      <section className="mt-10 rounded-2xl border border-border bg-card/60 p-5 sm:p-6">

        <div className="flex items-start gap-3">
          <ShieldCheck
            size={21}
            className="mt-0.5 flex-shrink-0 text-primary"
          />

          <div>
            <h2 className="text-sm font-bold">
              Service Information & Transparency
            </h2>

            <div className="mt-3 space-y-2 text-xs sm:text-sm leading-6 text-muted-foreground">

              <p>
                Prices shown in this catalog are the current
                listed prices for the selected services.
                The final order amount is calculated from
                the selected service and quantity.
              </p>

              <p>
                Estimated start or delivery times are
                provided as general guidance and may vary
                depending on order size, platform conditions
                and provider availability.
              </p>

              <p>
                Promotion services are not the same as
                organic audience growth. We recommend
                creating quality content and following the
                rules of the relevant social media platform
                alongside any promotional activity.
              </p>

              <p>
                Service availability, pricing, minimum
                quantities and other terms may change.
                Please review the information displayed
                before confirming an order.
              </p>

            </div>
          </div>
        </div>

      </section>

    </div>
  );
}