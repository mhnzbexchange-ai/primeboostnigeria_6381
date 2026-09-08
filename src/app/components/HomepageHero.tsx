'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Play,
  ShieldCheck,
  Zap,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

const platforms = [
  {
    name: 'TikTok',
    color: 'text-foreground',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-4.77-4.08h-3.44v14.02a2.89 2.89 0 1 1-2.89-2.89c.16 0 .32.01.47.04v-3.5a6.4 6.4 0 1 0 5.86 6.35V9.54a8.27 8.27 0 0 0 4.84 1.56V7.65a4.82 4.82 0 0 1-.07-.96Z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    color: 'text-pink-400',
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 fill-none stroke-current"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" className="fill-current stroke-none" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    color: 'text-blue-400',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07c0 6.02 4.39 11.02 10.13 11.93v-8.43H7.08v-3.5h3.05V9.41c0-3.05 1.79-4.74 4.56-4.74 1.32 0 2.7.24 2.7.24v2.98h-1.52c-1.5 0-1.97.94-1.97 1.9v2.28h3.35l-.54 3.5H13.9V24C19.61 23.09 24 18.09 24 12.07Z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    color: 'text-red-400',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
      </svg>
    ),
  },
  {
    name: 'Telegram',
    color: 'text-sky-400',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M21.9 3.1 2.8 10.5c-1.3.5-1.3 1.3.2 1.7l4.9 1.5 1.9 5.9c.2.5.1.7.6.7.4 0 .6-.2.8-.4l2.4-2.3 5 3.7c.9.5 1.5.3 1.7-.8l3.2-15.1c.3-1.3-.5-1.9-1.2-1.4ZM8.3 13.3l10.8-6.8c.5-.3 1-.1.6.2l-8.8 8-.3 3.4-1.7-4.8-1.7-4.8-3.7-1.1 3.1-.9 3.1-.9Z" />
      </svg>
    ),
  },
  {
    name: 'Snapchat',
    color: 'text-yellow-400',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M12 2.2c-3.2 0-5.7 2.4-5.7 5.7v1.3c0 .4-.2.8-.6 1.1l-1.4 1c-.5.3-.4 1.1.2 1.3l1.6.6c.3.1.5.4.5.7.1.9.5 1.6 1.2 2.2.5.4 1 .7 1.6.9-.2.4-.7.8-1.5 1-.4.1-.6.5-.4.9.2.4.6.5 1 .4.8-.2 1.6-.4 2.5-.4.5 0 1 .2 1.5.6.4.3.9.5 1.5.5s1.1-.2 1.5-.5c.5-.4 1-.6 1.5-.6.9 0 1.7.2 2.5.4.4.1.8-.1 1-.4.2-.4 0-.8-.4-.9-.8-.2-1.3-.6-1.5-1 .6-.2 1.2-.5 1.6-.9.7-.6 1.1-1.3 1.2-2.2 0-.3.2-.6.5-.7l1.6-.6c.6-.2.7-1 .2-1.3l-1.4-1c-.4-.3-.6-.7-.6-1.1V7.9c0-3.3-2.5-5.7-5.7-5.7Z" />
      </svg>
    ),
  },
  {
    name: 'X',
    color: 'text-foreground',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M18.2 2H21l-6.1 7 7.2 13h-5.6l-4.4-7.9L5.2 22H2.4l6.5-7.5L2 2h5.7l4 7.2L18.2 2Zm-1 17.7h1.5L6.6 4.2H5L17.2 19.7Z" />
      </svg>
    ),
  },
];

