'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import {
  Menu,
  X,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const navItems = [
  {
    label: 'Services',
    href: '/service-catalog',
  },
  {
    label: 'Pricing',
    href: '/service-catalog',
  },
  {
    label: 'FAQ',
    href: '#faq',
  },
];

export default function HomepageNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-border bg-card/90 shadow-lg backdrop-blur-xl'
          : 'bg-background/60 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex h-[68px] max-w-screen-xl items-center justify-between px-4 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3"
          onClick={closeMobileMenu}
          aria-label="PrimeBoost Nigeria home"
        >
          <div className="relative">
            <AppLogo size={38} />

            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-green-400 shadow-sm" />
          </div>

          <div className="hidden sm:block">
            <span className="gold-gradient-text text-base font-bold tracking-wide">
              PrimeBoost Nigeria
            </span>

            <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Social Promotion Platform
            </p>
          </div>

          <span className="sm:hidden gold-gradient-text text-sm font-bold">
            PrimeBoost
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-1 rounded-full border border-border bg-card/40 p-1 backdrop-blur-md md:flex">

          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-full px-4 py-2 text-xs font-semibold text-muted-foreground transition-all hover:bg-muted/60 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}

        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">

          <Link
            href="/sign-up-login-screen"
            className="rounded-xl px-4 py-2.5 text-xs font-bold text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign In
          </Link>

          <Link
            href="/sign-up-login-screen"
            className="btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-sm transition-transform hover:-translate-y-0.5"
          >
            Get Started
            <ArrowRight
              size={14}
              aria-hidden="true"
            />
          </Link>

        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/60 text-muted-foreground transition-all hover:border-primary/30 hover:bg-muted hover:text-foreground md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? (
            <X size={20} aria-hidden="true" />
          ) : (
            <Menu size={20} aria-hidden="true" />
          )}
        </button>

      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-card/95 shadow-xl backdrop-blur-xl md:hidden">

          <div className="mx-auto max-w-screen-xl px-4 py-5">

            {/* Mobile navigation */}
            <div className="space-y-1">

              {navItems.map((item) => (
                <Link
                  key={`mobile-${item.label}`}
                  href={item.href}
                  className="flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                  onClick={closeMobileMenu}
                >
                  {item.label}

                  <ArrowRight
                    size={15}
                    className="opacity-50"
                    aria-hidden="true"
                  />
                </Link>
              ))}

            </div>

            {/* Mobile account actions */}
            <div className="mt-4 border-t border-border pt-4">

              <Link
                href="/sign-up-login-screen"
                className="flex items-center justify-center rounded-xl border border-border bg-background/50 px-4 py-3 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
                onClick={closeMobileMenu}
              >
                Sign In
              </Link>

              <Link
                href="/sign-up-login-screen"
                className="btn-primary mt-2 flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold"
                onClick={closeMobileMenu}
              >
                <Sparkles
                  size={15}
                  aria-hidden="true"
                />

                Get Started

                <ArrowRight
                  size={15}
                  aria-hidden="true"
                />
              </Link>

            </div>

            {/* Mobile status */}
            <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-primary/10 bg-primary/5 px-4 py-3">

              <span className="h-2 w-2 rounded-full bg-green-400" />

              <span className="text-[11px] font-semibold text-muted-foreground">
                Platform live and accepting orders
              </span>

            </div>

          </div>

        </div>
      )}
    </nav>
  );
}