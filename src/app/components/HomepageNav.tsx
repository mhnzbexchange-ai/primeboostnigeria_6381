'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { Menu, X, ArrowRight } from 'lucide-react';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/service-catalog' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/service-catalog' },
  { label: 'Referral Programme', href: '/referrals' },
  { label: 'Help Centre', href: '/support-center' },
];

export default function HomepageNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e?.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 bg-white transition-shadow duration-200 ${
        scrolled ? 'border-b border-border shadow-sm' : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 lg:px-8" aria-label="Main navigation">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md"
          onClick={closeMobileMenu}
          aria-label="PrimeBoost Nigeria home"
        >
          <AppLogo size={34} />
          <span className="text-[15px] font-bold tracking-tight text-navy">
            PrimeBoost <span className="text-primary">Nigeria</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems?.map((item) => (
            <Link
              key={item?.label}
              href={item?.href}
              className="rounded-md px-2.5 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              {item?.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/sign-up-login-screen"
            className="rounded-md px-4 py-2 text-[13px] font-semibold text-navy transition-colors hover:bg-secondary"
          >
            Log In
          </Link>
          <Link
            href="/sign-up-login-screen"
            className="btn-primary inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-[13px] font-semibold"
          >
            Get Started
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          className="flex h-11 w-11 items-center justify-center rounded-md border border-border text-navy transition-colors hover:bg-secondary lg:hidden"
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </nav>

      <div
        id="mobile-nav"
        className={`grid overflow-hidden border-border bg-white transition-all duration-200 ease-out lg:hidden ${
          mobileOpen ? 'grid-rows-[1fr] border-t opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="mx-auto max-w-screen-xl px-4 py-4">
            <div className="space-y-1">
              {navItems?.map((item) => (
                <Link
                  key={`mobile-${item?.label}`}
                  href={item?.href}
                  tabIndex={mobileOpen ? 0 : -1}
                  className="flex min-h-[48px] items-center justify-between rounded-md px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                  onClick={closeMobileMenu}
                >
                  {item?.label}
                  <ArrowRight size={14} className="text-muted-foreground" aria-hidden="true" />
                </Link>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-4">
              <Link
                href="/sign-up-login-screen"
                tabIndex={mobileOpen ? 0 : -1}
                className="btn-outline-gold flex min-h-[48px] items-center justify-center rounded-md px-4 text-sm"
                onClick={closeMobileMenu}
              >
                Log In
              </Link>
              <Link
                href="/sign-up-login-screen"
                tabIndex={mobileOpen ? 0 : -1}
                className="btn-primary flex min-h-[48px] items-center justify-center rounded-md px-4 text-sm"
                onClick={closeMobileMenu}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}