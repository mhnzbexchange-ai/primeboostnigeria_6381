import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import {
  MessageCircle,
  Mail,
  Phone,
  ShieldCheck,
} from 'lucide-react';

const footerLinks = {
  Services: [
    { label: 'TikTok Services', href: '/service-catalog' },
    { label: 'Instagram Services', href: '/service-catalog' },
    { label: 'YouTube Services', href: '/service-catalog' },
    { label: 'Telegram Services', href: '/service-catalog' },
    { label: 'X Services', href: '/service-catalog' },
  ],

  Account: [
    { label: 'Sign Up', href: '/sign-up-login-screen' },
    { label: 'Log In', href: '/sign-up-login-screen' },
    { label: 'Dashboard', href: '/user-dashboard' },
  ],

  Information: [
    { label: 'FAQ', href: '#faq' },
    { label: 'Services & Pricing', href: '/service-catalog' },
    { label: 'Contact Support', href: '#contact' },
  ],
};

export default function HomepageFooter() {
  return (
    <footer
      className="border-t border-border bg-card"
      id="contact"
    >
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">

        {/* Main footer */}
        <div className="grid grid-cols-1 gap-10 py-16 md:grid-cols-2 xl:grid-cols-5">

          {/* Brand */}
          <div className="xl:col-span-2">

            <div className="mb-4 flex items-center gap-2">
              <AppLogo size={36} />

              <span className="gold-gradient-text text-base font-bold tracking-wide">
                PrimeBoost Nigeria
              </span>
            </div>

            <p className="mb-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A Nigerian social media promotion platform offering
              services for supported social platforms. Browse available
              services and pricing before placing an order.
            </p>

            {/* Contact */}
            <div className="space-y-3">

              <a
                href="https://wa.me/2347082653790"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <MessageCircle
                  size={15}
                  className="text-green-400"
                />

                +234 708 265 3790
              </a>

              <a
                href="mailto:primeboostnigeria@gmail.com"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail
                  size={15}
                  className="text-primary"
                />

                primeboostnigeria@gmail.com
              </a>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone
                  size={15}
                  className="text-primary"
                />

                Customer support
              </div>

            </div>
          </div>

          {/* Footer links */}
          {Object.entries(footerLinks).map(
            ([category, links]) => (
              <div key={category}>

                <h4 className="mb-4 text-sm font-bold">
                  {category}
                </h4>

                <ul className="space-y-2.5">

                  {links.map((link) => (
                    <li key={link.label}>

                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {link.label}
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

          <div className="mx-auto flex max-w-3xl items-start gap-3 rounded-xl border border-primary/15 bg-background/50 p-4">

            <ShieldCheck
              size={20}
              className="mt-0.5 flex-shrink-0 text-primary"
            />

            <div>
              <p className="text-sm font-semibold">
                Clear and transparent service information
              </p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Service availability, pricing and minimum order
                requirements may change. Please review the current
                information shown on the website before placing an order.
              </p>
            </div>

          </div>

        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-border py-5 sm:flex-row">

          <p className="text-xs text-muted-foreground">
            © 2026 PrimeBoost Nigeria. All rights reserved.
          </p>

          <div className="flex items-center gap-4">

            <Link
              href="#faq"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              FAQ
            </Link>

            <a
              href="mailto:primeboostnigeria@gmail.com"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              Contact
            </a>

            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              Online
            </span>

          </div>

        </div>

      </div>
    </footer>
  );
}