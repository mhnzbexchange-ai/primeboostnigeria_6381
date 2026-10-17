'use client';

import React from 'react';
import { ShieldCheck, Zap, CreditCard, BarChart2, MessageCircle, UserCog } from 'lucide-react';

const benefits = [
  {
    id: 'info',
    icon: ShieldCheck,
    title: 'Clear service information',
    description: 'Each service lists its requirements, minimum quantity and delivery estimate before you order.',
  },
  {
    id: 'pricing',
    icon: CreditCard,
    title: 'Transparent prices',
    description: 'All services are priced in Nigerian Naira (₦). The total is shown before you confirm.',
  },
  {
    id: 'ordering',
    icon: Zap,
    title: 'Straightforward ordering',
    description: 'A short step-by-step form guides you from choosing a service to confirming your order.',
  },
  {
    id: 'tracking',
    icon: BarChart2,
    title: 'Order tracking',
    description: 'Monitor the status of your orders from your personal dashboard.',
  },
  {
    id: 'support',
    icon: MessageCircle,
    title: 'Accessible support',
    description: 'Reach our team through the Help Centre for questions about orders and payments.',
  },
  {
    id: 'account',
    icon: UserCog,
    title: 'Convenient account management',
    description: 'Manage your wallet, orders and referrals in one place.',
  },
];

export default function HomepageStats() {
  return (
    <section className="bg-white py-16 sm:py-20" aria-labelledby="benefits-heading">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="section-label text-primary">Why PrimeBoost</p>
          <h2 id="benefits-heading" className="mt-2 text-hero-md font-bold text-navy">
            A platform built around clarity and simplicity
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
            Everything you need to understand a service, place an order and follow its progress.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits?.map((b) => (
            <div
              key={b?.id}
              className="rounded-xl border border-border bg-white p-6 transition-shadow duration-200 hover:shadow-md"
            >
              <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                <b.icon size={20} aria-hidden="true" />
              </span>
              <h3 className="text-sm font-bold text-navy">{b?.title}</h3>
              <p className="mt-1.5 text-[13px] leading-6 text-muted-foreground">{b?.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}