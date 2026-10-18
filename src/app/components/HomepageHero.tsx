'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Receipt, MousePointerClick, PackageSearch, TrendingUp } from 'lucide-react';
import PlatformIcon, { PLATFORM_META } from './PlatformIcon';

const benefits = [
  { icon: Receipt, label: 'Transparent Pricing', text: 'Prices shown in naira before you order.' },
  { icon: MousePointerClick, label: 'Simple Ordering', text: 'Pick a service, add your link, confirm.' },
  { icon: PackageSearch, label: 'Order Tracking', text: 'Follow every order from your dashboard.' },
];

function GrowthVisual() {
  return (
    <div
      className="relative rounded-xl border border-border bg-white p-5 shadow-md sm:p-6"
      role="img"
      aria-label="Illustration of a social media growth chart with platform icons"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-navy text-white">
            <TrendingUp size={16} aria-hidden="true" />
          </span>
          <div>
            <p className="text-[13px] font-semibold text-navy">Audience growth</p>
            <p className="text-[11px] text-muted-foreground">Illustration</p>
          </div>
        </div>
        <span className="h-1.5 w-10 rounded-full bg-gold" aria-hidden="true" />
      </div>

      <svg viewBox="0 0 320 140" className="mt-5 h-auto w-full" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="hero-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1D4ED8" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[28, 62, 96]?.map((y) => (
          <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 4" />
        ))}
        <path d="M0 118 C40 112 60 100 95 96 S150 78 185 64 S250 38 320 16 L320 140 L0 140 Z" fill="url(#hero-area)" />
        <path
          d="M0 118 C40 112 60 100 95 96 S150 78 185 64 S250 38 320 16"
          fill="none"
          stroke="#1D4ED8"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="320" cy="16" r="4.5" fill="#B8860B" />
        <circle cx="320" cy="16" r="8" fill="#B8860B" fillOpacity="0.2" />
      </svg>

      <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
        {PLATFORM_META?.slice(0, 5)?.map((p) => (
          <span
            key={p?.key}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-secondary"
            style={{ color: p?.color }}
          >
            <PlatformIcon platform={p?.key} size={18} />
          </span>
        ))}
        <span className="ml-auto text-[11px] font-medium text-muted-foreground">7 platforms supported</span>
      </div>
    </div>
  );
}

export default function HomepageHero() {
  return (
    <section className="bg-secondary pt-16" aria-labelledby="hero-heading">
      <div className="mx-auto grid max-w-screen-xl items-center gap-10 px-4 py-12 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold text-navy">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
            Social media promotion for Nigeria
          </p>
          <h1 id="hero-heading" className="text-hero-xl font-extrabold text-navy">
            Your Social Presence. <span className="text-primary">Your Next Level.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Discover social media promotion services for your brand, business, or creator profile — all in one convenient platform.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/service-catalog"
              className="btn-primary inline-flex min-h-[48px] items-center justify-center gap-2 rounded-md px-6 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Explore Services
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link
              href="/sign-up-login-screen"
              className="btn-outline-gold inline-flex min-h-[48px] items-center justify-center rounded-md px-6 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Create Free Account
            </Link>
          </div>

          <nav className="mt-8" aria-label="Browse services by platform">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Browse by platform</p>
            <ul className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {PLATFORM_META?.map((p) => (
                <li key={p?.key}>
                  <Link
                    href={`/service-catalog?platform=${encodeURIComponent(p?.catalogName)}`}
                    className="group flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-lg border border-border bg-white px-1 py-2 text-[11px] font-medium text-navy transition-all duration-150 hover:border-primary hover:shadow-sm active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    aria-label={`View ${p?.label} services`}
                  >
                    <span style={{ color: p?.color }} className="transition-transform duration-150 group-hover:scale-110">
                      <PlatformIcon platform={p?.key} size={22} />
                    </span>
                    {p?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <GrowthVisual />
      </div>

      <div className="border-y border-border bg-white">
        <ul className="mx-auto grid max-w-screen-xl gap-px px-4 sm:grid-cols-3 lg:px-8">
          {benefits?.map((b) => (
            <li key={b?.label} className="flex items-start gap-3 py-5 sm:px-4">
              <b.icon size={20} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-navy">{b?.label}</p>
                <p className="text-[13px] text-muted-foreground">{b?.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}