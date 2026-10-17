import React from 'react';
import Link from 'next/link';
import { ListChecks, Wallet, PackageSearch, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '1',
    icon: ListChecks,
    title: 'Choose a service',
    description: 'Browse by platform and compare prices, minimum quantities and delivery estimates.',
  },
  {
    number: '2',
    icon: Wallet,
    title: 'Fund your wallet',
    description: 'Add funds to your wallet by bank transfer or Paystack.',
  },
  {
    number: '3',
    icon: PackageSearch,
    title: 'Place and track your order',
    description: 'Submit your order, then follow its status from your dashboard.',
  },
];

export default function HomepageHowItWorks() {
  return (
    <section id="how-it-works" className="bg-secondary py-16 sm:py-20" aria-labelledby="how-it-works-heading">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="section-label text-primary">How it works</p>
          <h2 id="how-it-works-heading" className="mt-2 text-hero-md font-bold text-navy">
            Three steps from sign-up to order
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
            New here? Create a free account, then follow these steps.
          </p>
        </div>

        <ol className="grid gap-4 md:grid-cols-3">
          {steps?.map((step) => (
            <li key={step?.number} className="relative rounded-xl border border-border bg-white p-6">
              <div className="mb-5 flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy text-white">
                  <step.icon size={20} aria-hidden="true" />
                </span>
                <span className="text-sm font-bold text-gold" aria-hidden="true">
                  Step {step?.number}
                </span>
              </div>
              <h3 className="text-[15px] font-bold text-navy">
                <span className="sr-only">Step {step?.number}: </span>
                {step?.title}
              </h3>
              <p className="mt-2 text-[13px] leading-6 text-muted-foreground">{step?.description}</p>
            </li>
          ))}
        </ol>

        <div className="mt-8">
          <Link
            href="/sign-up-login-screen"
            className="btn-primary inline-flex min-h-[48px] items-center justify-center gap-2 rounded-md px-6 text-sm"
          >
            Create Free Account
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
