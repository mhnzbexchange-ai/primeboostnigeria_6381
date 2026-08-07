'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { Menu, X } from 'lucide-react';

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
          ? 'border-b border-border bg-card/95 shadow-card backdrop-blur-xl'
          : 'bg-background/70 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={closeMobileMenu}
          aria-label="PrimeBoost Nigeria home"
        >
          <AppLogo size={36} />

          <span className="gold-gradient-text text-base font-bold tracking-wide">
            PrimeBoost Nigeria
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">

          <Link
            href="/sign-up-login-screen"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign In
          </Link>

          <Link
            href="/sign-up-login-screen"
            className="btn-primary rounded-lg px-5 py-2.5 text-sm font-semibold"
          >
            Get Started
          </Link>

        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? (
            <X size={20} />
          ) : (
            <Menu size={20} />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-card/95 backdrop-blur-xl md:hidden">
          <div className="space-y-1 px-4 py-4">

            {navItems.map((item) => (
              <Link
                key={`mobile-${item.label}`}
                href={item.href}
                className="block rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-3 border-t border-border pt-3">

              <Link
                href="/sign-up-login-screen"
                className="block rounded-lg px-3 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground"
                onClick={closeMobileMenu}
              >
                Sign In
              </Link>

              <Link
                href="/sign-up-login-screen"
                className="btn-primary mt-2 block rounded-lg px-4 py-3 text-center text-sm font-semibold"
                onClick={closeMobileMenu}
              >
                Get Started
              </Link>

            </div>
          </div>
        </div>
      )}
    </nav>
  );
}