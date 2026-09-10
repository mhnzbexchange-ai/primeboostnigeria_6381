import React from 'react';
import Link from 'next/link';
import { UserPlus, Search, Link2, Wallet, ShoppingBag, BarChart2, ArrowRight } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Create an Account',
    description: 'Sign up for free in seconds. No credit card required to get started.',
    color: 'text-primary',
    bg: 'bg-primary/10 border-primary/20',
  },
  {
    number: '02',
    icon: Search,
    title: 'Choose a Service',
    description: 'Browse our catalog and pick the social media promotion that fits your goal.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10 border-blue-400/20',
  },
  {
    number: '03',
    icon: Link2,
    title: 'Enter Your Link',
    description: 'Provide your public profile or post link and select your desired quantity.',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10 border-purple-400/20',
  },
  {
    number: '04',
    icon: Wallet,
    title: 'Fund & Pay',
    description: 'Fund your wallet via bank transfer or Paystack, then use your balance to pay.',
    color: 'text-green-400',
    bg: 'bg-green-400/10 border-green-400/20',
  },
  {
    number: '05',
    icon: ShoppingBag,
    title: 'Place Your Order',
    description: 'Review your order details and submit. Your order enters processing immediately.',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10 border-amber-400/20',
  },
  {
    number: '06',
    icon: BarChart2,
    title: 'Track Progress',
    description: 'Monitor your order status and history from your personal dashboard.',
    color: 'text-rose-400',
    bg: 'bg-rose-400/10 border-rose-400/20',
  },
];

export default function HomepageHowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-secondary/15 py-24 sm:py-28"
      aria-labelledby="how-it-works-heading"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-accent/4 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-screen-xl px-4 lg:px-8">

        {/* Heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
            <BarChart2 size={13} className="text-primary" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              Simple Process
            </span>
          </div>
          <h2 id="how-it-works-heading" className="text-hero-md font-bold tracking-tight">
            How It{' '}
            <span className="gold-gradient-text">Works</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Getting started with PrimeBoost Nigeria is straightforward.
            Follow these six simple steps to place your first order.
          </p>
        </div>

        {/* Steps grid — 3 cols on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {steps?.map((step, idx) => {
            const Icon = step?.icon;
            return (
              <div
                key={step?.number}
                className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
              >
                {/* Hover accent */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Step number — large background */}
                <span className="absolute right-4 top-4 text-[56px] font-black leading-none text-muted/20 select-none">
                  {step?.number}
                </span>

                <div className={`relative mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border ${step?.bg}`}>
                  <Icon size={20} className={step?.color} aria-hidden="true" />
                </div>

                <h3 className="relative mb-2 text-[15px] font-bold text-foreground">{step?.title}</h3>
                <p className="relative text-[13px] leading-6 text-muted-foreground">{step?.description}</p>

                {/* Connector arrow (not on last item) */}
                {idx < steps?.length - 1 && (
                  <div className="absolute -right-2.5 top-1/2 z-10 hidden -translate-y-1/2 lg:block">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border border-border/60 bg-card">
                      <ArrowRight size={10} className="text-muted-foreground" aria-hidden="true" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/sign-up-login-screen"
            className="btn-primary inline-flex items-center gap-2.5 rounded-xl px-8 py-3.5 text-sm font-bold shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all duration-300 hover:-translate-y-0.5"
          >
            Get Started Now
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>

      </div>
    </section>
  );
}
