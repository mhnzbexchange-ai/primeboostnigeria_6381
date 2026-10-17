'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Clock,
  ArrowRight,
  SlidersHorizontal,
  ShieldCheck,
  Info,
  X,
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

const platformIcon: Record<string, string> = {
  TikTok: '🎵',
  Instagram: '📸',
  Telegram: '✈️',
  Snapchat: '👻',
  'X (Twitter)': '𝕏',
  YouTube: '▶️',
};

type SortOption =
  | 'price-asc' |'price-desc' |'popular' |'delivery';

const extractMinutes = (value: string): number => {
  const text = value.toLowerCase();
  const hourMatch = text.match(/(\d+(?:\.\d+)?)\s*hour/);
  const minuteMatch = text.match(/(\d+(?:\.\d+)?)\s*min/);
  if (hourMatch) return Number(hourMatch[1]) * 60;
  if (minuteMatch) return Number(minuteMatch[1]);
  return Number.MAX_SAFE_INTEGER;
};

const formatMax = (max: number): string =>
  max >= 1000000
    ? `${(max / 1000000).toFixed(1)}M`
    : `${(max / 1000).toFixed(0)}K`;

export default function ServiceCatalogContent() {
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popular');

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('platform');
    if (requested && PLATFORMS.includes(requested)) {
      setSelectedPlatform(requested);
    }
  }, []);

  const filtered = useMemo(() => {
    let result = [...ALL_SERVICES];

    if (selectedPlatform !== 'All') {
      result = result.filter(
        (service) => service.platform === selectedPlatform
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter(
        (service) =>
          service.category === selectedCategory.toLowerCase()
      );
    }

    if (search.trim()) {
      const query = search.toLowerCase().trim();
      result = result.filter(
        (service) =>
          service.service.toLowerCase().includes(query) ||
          service.platform.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query)
      );
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.pricePerUnit - b.pricePerUnit);
    }
    if (sortBy === 'price-desc') {
      result.sort((a, b) => b.pricePerUnit - a.pricePerUnit);
    }
    if (sortBy === 'popular') {
      result.sort(
        (a, b) => Number(b.popular) - Number(a.popular)
      );
    }
    if (sortBy === 'delivery') {
      result.sort(
        (a, b) =>
          extractMinutes(a.delivery) - extractMinutes(b.delivery)
      );
    }

    return result;
  }, [selectedPlatform, selectedCategory, search, sortBy]);

  const platformCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: ALL_SERVICES.length,
    };
    ALL_SERVICES.forEach((s) => {
      counts[s.platform] = (counts[s.platform] ?? 0) + 1;
    });
    return counts;
  }, []);

  const categoryCounts = useMemo(() => {
    const base =
      selectedPlatform === 'All'
        ? ALL_SERVICES
        : ALL_SERVICES.filter(
            (s) => s.platform === selectedPlatform
          );
    const counts: Record<string, number> = { All: base.length };
    base.forEach((s) => {
      const key =
        s.category.charAt(0).toUpperCase() + s.category.slice(1);
      counts[key] = (counts[key] ?? 0) + 1;
    });
    return counts;
  }, [selectedPlatform]);

  const visibleCategories = useMemo(
    () =>
      categories.filter(
        (c) => c === 'All' || (categoryCounts[c] ?? 0) > 0
      ),
    [categoryCounts]
  );

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
    setSelectedCategory('All');
  };

  const hasActiveFilters =
    search.trim() !== '' ||
    selectedPlatform !== 'All' ||
    selectedCategory !== 'All';

  const clearFilters = () => {
    setSearch('');
    setSelectedPlatform('All');
    setSelectedCategory('All');
    setSortBy('popular');
  };

  const resultsKey = `${selectedPlatform}|${selectedCategory}|${sortBy}|${search.trim()}`;

  return (
    <div className="space-y-5 sm:space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold">
            Social Media Service Catalog
          </h1>

          <p className="text-sm text-muted-foreground mt-1 max-w-3xl leading-relaxed">
            Browse the social media promotion services currently
            available on PrimeBoost Nigeria. Prices are shown in
            Nigerian Naira (₦) so you can review the cost before
            placing an order.
          </p>

          <p className="text-xs text-muted-foreground mt-2">
            {ALL_SERVICES.length} services
            {' · '}
            Min. order {MINIMUM_ORDER_QTY.toLocaleString('en-NG')}
          </p>
        </div>

        <Link
          href="/order-form"
          className="btn-primary flex min-h-[44px] w-full sm:w-auto items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
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
          <div className="min-w-0">
            <h2 className="text-sm font-bold">Before You Order</h2>
            <p className="mt-1 text-xs sm:text-sm leading-6 text-muted-foreground">
              PrimeBoost provides promotional services for supported
              social media platforms. These services are intended to
              support visibility and promotional activity and should
              not be considered a replacement for organic audience
              growth.
            </p>
            <p className="mt-2 text-xs sm:text-sm leading-6 text-muted-foreground">
              Results, delivery times and retention can vary
              depending on the platform, service, order quantity and
              current provider availability. Please review the
              service information and requirements before placing an
              order.
            </p>
          </div>
        </div>
      </div>

      {/* Filter panel: sticky on mobile so filters stay reachable */}
      <section
        aria-label="Search and filter services"
        className="sticky top-0 z-20 -mx-3 border-y border-border bg-background/95 backdrop-blur sm:static sm:mx-0 sm:rounded-2xl sm:border sm:bg-card sm:backdrop-blur-none sm:shadow-sm"
      >
        {/* Row 1: search + sort */}
        <div className="flex flex-col gap-2 px-4 pt-3 pb-3 sm:flex-row sm:items-center sm:gap-3 sm:p-4">
          <div className="flex min-h-[44px] flex-1 items-center gap-2 rounded-xl border border-border bg-background px-3 focus-within:border-primary/50">
            <Search
              size={16}
              className="flex-shrink-0 text-muted-foreground"
            />
            <input
              type="search"
              placeholder="Search services or platforms"
              aria-label="Search services and platforms"
              className="w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Clear search"
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex min-h-[44px] items-center gap-2 rounded-xl border border-border bg-background px-3 sm:w-56">
            <SlidersHorizontal
              size={15}
              className="flex-shrink-0 text-muted-foreground"
            />
            <select
              aria-label="Sort services"
              className="w-full min-w-0 cursor-pointer bg-transparent text-sm text-foreground outline-none"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as SortOption)
              }
            >
              <option value="popular">Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="delivery">Fastest Start</option>
            </select>
          </div>
        </div>

        {/* Row 2: platform tabs (single-line, swipeable) */}
        <div className="border-t border-border/70 px-4 py-2.5 sm:px-4">
          <p className="section-label mb-2 hidden sm:block">
            Platform
          </p>
          <div
            role="tablist"
            aria-label="Filter by platform"
            className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 pb-0.5 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
          >
            {platforms.map((platform) => {
              const active = selectedPlatform === platform;
              return (
                <button
                  key={`platform-filter-${platform
                    .toLowerCase()
                    .replace(/[\s()]/g, '-')}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handlePlatformChange(platform)}
                  className={`inline-flex min-h-[40px] flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-sm font-semibold transition-colors duration-200 ${
                    active
                      ? 'gold-gradient-bg border-transparent text-primary-foreground'
                      : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  }`}
                >
                  {platformIcon[platform] && (
                    <span aria-hidden="true">
                      {platformIcon[platform]}
                    </span>
                  )}
                  {platform}
                  <span
                    className={`text-[11px] font-medium tabular-nums ${
                      active ? 'opacity-80' : 'text-muted-foreground'
                    }`}
                  >
                    {platformCounts[platform] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 3: service type chips (single-line, swipeable) */}
        <div className="border-t border-border/70 px-4 py-2.5 sm:px-4">
          <p className="section-label mb-2 hidden sm:block">
            Service type
          </p>
          <div
            role="group"
            aria-label="Filter by service type"
            className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 pb-0.5 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
          >
            {visibleCategories.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={`cat-filter-${category.toLowerCase()}`}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedCategory(category)}
                  className={`inline-flex min-h-[36px] flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border px-3 text-xs font-semibold transition-colors duration-200 ${
                    active
                      ? 'border-primary/40 bg-primary/15 text-primary' :'border-transparent bg-muted/60 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {category}
                  <span className="tabular-nums opacity-70">
                    {categoryCounts[category] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Results bar */}
      <div className="flex items-center justify-between gap-3">
        <p
          className="min-w-0 truncate text-xs text-muted-foreground"
          aria-live="polite"
        >
          Showing{' '}
          <span className="font-semibold text-foreground">
            {filtered.length}
          </span>{' '}
          {filtered.length === 1 ? 'service' : 'services'}
          {selectedPlatform !== 'All' && (
            <>
              {' '}
              on{' '}
              <span className="text-primary">{selectedPlatform}</span>
            </>
          )}
          {selectedCategory !== 'All' && (
            <>
              {' · '}
              <span className="text-primary">{selectedCategory}</span>
            </>
          )}
        </p>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="min-h-[36px] flex-shrink-0 px-2 text-xs font-semibold text-primary hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Service grid */}
      {filtered.length > 0 ? (
        <div
          key={resultsKey}
          className="catalog-fade-in grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        >
          {filtered.map((service) => {
            const minTotal = Math.round(
              service.pricePerUnit * service.minQty
            );

            return (
              <article
                key={service.id}
                className="card-base card-gradient-bg group relative flex flex-col !p-4 transition-colors duration-200 hover:border-primary/40"
              >
                {/* Header: icon, platform, name, badge */}
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${service.platformBg}`}
                  >
                    <span className="text-xl" aria-hidden="true">
                      {service.emoji}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-xs font-semibold ${service.platformColor}`}
                    >
                      {service.platform}
                    </p>
                    <h2 className="truncate text-sm font-bold">
                      {service.service}
                    </h2>
                  </div>

                  {service.popular && (
                    <span className="badge-base status-completed flex-shrink-0 whitespace-nowrap text-[10px]">
                      ⭐ Popular
                    </span>
                  )}
                </div>

                {/* Description: clamped to 2 lines */}
                <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {service.description}
                </p>

                {/* Key facts: each on a single line */}
                <dl className="mt-3 divide-y divide-border/60 rounded-xl border border-primary/15 bg-primary/5 text-xs">
                  <div className="flex items-center justify-between gap-3 px-3 py-2">
                    <dt className="flex-shrink-0 text-muted-foreground">
                      Price
                    </dt>
                    <dd className="truncate text-right font-extrabold tabular-nums text-primary">
                      ₦{service.pricePerUnit.toLocaleString('en-NG')}{' '}
                      <span className="font-medium text-muted-foreground">
                        {service.unit}
                      </span>
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3 px-3 py-2">
                    <dt className="flex-shrink-0 text-muted-foreground">
                      Min. quantity
                    </dt>
                    <dd className="truncate font-semibold tabular-nums">
                      {service.minQty.toLocaleString('en-NG')}
                      <span className="font-normal text-muted-foreground">
                        {' '}
                        · ₦{minTotal.toLocaleString('en-NG')}
                      </span>
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3 px-3 py-2">
                    <dt className="flex flex-shrink-0 items-center gap-1 text-muted-foreground">
                      <Clock size={12} aria-hidden="true" />
                      Start
                    </dt>
                    <dd className="truncate font-semibold">
                      {service.delivery.replace(
                        /^Usually starts within\s*/i,
                        '≈ '
                      )}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3 px-3 py-2">
                    <dt className="flex-shrink-0 text-muted-foreground">
                      Max. quantity
                    </dt>
                    <dd className="truncate font-semibold tabular-nums">
                      {formatMax(service.maxQty)}
                    </dd>
                  </div>
                </dl>

                {/* Order button */}
                <Link
                  href={`/order-form?service=${service.id}`}
                  aria-label={`Order ${service.platform} ${service.service}`}
                  className="btn-outline-gold mt-3 flex min-h-[44px] items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-colors group-hover:gold-gradient-bg group-hover:border-transparent group-hover:text-primary-foreground"
                >
                  <span className="truncate">Order now</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="catalog-fade-in py-16 text-center">
          <div className="mb-4 text-5xl" aria-hidden="true">
            🔍
          </div>
          <h3 className="mb-2 text-lg font-bold">
            No services found
          </h3>
          <p className="mb-6 text-sm text-muted-foreground">
            No services match your current filters. Try adjusting
            your search or filters.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="btn-primary min-h-[44px] rounded-xl px-6 py-2.5 text-sm font-semibold"
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

          <div className="min-w-0">
            <h2 className="text-sm font-bold">
              Service Information & Transparency
            </h2>

            <div className="mt-3 space-y-2 text-xs sm:text-sm leading-6 text-muted-foreground">
              <p>
                Prices shown in this catalog are the current listed
                prices for the selected services. The final order
                amount is calculated from the selected service and
                quantity.
              </p>

              <p>
                Estimated start or delivery times are provided as
                general guidance and may vary depending on order
                size, platform conditions and provider availability.
              </p>

              <p>
                Promotion services are not the same as organic
                audience growth. We recommend creating quality
                content and following the rules of the relevant
                social media platform alongside any promotional
                activity.
              </p>

              <p>
                Service availability, pricing, minimum quantities
                and other terms may change. Please review the
                information displayed before confirming an order.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}