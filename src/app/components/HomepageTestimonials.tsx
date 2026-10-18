import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Receipt, CreditCard, PackageSearch, MessageCircle, FileText, Info } from 'lucide-react';

const items = [
  {
    icon: Receipt,
    title: 'Transparent pricing',
    description: 'Prices are shown in naira, and your total is displayed before you confirm an order.',
  },
  {
    icon: CreditCard,
    title: 'Payment methods',
    description: 'Fund your wallet by bank transfer or Paystack, then pay for orders from your balance.',
  },
  {
    icon: PackageSearch,
    title: 'Order tracking',
    description: 'Registered customers can follow each order and review wallet activity from the dashboard.',
  },
  {
    icon: MessageCircle,
    title: 'Customer support',
    description: 'Reach our team through the Help Centre, WhatsApp or email for questions about orders and payments.',
  },
  {
    icon: FileText,
    title: 'Clear service descriptions',
    description: 'Each service lists its minimum quantity, delivery estimate and requirements.',
  },
];

const policyLinks = [
  { label: 'Terms of Service', href: '/terms-of-service' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Refund Policy', href: '/refund-policy' },
  { label: 'Help Centre', href: '/support-center' },
];

export default function HomepageTestimonials() {
  return (
    <section className="bg-white py-16 sm:py-20" aria-labelledby="why-heading">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="section-label text-primary">Why PrimeBoost Nigeria</p>
          <h2 id="why-heading" className="mt-2 text-hero-md font-bold text-navy">
            Know what you are ordering before you pay
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
            We keep the process simple and the information visible, from service details to order status.
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items?.map((item) => (
            <li key={item?.title} className="rounded-xl border border-border bg-white p-6">
              <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                <item.icon size={20} aria-hidden="true" />
              </span>
              <h3 className="text-sm font-bold text-navy">{item?.title}</h3>
              <p className="mt-1.5 text-[13px] leading-6 text-muted-foreground">{item?.description}</p>
            </li>
          ))}
          <li className="rounded-xl border border-gold/40 bg-gold-soft p-6">
            <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gold">
              <ShieldCheck size={20} aria-hidden="true" />
            </span>
            <h3 className="text-sm font-bold text-navy">Policies and contact</h3>
            <ul className="mt-2 space-y-1">
              {policyLinks?.map((l) => (
                <li key={l?.label}>
                  <Link
                    href={l?.href}
                    className="inline-flex min-h-[32px] items-center text-[13px] font-medium text-primary hover:underline"
                  >
                    {l?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-secondary p-5">
          <Info size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <h3 className="mb-1 text-sm font-bold text-navy">Important service information</h3>
            <p className="text-[12px] leading-6 text-muted-foreground sm:text-[13px]">
              Service availability, delivery estimates and requirements can vary by platform and service. Please review
              the information shown on the service and order pages before submitting an order, and use social media
              services in line with each platform&apos;s terms and policies.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}