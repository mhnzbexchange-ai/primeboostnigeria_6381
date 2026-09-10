'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, TrendingUp, Lock } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const platforms = [
  {
    name: 'TikTok',
    color: '#ffffff',
    bg: 'bg-[#111]',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-4.77-4.08h-3.44v14.02a2.89 2.89 0 1 1-2.89-2.89c.16 0 .32.01.47.04v-3.5a6.4 6.4 0 1 0 5.86 6.35V9.54a8.27 8.27 0 0 0 4.84 1.56V7.65a4.82 4.82 0 0 1-.07-.96Z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    color: '#e1306c',
    bg: 'bg-gradient-to-br from-purple-600/20 to-pink-500/20',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" className="fill-current stroke-none" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    color: '#ff0000',
    bg: 'bg-red-500/10',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
      </svg>
    ),
  },
  {
    name: 'Telegram',
    color: '#2aabee',
    bg: 'bg-sky-500/10',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M21.9 3.1 2.8 10.5c-1.3.5-1.3 1.3.2 1.7l4.9 1.5 1.9 5.9c.2.5.1.7.6.7.4 0 .6-.2.8-.4l2.4-2.3 5 3.7c.9.5 1.5.3 1.7-.8l3.2-15.1c.3-1.3-.5-1.9-1.2-1.4Z" />
      </svg>
    ),
  },
  {
    name: 'X (Twitter)',
    color: '#ffffff',
    bg: 'bg-[#111]',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M18.2 2H21l-6.1 7 7.2 13h-5.6l-4.4-7.9L5.2 22H2.4l6.5-7.5L2 2h5.7l4 7.2L18.2 2Zm-1 17.7h1.5L6.6 4.2H5L17.2 19.7Z" />
      </svg>
    ),
  },
  {
    name: 'Snapchat',
    color: '#fffc00',
    bg: 'bg-yellow-400/10',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M12 2.2c-3.2 0-5.7 2.4-5.7 5.7v1.3c0 .4-.2.8-.6 1.1l-1.4 1c-.5.3-.4 1.1.2 1.3l1.6.6c.3.1.5.4.5.7.1.9.5 1.6 1.2 2.2.5.4 1 .7 1.6.9-.2.4-.7.8-1.5 1-.4.1-.6.5-.4.9.2.4.6.5 1 .4.8-.2 1.6-.4 2.5-.4.5 0 1 .2 1.5.6.4.3.9.5 1.5.5s1.1-.2 1.5-.5c.5-.4 1-.6 1.5-.6.9 0 1.7.2 2.5.4.4.1.8-.1 1-.4.2-.4 0-.8-.4-.9-.8-.2-1.3-.6-1.5-1 .6-.2 1.2-.5 1.6-.9.7-.6 1.1-1.3 1.2-2.2 0-.3.2-.6.5-.7l1.6-.6c.6-.2.7-1 .2-1.3l-1.4-1c-.4-.3-.6-.7-.6-1.1V7.9c0-3.3-2.5-5.7-5.7-5.7Z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    color: '#1877f2',
    bg: 'bg-blue-500/10',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07c0 6.02 4.39 11.02 10.13 11.93v-8.43H7.08v-3.5h3.05V9.41c0-3.05 1.79-4.74 4.56-4.74 1.32 0 2.7.24 2.7.24v2.98h-1.52c-1.5 0-1.97.94-1.97 1.9v2.28h3.35l-.54 3.5H13.9V24C19.61 23.09 24 18.09 24 12.07Z" />
      </svg>
    ),
  },
];

const trustItems = [
  { icon: ShieldCheck, label: 'No Password Required', color: 'text-green-400' },
  { icon: Zap, label: 'Fast Order Processing', color: 'text-primary' },
  { icon: TrendingUp, label: 'Transparent Pricing', color: 'text-blue-400' },
  { icon: Lock, label: 'Secure Platform', color: 'text-purple-400' },
];

