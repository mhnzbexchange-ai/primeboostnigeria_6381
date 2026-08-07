import React from 'react';
import HomepageServices from './components/HomepageServices';
import HomepageFAQ from './components/HomepageFAQ';
import HomepageFooter from './components/HomepageFooter';
import HomepageNav from './components/HomepageNav';

function Advertisement() {
  return (
    <section className="w-full px-4 py-3 bg-background">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="px-4 pt-2 text-center">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Advertisement
            </span>
          </div>

          <div className="px-4 py-4 text-center sm:py-5">
            <p className="mb-1 text-xs font-semibold text-primary">
              🚀 PROMOTE YOUR BUSINESS WITH PRIMEBOOST
            </p>

            <h2 className="text-lg font-bold sm:text-xl">
              Put Your Brand in Front of More People
            </h2>

            <p className="mx-auto mt-1 max-w-2xl text-xs text-muted-foreground sm:text-sm">
              Advertise your business, brand, product or service on PrimeBoost
              Nigeria.
            </p>

            <a
              href="#advertise"
              className="mt-3 inline-block rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:text-sm"
            >
              Advertise With Us →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomepageHero() {
  return (
    <section className="relative overflow-hidden px-5 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-24">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 top-1/2 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl text-center">
        {/* Status */}
        <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-xs font-medium text-muted-foreground backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          Platform live and accepting orders
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          Grow Your{' '}
          <span className="text-primary">
            Social Media Presence
          </span>{' '}
          With PrimeBoost
        </h1>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Access social media promotion services for TikTok, Instagram,
          YouTube, Telegram and other supported platforms — with clear
          pricing in Nigerian Naira.
        </p>

        {/* Trust points */}
        <div className="mx-auto mt-7 flex max-w-2xl flex-wrap justify-center gap-3">
          <span className="rounded-full border border-border bg-card px-4 py-2 text-xs text-muted-foreground">
            ✓ Transparent pricing
          </span>

          <span className="rounded-full border border-border bg-card px-4 py-2 text-xs text-muted-foreground">
            ✓ Naira payments
          </span>

          <span className="rounded-full border border-border bg-card px-4 py-2 text-xs text-muted-foreground">
            ✓ Order tracking
          </span>

          <span className="rounded-full border border-border bg-card px-4 py-2 text-xs text-muted-foreground">
            ✓ Customer support
          </span>
        </div>

        {/* Buttons */}
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#services"
            className="inline-flex min-w-[190px] items-center justify-center rounded-xl bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:scale-[1.02] hover:opacity-90"
          >
            Get Started →
          </a>

          <a
            href="#services"
            className="inline-flex min-w-[190px] items-center justify-center rounded-xl border border-primary px-7 py-3.5 text-sm font-semibold text-primary transition-all hover:bg-primary/10"
          >
            View Services
          </a>
        </div>

        {/* Simple information cards */}
        <div className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card/60 p-5 text-left backdrop-blur">
            <div className="mb-3 text-xl">₦</div>
            <h3 className="font-semibold">Clear Pricing</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              See service pricing before placing an order.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 p-5 text-left backdrop-blur">
            <div className="mb-3 text-xl">⚡</div>
            <h3 className="font-semibold">Simple Ordering</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose a service, provide the required details and place your
              order.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 p-5 text-left backdrop-blur">
            <div className="mb-3 text-xl">💬</div>
            <h3 className="font-semibold">Support</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Get assistance when you need help with your order.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Homepage() {
  return (
    <div className="min-h-screen bg-background">
      <HomepageNav />

      <Advertisement />

      <HomepageHero />

      <div id="services">
        <HomepageServices />
      </div>

      <HomepageFAQ />

      <HomepageFooter />
    </div>
  );
}