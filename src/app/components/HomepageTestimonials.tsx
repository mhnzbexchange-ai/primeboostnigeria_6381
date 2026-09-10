import React from 'react';
import { MessageCircle, ShieldCheck, Info, Wallet, LayoutDashboard, Zap, Eye,  } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const whyItems = [
  {
    icon: ShieldCheck,
    title: 'Transparent by Design',
    description:
      'View service details, pricing, minimum quantities, and estimated delivery information before placing an order.',
    accent: 'border-l-2 border-l-green-400/60',
  },
  {
    icon: LayoutDashboard,
    title: 'Everything in One Place',
    description:
      'Manage your orders, wallet activity, account information, and service purchases from your PrimeBoost dashboard.',
    accent: 'border-l-2 border-l-primary/60',
  },
  {
    icon: Wallet,
    title: 'Flexible Payments',
    description:
      'Fund your PrimeBoost wallet and use your available balance when placing eligible orders through the platform.',
    accent: 'border-l-2 border-l-blue-400/60',
  },
  {
    icon: Zap,
    title: 'Simple Ordering',
    description:
      'Choose a platform, select a service, enter your target details, review the order, and submit it in a few simple steps.',
    accent: 'border-l-2 border-l-amber-400/60',
  },
  {
    icon: MessageCircle,
    title: 'Customer Support',
    description:
      'Need help? Our support team is available to assist with questions about services, payments, and orders.',
    accent: 'border-l-2 border-l-purple-400/60',
  },
  {
    icon: Eye,
    title: 'Order Visibility',
    description:
      'Registered customers can keep track of their orders and review their account activity from their dashboard.',
    accent: 'border-l-2 border-l-rose-400/60',
  },
];

export default function HomepageTestimonials() {
  return (
    <section className="relative overflow-hidden bg-secondary/15 py-24 sm:py-28" aria-labelledby="why-heading">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-accent/4 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-screen-xl px-4 lg:px-8">

        {/* Heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
            <ShieldCheck size={13} className="text-primary" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              Why PrimeBoost Nigeria
            </span>
          </div>
          <h2 id="why-heading" className="text-hero-md font-bold tracking-tight">
            A Smarter Way to{' '}
            <span className="gold-gradient-text">Promote Your Socials</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            PrimeBoost Nigeria brings social media promotion services, transparent pricing,
            simple ordering, and account management together in one streamlined platform.
          </p>
        </div>

        {/* Asymmetric grid: 2 large + 4 regular */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {whyItems?.map((item) => {
            const Icon = item?.icon;
            return (
              <div
                key={item?.title}
                className={`group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-card/80 hover:shadow-xl ${item?.accent}`}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/15 bg-primary/8">
                  <Icon size={20} className="text-primary" aria-hidden="true" />
                </div>

                <h3 className="mb-2 text-[15px] font-bold text-foreground">{item?.title}</h3>
                <p className="text-[13px] leading-7 text-muted-foreground">{item?.description}</p>
              </div>
            );
          })}
        </div>

        {/* Trust statement */}
        <div className="relative mx-auto mt-12 max-w-4xl overflow-hidden rounded-3xl border border-primary/20 bg-card/70 p-7 text-center shadow-lg backdrop-blur sm:p-9">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),transparent_60%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <div className="relative">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
              <ShieldCheck size={22} className="text-primary" aria-hidden="true" />
            </div>
            <h3 className="mb-3 text-lg font-bold">Transparency Comes First</h3>
            <p className="mx-auto max-w-2xl text-[13px] leading-7 text-muted-foreground">
              We believe customers should know what they are ordering before they pay.
              PrimeBoost displays service information, pricing, minimum quantities, and
              estimated delivery details throughout the ordering process.
            </p>
          </div>
        </div>

        {/* Service notice */}
        <div className="mx-auto mt-5 flex max-w-4xl items-start gap-3 rounded-2xl border border-border/60 bg-card/40 p-5 text-left backdrop-blur">
          <Info size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <h3 className="mb-1 text-sm font-bold">Important Service Information</h3>
            <p className="text-[12px] leading-6 text-muted-foreground sm:text-[13px]">
              Service availability, delivery estimates, and requirements can vary by platform and service.
              Please review the information shown on the relevant service and order pages before submitting
              an order. Customers should also use social media services in accordance with the applicable
              platform's terms and policies.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}