'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Receipt, MousePointerClick, PackageSearch, Wallet, ListChecks } from 'lucide-react';

const platforms = ['TikTok', 'Instagram', 'Facebook', 'YouTube', 'Telegram', 'X', 'Snapchat'];

const benefits = [
  { icon: Receipt, label: 'Transparent Pricing', text: 'Prices shown in naira before you order.' },
  { icon: MousePointerClick, label: 'Simple Ordering', text: 'Pick a service, add your link, confirm.' },
  { icon: PackageSearch, label: 'Order Tracking', text: 'Follow every order from your dashboard.' },
];

const steps = [
  { icon: ListChecks, title: 'Choose a service', text: 'Browse by platform and compare prices.' },
  { icon: Wallet, title: 'Fund your wallet', text: 'Add funds securely to your account.' },
  { icon: PackageSearch, title: 'Place and track', text: 'Submit your order and follow its status.' },
];

export default function HomepageHero() {
  return (
    <section className="bg-secondary pt-16" aria-labelledby="hero-heading">
      <div className="mx-auto grid max-w-screen-xl items-center gap-10 px-4 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div>
          <p className="mb-4 inline-flex items-center rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold text-primary">
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
              className="btn-primary inline-flex min-h-[48px] items-center justify-center gap-2 rounded-md px-6 text-sm"
            >
              Explore Services
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link
              href="/sign-up-login-screen"
              className="btn-outline-gold inline-flex min-h-[48px] items-center justify-center rounded-md px-6 text-sm"
            >
              Create Free Account
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Supported platforms">
            {platforms?.map((p) => (
              <li
                key={p}
                className="rounded-md border border-border bg-white px-3 py-1.5 text-xs font-medium text-navy"
              >
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-white p-6 shadow-md sm:p-8">
          <p className="section-label">How you get started</p>
          <ol className="mt-5 space-y-5">
            {steps?.map((s, i) => (
              <li key={s?.title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy text-white">
                  <s.icon size={18} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-navy">
                    {i + 1}. {s?.title}
                  </p>
                  <p className="mt-0.5 text-[13px] text-muted-foreground">{s?.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
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