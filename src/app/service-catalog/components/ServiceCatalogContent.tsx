'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Clock, TrendingUp, Users, ArrowRight, Filter, SlidersHorizontal } from 'lucide-react';
import { ALL_SERVICES, PLATFORMS, MINIMUM_ORDER_QTY } from '@/lib/pricing';

const platforms = ['All', ...PLATFORMS];
const categories = ['All', 'Followers', 'Likes', 'Views', 'Subscribers', 'Members'];

export default function ServiceCatalogContent() {
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'popular' | 'delivery'>('popular');

  const filtered = useMemo(() => {
    let result = [...ALL_SERVICES];
    if (selectedPlatform !== 'All') result = result.filter(s => s.platform === selectedPlatform);
    if (selectedCategory !== 'All') result = result.filter(s => s.category === selectedCategory.toLowerCase());
    if (search) result = result.filter(s =>
      s.service.toLowerCase().includes(search.toLowerCase()) ||
      s.platform.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
    );
    if (sortBy === 'price-asc') result.sort((a, b) => a.pricePerUnit - b.pricePerUnit);
    if (sortBy === 'price-desc') result.sort((a, b) => b.pricePerUnit - a.pricePerUnit);
    if (sortBy === 'popular') result.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    return result;
  }, [selectedPlatform, selectedCategory, search, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Service Catalog</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{ALL_SERVICES.length} services available · All prices in Nigerian Naira (₦) · Min. order: {MINIMUM_ORDER_QTY.toLocaleString()}</p>
        </div>
        <Link href="/order-form" className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold">
          Place Order <ArrowRight size={15} />
        </Link>
      </div>

      {/* Search + Sort */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-muted/40 rounded-xl px-3 py-2.5 flex-1 min-w-[200px]">
          <Search size={15} className="text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            placeholder="Search services, platforms..."
            className="bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 bg-muted/40 rounded-xl px-3 py-2.5">
          <SlidersHorizontal size={14} className="text-muted-foreground" />
          <select
            className="bg-transparent text-sm outline-none text-foreground cursor-pointer"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          >
            <option value="popular">Most Popular</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="delivery">Fastest Delivery</option>
          </select>
        </div>
      </div>

      {/* Platform filter */}
      <div>
        <p className="section-label mb-3">FILTER BY PLATFORM</p>
        <div className="flex flex-wrap gap-2">
          {platforms.map((p) => (
            <button
              key={`platform-filter-${p.toLowerCase().replace(/[\s()]/g, '-')}`}
              onClick={() => setSelectedPlatform(p)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                selectedPlatform === p
                  ? 'gold-gradient-bg text-primary-foreground border-transparent glow-gold-sm'
                  : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/40 bg-transparent'
              }`}
            >
              {p === 'TikTok' && '🎵 '}
              {p === 'Instagram' && '📸 '}
              {p === 'Telegram' && '✈️ '}
              {p === 'Snapchat' && '👻 '}
              {p === 'X (Twitter)' && '𝕏 '}
              {p === 'YouTube' && '▶️ '}
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div>
        <p className="section-label mb-3">FILTER BY SERVICE TYPE</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={`cat-filter-${c.toLowerCase()}`}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === c
                  ? 'bg-primary/20 text-primary border border-primary/40' :'bg-muted/40 text-muted-foreground hover:text-foreground border border-transparent'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center gap-2">
        <Filter size={13} className="text-muted-foreground" />
        <p className="text-xs text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> services
          {selectedPlatform !== 'All' && <> for <span className="text-primary">{selectedPlatform}</span></>}
        </p>
      </div>

      {/* Service grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filtered.map((svc) => {
            const minTotal = Math.round(svc.pricePerUnit * svc.minQty);
            return (
              <div
                key={svc.id}
                className="card-base card-gradient-bg group hover:border-primary/40 transition-all duration-300 hover:glow-gold-sm flex flex-col relative"
              >
                {svc.popular && (
                  <div className="absolute top-3 right-3">
                    <span className="badge-base status-completed text-[10px]">⭐ Popular</span>
                  </div>
                )}

                {/* Platform + service header */}
                <div className="flex items-center gap-2.5 mb-3">
                  <div className={`p-2 rounded-lg ${svc.platformBg} flex-shrink-0`}>
                    <span className="text-xl">{svc.emoji}</span>
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${svc.platformColor}`}>{svc.platform}</p>
                    <p className="font-bold text-sm">{svc.service}</p>
                  </div>
                </div>

                {/* Quality badge */}
                <div className="mb-3">
                  <span className={`badge-base text-[10px] ${svc.quality === 'Premium' ? 'status-completed' : svc.quality === 'High' ? 'status-processing' : 'status-cancelled'}`}>
                    {svc.quality} Quality
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">{svc.description}</p>

                {/* Pricing */}
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/15 mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Price per unit</span>
                    <span className="font-extrabold gold-gradient-text tabular-nums">₦{svc.pricePerUnit.toLocaleString('en-NG')} {svc.unit}</span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Min. quantity</span>
                    <span className="text-xs font-semibold tabular-nums">{svc.minQty.toLocaleString('en-NG')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Min. order total</span>
                    <span className="text-xs font-semibold tabular-nums">₦{minTotal.toLocaleString('en-NG')}</span>
                  </div>
                </div>

                {/* Meta row */}
                <div className="grid grid-cols-3 gap-1.5 mb-4">
                  <div className="bg-muted/30 rounded-lg p-2 text-center">
                    <Clock size={11} className="text-muted-foreground mx-auto mb-0.5" />
                    <p className="text-[10px] font-semibold leading-tight">{svc.delivery}</p>
                    <p className="text-[9px] text-muted-foreground">Delivery</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-2 text-center">
                    <TrendingUp size={11} className="text-muted-foreground mx-auto mb-0.5" />
                    <p className="text-[10px] font-semibold leading-tight tabular-nums">{svc.minQty.toLocaleString()}</p>
                    <p className="text-[9px] text-muted-foreground">Min</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-2 text-center">
                    <Users size={11} className="text-muted-foreground mx-auto mb-0.5" />
                    <p className="text-[10px] font-semibold leading-tight tabular-nums">{svc.maxQty >= 1000000 ? `${(svc.maxQty / 1000000).toFixed(1)}M` : `${(svc.maxQty / 1000).toFixed(0)}K`}</p>
                    <p className="text-[9px] text-muted-foreground">Max</p>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href={`/order-form?service=${svc.id}`}
                  className="btn-outline-gold flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold group-hover:gold-gradient-bg group-hover:text-primary-foreground group-hover:border-transparent transition-all"
                >
                  Order {svc.service}
                  <ArrowRight size={13} />
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-bold text-lg mb-2">No services found</h3>
          <p className="text-sm text-muted-foreground mb-6">
            No services match your current filters. Try adjusting your search or filters.
          </p>
          <button
            onClick={() => { setSearch(''); setSelectedPlatform('All'); setSelectedCategory('All'); }}
            className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}