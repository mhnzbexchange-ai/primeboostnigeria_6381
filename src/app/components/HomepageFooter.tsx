import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { MessageCircle, Mail } from 'lucide-react';

const footerLinks = {
  Platform: [
    { label: 'Services', href: '/service-catalog' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Pricing', href: '/service-catalog' },
    { label: 'Referral Programme', href: '/referrals' },
  ],
  Account: [
    { label: 'Create Account', href: '/sign-up-login-screen' },
    { label: 'Log In', href: '/sign-up-login-screen' },
    { label: 'Dashboard', href: '/user-dashboard' },
  ],
  Support: [
    { label: 'Help Centre', href: '/support-center' },
    { label: 'FAQ', href: '/#faq' },
    { label: 'Contact', href: 'mailto:support@primeboostnigeria.com' },
  ],
  Legal: [
    { label: 'Terms of Service', href: '/terms-of-service' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Refund Policy', href: '/refund-policy' },
  ],
};

export default function HomepageFooter() {
  return (
    <footer className="bg-navy text-white" id="contact">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 border-b border-white/10 py-12 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold tracking-tight">Ready to get started?</h2>
            <p className="mt-2 text-sm leading-7 text-white/70">
              Create a free account to browse services, fund your wallet and place your first order.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/sign-up-login-screen"
              className="inline-flex min-h-[48px] items-center justify-center rounded-md bg-white px-6 text-sm font-semibold text-navy transition-colors hover:bg-secondary"
            >
              Create Free Account
            </Link>
            <Link
              href="/service-catalog"
              className="inline-flex min-h-[48px] items-center justify-center rounded-md border border-white/30 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Explore Services
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 py-12 lg:grid-cols-6">
          <div className="col-span-2">
            <div className="mb-4 flex items-center gap-2.5">
              <AppLogo size={34} />
              <span className="text-[15px] font-bold tracking-tight">PrimeBoost Nigeria</span>
            </div>
            <p className="max-w-sm text-[13px] leading-6 text-white/70">
              Social media promotion services with clear pricing, service requirements and a simple online ordering experience.
            </p>
            <div className="mt-5 space-y-3">
              <a
                href="https://wa.me/2347082653790"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[13px] text-white/80 transition-colors hover:text-white"
              >
                <MessageCircle size={16} aria-hidden="true" />
                WhatsApp: +234 708 265 3790
              </a>
              <a
                href="mailto:support@primeboostnigeria.com"
                className="flex items-center gap-3 text-[13px] text-white/80 transition-colors hover:text-white"
              >
                <Mail size={16} aria-hidden="true" />
                support@primeboostnigeria.com
              </a>
            </div>
          </div>

          {Object.entries(footerLinks)?.map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em] text-white/60">{category}</h3>
              <ul className="space-y-3">
                {links?.map((link) => (
                  <li key={link?.label}>
                    <Link href={link?.href} className="text-[13px] text-white/80 transition-colors hover:text-white">
                      {link?.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 py-6">
          <p className="max-w-3xl text-[12px] leading-6 text-white/60">
            Service availability, pricing, minimum order requirements and delivery estimates may change. Please review the
            current information shown before placing an order, and review the applicable platform rules before using a
            promotion service.
          </p>
          <p className="mt-4 text-[12px] text-white/60">© 2026 PrimeBoost Nigeria. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}