export default function HomepageHero() {
  const orbitRef = useRef<HTMLDivElement>(null);

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background pt-[70px]"
      aria-label="Hero section"
    >
      {/* Layered background */}
      <div className="pointer-events-none absolute inset-0">
        {/* Primary radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(212,175,55,0.18)_0%,transparent_60%)]" />
        {/* Secondary accent */}
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-accent/4 blur-[100px]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* Left: Content */}
          <div className="order-2 lg:order-1">

            {/* Live badge */}
            <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-green-500/25 bg-green-500/8 px-4 py-2 backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-green-400">
                Platform Live · Accepting Orders
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-hero-xl font-extrabold leading-[1.06] tracking-tight text-foreground">
              Grow Your{' '}
              <span className="gold-gradient-text">Social Media</span>
              <br />
              Presence With
              <br />
              <span className="relative">
                PrimeBoost
                <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-primary/80 via-accent to-transparent" />
              </span>
              {' '}Nigeria.
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-muted-foreground sm:text-[17px]">
              Simple, affordable social media promotion for creators, businesses,
              brands, and growing communities across Nigeria and beyond.
            </p>

            {/* CTA buttons */}
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/sign-up-login-screen"
                className="btn-primary group inline-flex items-center gap-2.5 rounded-xl px-7 py-3.5 text-sm font-bold shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(212,175,55,0.45)]"
              >
                Get Started Free
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                href="/service-catalog"
                className="btn-outline-gold inline-flex items-center gap-2.5 rounded-xl px-7 py-3.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5"
              >
                Explore Services
              </Link>
            </div>

            {/* Trust row */}
            <div className="mt-10 flex flex-wrap gap-x-5 gap-y-3">
              {trustItems?.map((item) => {
                const Icon = item?.icon;
                return (
                  <div key={item?.label} className="flex items-center gap-2">
                    <Icon size={14} className={item?.color} aria-hidden="true" />
                    <span className="text-[12px] font-semibold text-muted-foreground">{item?.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Visual */}
          <div className="order-1 flex items-center justify-center lg:order-2">
            <div className="relative w-full max-w-[420px]">

              {/* Central card */}
              <div className="relative z-10 overflow-hidden rounded-3xl border border-primary/25 bg-card/80 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
                {/* Card glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.12),transparent_60%)]" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

                <div className="relative">
                  {/* Header */}
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                        Growth Dashboard
                      </p>
                      <p className="mt-0.5 text-lg font-bold text-foreground">Social Analytics</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                      <TrendingUp size={18} className="text-primary" aria-hidden="true" />
                    </div>
                  </div>

                  {/* Stat bars */}
                  <div className="space-y-3.5">
                    {[
                      { label: 'Followers Growth', pct: 82, color: 'from-primary to-accent' },
                      { label: 'Engagement Rate', pct: 67, color: 'from-blue-500 to-sky-400' },
                      { label: 'Views & Reach', pct: 91, color: 'from-green-500 to-emerald-400' },
                      { label: 'Order Completion', pct: 95, color: 'from-purple-500 to-violet-400' },
                    ]?.map((stat) => (
                      <div key={stat?.label}>
                        <div className="mb-1.5 flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-muted-foreground">{stat?.label}</span>
                          <span className="text-[11px] font-bold text-foreground">{stat?.pct}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-muted/40">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${stat?.color}`}
                            style={{ width: `${stat?.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="my-5 h-px bg-border/60" />

                  {/* Platform pills */}
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Supported Platforms
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {platforms?.map((p) => (
                      <div
                        key={p?.name}
                        className={`inline-flex items-center gap-1.5 rounded-full border border-border/50 ${p?.bg} px-2.5 py-1.5`}
                        style={{ color: p?.color }}
                      >
                        {p?.icon}
                        <span className="text-[10px] font-semibold text-muted-foreground">{p?.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating stat cards */}
              <div className="absolute -left-6 top-8 z-20 hidden rounded-2xl border border-green-500/25 bg-card/90 px-4 py-3 shadow-xl backdrop-blur-xl sm:block">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-2 w-2 rounded-full bg-green-400" />
                  <div>
                    <p className="text-[10px] font-bold text-green-400">10,000+</p>
                    <p className="text-[9px] text-muted-foreground">Active Users</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-5 bottom-12 z-20 hidden rounded-2xl border border-primary/25 bg-card/90 px-4 py-3 shadow-xl backdrop-blur-xl sm:block">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <div>
                    <p className="text-[10px] font-bold text-primary">Orders Live</p>
                    <p className="text-[9px] text-muted-foreground">Processing now</p>
                  </div>
                </div>
              </div>

              {/* Decorative glow behind card */}
              <div className="absolute inset-0 -z-10 rounded-3xl bg-primary/8 blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}