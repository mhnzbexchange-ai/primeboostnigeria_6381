import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { MessageCircle, Mail, Phone } from 'lucide-react';

const footerLinks = {
  Services: [
    { label: 'TikTok Services', href: '/service-catalog' },
    { label: 'Instagram Services', href: '/service-catalog' },
    { label: 'Telegram Services', href: '/service-catalog' },
    { label: 'X (Twitter) Services', href: '/service-catalog' },
    { label: 'Snapchat Services', href: '/service-catalog' },
  ],
  Account: [
    { label: 'Sign Up', href: '/sign-up-login-screen' },
    { label: 'Log In', href: '/sign-up-login-screen' },
    { label: 'Dashboard', href: '/user-dashboard' },
    { label: 'Wallet', href: '/user-dashboard' },
    { label: 'Referral Program', href: '/user-dashboard' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Service', href: '#terms' },
    { label: 'Refund Policy', href: '#refund' },
    { label: 'Cookie Policy', href: '#cookies' },
    { label: 'About Us', href: '#about' },
  ],
};

const paymentMethods = [
  { name: 'Paystack', emoji: '💳' },
  { name: 'Flutterwave', emoji: '🦋' },
  { name: 'Bank Transfer', emoji: '🏦' },
  { name: 'Opay', emoji: '📱' },
  { name: 'PalmPay', emoji: '🌴' },
  { name: 'Moniepoint', emoji: '💰' },
];

export default function HomepageFooter() {
  return (
    <footer className="bg-card border-t border-border" id="contact">
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8">
        {/* Main footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="xl:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <AppLogo size={36} />
              <span className="font-bold text-base gold-gradient-text tracking-wide">PrimeBoost Nigeria</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-sm">
              Nigeria&apos;s most trusted digital promotion platform. Helping creators, businesses, and individuals grow their social media presence with fast, safe, and affordable services since 2022.
            </p>

            {/* Contact */}
            <div className="space-y-2">
              <a href="https://wa.me/2347082653790" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <MessageCircle size={14} className="text-green-400" />
                +234 708 265 3790 (WhatsApp)
              </a>
              <a href="mailto:primeboostnigeria@gmail.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Mail size={14} className="text-primary" />
                primeboostnigeria@gmail.com
              </a>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone size={14} className="text-blue-400" />
                Mon – Sat, 8am – 10pm WAT
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks)?.map(([category, links]) => (
            <div key={`footer-col-${category?.toLowerCase()}`}>
              <h4 className="font-bold text-sm mb-4">{category}</h4>
              <ul className="space-y-2">
                {links?.map((link) => (
                  <li key={`footer-link-${link?.label?.toLowerCase()?.replace(/\s/g, '-')}`}>
                    <Link
                      href={link?.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link?.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment methods */}
        <div className="py-6 border-t border-border">
          <p className="text-xs text-muted-foreground text-center mb-4">Accepted Payment Methods</p>
          <div className="flex flex-wrap justify-center gap-3">
            {paymentMethods?.map((pm) => (
              <div
                key={`payment-${pm?.name?.toLowerCase()?.replace(/\s/g, '-')}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/40 border border-border text-xs font-medium"
              >
                <span>{pm?.emoji}</span>
                <span className="text-muted-foreground">{pm?.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © 2026 PrimeBoost Nigeria. All rights reserved. Registered in Nigeria.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              All systems operational
            </span>
            <span className="text-xs text-muted-foreground">🇳🇬 Made for Nigeria</span>
          </div>
        </div>
      </div>
    </footer>
  );
}