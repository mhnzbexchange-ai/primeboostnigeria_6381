import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { MessageCircle, Mail, Phone, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

const footerLinks = {
  Services: [
    { label: 'All Services', href: '/service-catalog' },
    { label: 'TikTok Services', href: '/service-catalog' },
    { label: 'Instagram Services', href: '/service-catalog' },
    { label: 'YouTube Services', href: '/service-catalog' },
    { label: 'Telegram Services', href: '/service-catalog' },
    { label: 'X Services', href: '/service-catalog' },
  ],
  Account: [
    { label: 'Create Account', href: '/sign-up-login-screen' },
    { label: 'Log In', href: '/sign-up-login-screen' },
    { label: 'Dashboard', href: '/user-dashboard' },
    { label: 'Referrals', href: '/referrals' },
  ],
  Information: [
    { label: 'FAQ', href: '#faq' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Services & Pricing', href: '/service-catalog' },
    { label: 'Contact Support', href: '#contact' },
  ],
  Policies: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
    { label: 'Refund Policy', href: '/refund-policy' },
  ],
};

export default function HomepageFooter() {
  return (
    <footer
      className="relative overflow-hidden border-t border-border/60 bg-card"
      id="contact"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-primary/4 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-primary/4 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-screen-xl px-4 lg:px-8">

        {/* Final CTA */}
        <div className="border-b border-border/60 py-14 sm:py-16">
          <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-background/60 p-8 shadow-xl backdrop-blur sm:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.12),transparent_55%)]" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

            <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5">
                  <Sparkles size={12} className="text-primary" aria-hidden="true" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                    PrimeBoost Nigeria
                  </span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Ready to Grow Your{' '}
                  <span className="gold-gradient-text">Online Presence?</span>
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                  Join PrimeBoost Nigeria and start promoting your social media presence today.
                  Simple ordering, transparent pricing, and multiple platforms.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/sign-up-login-screen"
                  className="btn-primary inline-flex shrink-0 items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold shadow-[0_0_20px_rgba(212,175,55,0.25)] transition-all duration-300 hover:-translate-y-0.5"
                >
                  Create Account
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
                <Link
                  href="/service-catalog"
                  className="btn-outline-gold inline-flex shrink-0 items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5"
                >
                  Explore Services
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main footer grid */}
        <div className="grid grid-cols-1 gap-10 py-16 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">

          {/* Brand */}
          <div className="lg:col-span-2 xl:col-span-2">
            <div className="mb-5 flex items-center gap-3">
              <AppLogo size={38} />
              <div>
                <span className="gold-gradient-text text-[15px] font-bold tracking-wide">
                  PrimeBoost Nigeria
                </span>
                <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Social Promotion Platform
                </p>
              </div>
            </div>

            <p className="mb-6 max-w-sm text-[13px] leading-7 text-muted-foreground">
              PrimeBoost Nigeria provides social media promotion services across supported
              platforms, with clear pricing, service requirements, and a simple online
              ordering experience.
            </p>

            <div className="space-y-3">
              <a
                href="https://wa.me/2347082653790"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Contact PrimeBoost Nigeria on WhatsApp"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                  <MessageCircle size={14} className="text-green-400" aria-hidden="true" />
                </span>
                +234 708 265 3790
              </a>

              <a
                href="mailto:primeboostnigeria@gmail.com"
                className="flex items-center gap-3 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Email PrimeBoost Nigeria support"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Mail size={14} className="text-primary" aria-hidden="true" />
                </span>
                primeboostnigeria@gmail.com
              </a>

              <div className="flex items-center gap-3 text-[13px] text-muted-foreground">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Phone size={14} className="text-primary" aria-hidden="true" />
                </span>
                Customer support available online
              </div>
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(footerLinks)?.map(([category, links]) => (
            <div key={category}>
              <h4 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">
                {category}
              </h4>
              <ul className="space-y-3">
                {links?.map((link) => (
                  <li key={link?.label}>
                    <Link
                      href={link?.href}
                      className="text-[13px] text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link?.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Transparency notice */}
        <div className="border-t border-border/60 py-7">
          <div className="mx-auto flex max-w-4xl items-start gap-4 rounded-2xl border border-primary/15 bg-background/40 p-5 backdrop-blur">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <ShieldCheck size={18} className="text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold">Clear and transparent service information</p>
              <p className="mt-1 text-[12px] leading-6 text-muted-foreground">
                Service availability, pricing, minimum order requirements, and estimated delivery times may change.
                Please review the current information shown on the website before placing an order.
                Customers should also review the applicable platform rules before using a promotion service.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-5 border-t border-border/60 py-6 sm:flex-row">
          <p className="text-[12px] text-muted-foreground">
            © 2026 PrimeBoost Nigeria. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
            <Link href="#faq" className="text-[12px] text-muted-foreground transition-colors hover:text-primary">FAQ</Link>
            <Link href="/privacy-policy" className="text-[12px] text-muted-foreground transition-colors hover:text-primary">Privacy</Link>
            <Link href="/terms-of-service" className="text-[12px] text-muted-foreground transition-colors hover:text-primary">Terms</Link>
            <Link href="/refund-policy" className="text-[12px] text-muted-foreground transition-colors hover:text-primary">Refunds</Link>
            <a href="mailto:primeboostnigeria@gmail.com" className="text-[12px] text-muted-foreground transition-colors hover:text-primary">Contact</a>
            <span className="flex items-center gap-2 text-[12px] font-medium text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-green-400" aria-hidden="true" />
              Online
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}