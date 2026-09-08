import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import {
  MessageCircle,
  Mail,
  Phone,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

const footerLinks = {
  Services: [
    { label: 'All Services', href: '/service-catalog' },
    { label: 'TikTok Services', href: '/service-catalog' },
    { label: 'Instagram Services', href: '/service-catalog' },
    { label: 'Facebook Services', href: '/service-catalog' },
    { label: 'YouTube Services', href: '/service-catalog' },
    { label: 'Telegram Services', href: '/service-catalog' },
    { label: 'X Services', href: '/service-catalog' },
  ],

  Account: [
    { label: 'Create Account', href: '/sign-up-login-screen' },
    { label: 'Log In', href: '/sign-up-login-screen' },
    { label: 'Dashboard', href: '/user-dashboard' },
  ],

  Information: [
    { label: 'FAQ', href: '#faq' },
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
      className="relative overflow-hidden border-t border-border bg-card"
      id="contact"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-screen-xl px-4 lg:px-8">

        {/* Premium CTA */}
        <div className="border-b border-border py-14 sm:py-16">

          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-background/60 p-7 shadow-lg backdrop-blur sm:p-10">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.10),transparent_55%)]" />

            <div className="relative flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">

              <div className="max-w-2xl">

                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5">
                  <Sparkles
                    size={13}
                    className="text-primary"
                    aria-hidden="true"
                  />

                  <span className="text-[11px] font-bold tracking-widest text-primary">
                    PRIMEBOOST NIGERIA
                  </span>
                </div>

                <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                  Ready to grow your social presence?
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                  Explore available promotion services, compare pricing,
                  and choose the option that fits your goals.
                </p>

              </div>

              <Link
                href="/service-catalog"
                className="btn-primary inline-flex shrink-0 items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold shadow-lg transition-transform hover:-translate-y-0.5"
              >
                Explore Services

                <ArrowUpRight
                  size={16}
                  aria-hidden="true"
                />
              </Link>

            </div>

          </div>

        </div>

        {/* Main footer */}
        <div className="grid grid-cols-1 gap-10 py-16 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">

          {/* Brand */}
          <div className="lg:col-span-2 xl:col-span-2">

            <div className="mb-5 flex items-center gap-3">

              <AppLogo size={40} />

              <div>
                <span className="gold-gradient-text text-base font-bold tracking-wide">
                  PrimeBoost Nigeria
                </span>

                <p className="mt-0.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  Social Promotion Platform
                </p>
              </div>

            </div>

            <p className="mb-6 max-w-sm text-sm leading-7 text-muted-foreground">
              PrimeBoost Nigeria provides social media promotion services
              across supported platforms, with clear pricing, service
              requirements, and a simple online ordering experience.
            </p>

            {/* Contact */}
            <div className="space-y-3">

              <a
                href="https://wa.me/2347082653790"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Contact PrimeBoost Nigeria on WhatsApp"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                  <MessageCircle
                    size={15}
                    className="text-green-400"
                    aria-hidden="true"
                  />
                </span>

                <span>
                  +234 708 265 3790
                </span>
              </a>

              <a
                href="mailto:primeboostnigeria@gmail.com"
                className="group flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Email PrimeBoost Nigeria support"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Mail
                    size={15}
                    className="text-primary"
                    aria-hidden="true"
                  />
                </span>

                <span>
                  primeboostnigeria@gmail.com
                </span>
              </a>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">

                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Phone
                    size={15}
                    className="text-primary"
                    aria-hidden="true"
                  />
                </span>

                <span>
                  Customer support available online
                </span>

              </div>

            </div>
          </div>

          {/* Footer link groups */}
          {Object.entries(footerLinks).map(
            ([category, links]) => (
              <div key={category}>

                <h4 className="mb-5 text-xs font-bold uppercase tracking-widest text-foreground">
                  {category}
                </h4>

                <ul className="space-y-3">

                  {links.map((link) => (
                    <li key={link.label}>

                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {link.label}

                        {link.label === 'Facebook Services' && (
                          <span className="text-[9px] font-bold text-primary">
                            NEW
                          </span>
                        )}
                      </Link>

                    </li>
                  ))}

                </ul>

              </div>
            )
          )}

        </div>

        {/* Transparency section */}
        <div className="border-t border-border py-7">

          <div className="mx-auto flex max-w-4xl items-start gap-4 rounded-2xl border border-primary/15 bg-background/50 p-5 backdrop-blur">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <ShieldCheck
                size={19}
                className="text-primary"
                aria-hidden="true"
              />
            </div>

            <div>
              <p className="text-sm font-bold">
                Clear and transparent service information
              </p>

              <p className="mt-1 text-xs leading-6 text-muted-foreground">
                Service availability, pricing, minimum order requirements,
                and estimated delivery times may change. Please review the
                current information shown on the website before placing an
                order. Customers should also review the applicable platform
                rules before using a promotion service.
              </p>
            </div>

          </div>

        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-5 border-t border-border py-6 sm:flex-row">

          <p className="text-xs text-muted-foreground">
            © 2026 PrimeBoost Nigeria. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">

            <Link
              href="#faq"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              FAQ
            </Link>

            <Link
              href="/privacy-policy"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              Privacy
            </Link>

            <Link
              href="/terms-of-service"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              Terms
            </Link>

            <Link
              href="/refund-policy"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              Refunds
            </Link>

            <a
              href="mailto:primeboostnigeria@gmail.com"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              Contact
            </a>

            <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">

              <span
                className="h-2 w-2 rounded-full bg-green-400"
                aria-hidden="true"
              />

              Online

            </span>

          </div>

        </div>

      </div>
    </footer>
  );
}