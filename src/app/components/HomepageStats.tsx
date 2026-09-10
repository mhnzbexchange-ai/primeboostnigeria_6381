'use client';

import React from 'react';
import { ShieldCheck, Zap, CreditCard, BarChart2, MessageCircle, Lock } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const benefits = [
  {
    id: 'secure',
    icon: ShieldCheck,
    title: 'Secure & Reliable',
    description: 'Your account security comes first. We never ask for your social media password.',
    color: 'text-green-400',
    bg: 'bg-green-400/8 border-green-400/20',
    span: 'md:col-span-2',
  },
  {
    id: 'fast',
    icon: Zap,
    title: 'Fast Order Processing',
    description: 'Orders are processed promptly after submission and payment confirmation.',
    color: 'text-primary',
    bg: 'bg-primary/8 border-primary/20',
    span: '',
  },
  {
    id: 'pricing',
    icon: CreditCard,
    title: 'Affordable Naira Pricing',
    description: 'All services are priced in Nigerian Naira (₦) with no hidden fees.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/8 border-blue-400/20',
    span: '',
  },
  {
    id: 'tracking',
    icon: BarChart2,
    title: 'Order Tracking',
    description: 'Monitor your order status in real time from your personal dashboard.',
    color: 'text-purple-400',
    bg: 'bg-purple-400/8 border-purple-400/20',
    span: '',
  },
  {
    id: 'support',
    icon: MessageCircle,
    title: 'Customer Support',
    description: 'Our support team is available to help with orders, payments, and questions.',
    color: 'text-amber-400',
    bg: 'bg-amber-400/8 border-amber-400/20',
    span: '',
  },
  {
    id: 'nopassword',
    icon: Lock,
    title: 'No Password Required',
    description: 'Place orders safely — we only need your public profile link, never your login.',
    color: 'text-rose-400',
    bg: 'bg-rose-400/8 border-rose-400/20',
    span: 'md:col-span-2',
  },
];

export default function HomepageStats() {
  return (
    <section
      className="relative overflow-hidden bg-secondary/15 py-24 sm:py-28"
      aria-labelledby="benefits-heading"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/6 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-screen-xl px-4 lg:px-8">

        {/* Heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
            <ShieldCheck size={13} className="text-primary" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              Platform Benefits
            </span>
          </div>
          <h2 id="benefits-heading" className="text-hero-md font-bold tracking-tight">
            Why Choose{' '}
            <span className="gold-gradient-text">PrimeBoost Nigeria</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            A platform built around transparency, simplicity, and your security.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {benefits?.map((benefit) => {
            const Icon = benefit?.icon;
            return (
              <div
                key={benefit?.id}
                className={`group relative overflow-hidden rounded-2xl border ${benefit?.bg} p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${benefit?.span}`}
              >
                {/* Hover accent line */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-30" />

                <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border ${benefit?.bg}`}>
                  <Icon size={20} className={benefit?.color} aria-hidden="true" />
                </div>

                <h3 className="mb-2 text-sm font-bold text-foreground">{benefit?.title}</h3>
                <p className="text-[13px] leading-6 text-muted-foreground">{benefit?.description}</p>
              </div>
            );
          })}
        </div>

        {/* Active users strip */}
        <div className="mt-10 flex items-center justify-center gap-3 rounded-2xl border border-green-500/20 bg-green-500/5 px-6 py-4">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-50" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
          </span>
          <span className="text-sm font-bold text-green-400">10,000+</span>
          <span className="text-sm font-medium text-muted-foreground">registered users on the platform</span>
        </div>

      </div>
    </section>
  );
}