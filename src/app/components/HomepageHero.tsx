'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';

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
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">

      {/* Background glow */}
      <div className="absolute inset-0 hero-glow" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08)_0%,transparent_65%)]" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Main glow */}
      <div
        className="absolute left-1/2 top-1/4 h-80 w-80 -translate-x-1/2 rounded-full opacity-10 blur-3xl"
        style={{ background: 'var(--primary)' }}
      />

      <div
        className="absolute bottom-10 right-10 h-64 w-64 rounded-full opacity-5 blur-3xl"
        style={{ background: 'var(--accent)' }}
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 text-center sm:px-6">

        {/* Live status */}
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-xs font-semibold text-muted-foreground">
            Platform live and accepting orders
          </span>
        </div>

        {/* Main heading */}
        <h1 className="text-hero-xl font-extrabold leading-tight tracking-tight text-foreground">
          Social Media Promotion
          <br />
          <span className="gold-gradient-text">
            Made Simple With PrimeBoost
          </span>
        </h1>

        {/* Main message */}
        <div className="mx-auto mt-7 max-w-2xl">
          <h2 className="mb-4 text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
            Promote Your Social Presence With Clear, Simple Services
          </h2>

          <p className="text-sm font-semibold leading-7 text-foreground/80 sm:text-base">
            PrimeBoost Nigeria provides social media promotion services for
            creators, businesses, and individuals. Choose a service for
            TikTok, Instagram, YouTube, Telegram, Snapchat, or X, review the
            available options and pricing, and place your order online.
          </p>
        </div>

        {/* Social platforms */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {platforms.map((platform) => (
            <span
              key={platform.name}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3.5 py-2 text-xs font-semibold backdrop-blur"
            >
              <span className={platform.color}>
                {platform.icon}
              </span>

              <span className="font-semibold text-muted-foreground">
                {platform.name}
              </span>
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">

          <Link
            href="/sign-up-login-screen"
            className="btn-primary flex min-w-[190px] items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold glow-gold-sm"
          >
            Get Started
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/service-catalog"
            className="btn-outline-gold flex min-w-[190px] items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold"
          >
            <Play size={14} className="fill-primary" />
            View Services
          </Link>

        </div>

        {/* Trust and transparency */}
        <div className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-border bg-card/60 p-5 text-left backdrop-blur">
            <div className="mb-3 text-xl font-bold">₦</div>

            <h3 className="font-bold">
              Transparent Pricing
            </h3>

            <p className="mt-1 text-sm font-medium leading-6 text-muted-foreground">
              Review the price and available options before placing an order.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 p-5 text-left backdrop-blur">
            <div className="mb-3 text-xl">⚡</div>

            <h3 className="font-bold">
              Simple Ordering
            </h3>

            <p className="mt-1 text-sm font-medium leading-6 text-muted-foreground">
              Select a service, provide the required information, and place
              your order online.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 p-5 text-left backdrop-blur">
            <div className="mb-3 text-xl">💬</div>

            <h3 className="font-bold">
              Customer Support
            </h3>

            <p className="mt-1 text-sm font-medium leading-6 text-muted-foreground">
              Our support team is available to help with questions about
              services and orders.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}