export default function HomepageHero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background pt-24 pb-16 sm:pt-28">

      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 hero-glow" />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.12)_0%,transparent_55%)]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

        <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8">

        {/* Live status */}
        <div className="mb-7 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/70 px-4 py-2 shadow-sm backdrop-blur-xl">

            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-40" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
            </span>

            <span className="text-xs font-semibold text-muted-foreground">
              Platform live and accepting orders
            </span>

          </div>
        </div>

        {/* Hero content */}
        <div className="mx-auto max-w-4xl text-center">

          <div className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <Sparkles size={14} aria-hidden="true" />
            PrimeBoost Nigeria
          </div>

          <h1 className="text-hero-xl font-extrabold leading-[1.05] tracking-tight text-foreground">

            Grow Your Social Presence

            <br />

            <span className="gold-gradient-text">
              Build. Promote. Grow.
            </span>

          </h1>

          <h2 className="mx-auto mt-7 max-w-2xl text-lg font-bold leading-7 text-foreground sm:text-xl">
            Professional social media promotion made simple.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-7 text-muted-foreground sm:text-base">
            PrimeBoost Nigeria gives creators, businesses, brands, and
            individuals access to social media promotion services across
            TikTok, Instagram, Facebook, YouTube, Telegram, Snapchat, and X.
          </p>

        </div>

        {/* CTA buttons */}
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">

          <Link
            href="/sign-up-login-screen"
            className="btn-primary group flex min-w-[200px] items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold shadow-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            Get Started

            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>

          <Link
            href="/service-catalog"
            className="btn-outline-gold flex min-w-[200px] items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold"
          >
            <Play
              size={14}
              className="fill-primary"
              aria-hidden="true"
            />

            Explore Services
          </Link>

        </div>

        {/* Platform showcase */}
        <div className="mx-auto mt-12 max-w-5xl">

          <p className="mb-4 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Supported Platforms
          </p>

          <div className="flex flex-wrap justify-center gap-2.5">

            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-2.5 text-xs font-semibold shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-card"
              >

                <span className={platform.color}>
                  {platform.icon}
                </span>

                <span className="text-muted-foreground transition-colors group-hover:text-foreground">
                  {platform.name}
                </span>

              </div>
            ))}

          </div>

        </div>

        {/* Trust / feature cards */}
        <div className="mx-auto mt-14 grid max-w-5xl gap-4 md:grid-cols-3">

          {/* Card 1 */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-5 text-left shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">

            <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />

            <div className="relative">

              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-primary/15 bg-primary/10">
                <ShieldCheck
                  size={20}
                  className="text-primary"
                  aria-hidden="true"
                />
              </div>

              <h3 className="text-sm font-bold">
                Transparent Pricing
              </h3>

              <p className="mt-1.5 text-xs leading-6 text-muted-foreground">
                Review service pricing, minimum quantities, and requirements
                before placing an order.
              </p>

            </div>

          </div>

          {/* Card 2 */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-5 text-left shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">

            <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />

            <div className="relative">

              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-primary/15 bg-primary/10">
                <Zap
                  size={20}
                  className="text-primary"
                  aria-hidden="true"
                />
              </div>

              <h3 className="text-sm font-bold">
                Simple Ordering
              </h3>

              <p className="mt-1.5 text-xs leading-6 text-muted-foreground">
                Select a service, provide your target details, review your
                order, and submit it online.
              </p>

            </div>

          </div>

          {/* Card 3 */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-5 text-left shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">

            <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />

            <div className="relative">

              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-primary/15 bg-primary/10">
                <TrendingUp
                  size={20}
                  className="text-primary"
                  aria-hidden="true"
                />
              </div>

              <h3 className="text-sm font-bold">
                Multiple Platforms
              </h3>

              <p className="mt-1.5 text-xs leading-6 text-muted-foreground">
                Access promotion services for the social platforms that matter
                to your audience and brand.
              </p>

            </div>

          </div>

        </div>

        {/* Bottom trust line */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-medium text-muted-foreground">

          <span className="flex items-center gap-1.5">
            <ShieldCheck
              size={13}
              className="text-primary"
              aria-hidden="true"
            />
            Clear service information
          </span>

          <span className="hidden h-1 w-1 rounded-full bg-border sm:block" />

          <span className="flex items-center gap-1.5">
            <TrendingUp
              size={13}
              className="text-primary"
              aria-hidden="true"
            />
            Multiple promotion options
          </span>

          <span className="hidden h-1 w-1 rounded-full bg-border sm:block" />

          <span className="flex items-center gap-1.5">
            <Zap
              size={13}
              className="text-primary"
              aria-hidden="true"
            />
            Online ordering
          </span>

        </div>

      </div>
    </section>
  );
}