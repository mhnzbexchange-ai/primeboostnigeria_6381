'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { Menu, X, ArrowRight } from 'lucide-react';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/service-catalog' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'FAQ', href: '#faq' },
];

export default function HomepageNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-border/60 bg-background/95 shadow-[0_4px_32px_rgba(0,0,0,0.5)] backdrop-blur-2xl'
          : 'bg-transparent'
      }`}
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-[70px] max-w-screen-xl items-center justify-between px-4 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3"
          onClick={closeMobileMenu}
          aria-label="PrimeBoost Nigeria home"
        >
          <div className="relative">
            <AppLogo size={36} />
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-green-400" />
          </div>
          <div className="hidden sm:block">
            <span className="gold-gradient-text text-[15px] font-bold tracking-wide">
              PrimeBoost Nigeria
            </span>
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Social Promotion Platform
            </p>
          </div>
          <span className="sm:hidden gold-gradient-text text-sm font-bold">PrimeBoost</span>
        </Link>

        {/* Desktop nav pill */}
        <div className="hidden items-center gap-0.5 rounded-full border border-border/50 bg-card/50 p-1 backdrop-blur-xl md:flex">
          {navItems?.map((item) => (
            <Link
              key={item?.label}
              href={item?.href}
              className="rounded-full px-4 py-2 text-[13px] font-medium text-muted-foreground transition-all duration-200 hover:bg-muted/70 hover:text-foreground"
            >
              {item?.label}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/sign-up-login-screen"
            className="rounded-xl px-4 py-2.5 text-[13px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Login
          </Link>
          <Link
            href="/sign-up-login-screen"
            className="btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold shadow-[0_0_20px_rgba(212,175,55,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
          >
            Create Account
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-card/60 text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border/60 bg-background/98 shadow-2xl backdrop-blur-2xl md:hidden">
          <div className="mx-auto max-w-screen-xl px-4 py-5">
            <div className="space-y-1">
              {navItems?.map((item) => (
                <Link
                  key={`mobile-${item?.label}`}
                  href={item?.href}
                  className="flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
                  onClick={closeMobileMenu}
                >
                  {item?.label}
                  <ArrowRight size={14} className="opacity-40" aria-hidden="true" />
                </Link>
              ))}
            </div>

            <div className="mt-4 space-y-2 border-t border-border/60 pt-4">
              <Link
                href="/sign-up-login-screen"
                className="flex items-center justify-center rounded-xl border border-border/60 bg-card/60 px-4 py-3 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
                onClick={closeMobileMenu}
              >
                Login
              </Link>
              <Link
                href="/sign-up-login-screen"
                className="btn-primary flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold"
                onClick={closeMobileMenu}
              >
                Create Account
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
              </span>
              <span className="text-[11px] font-semibold text-muted-foreground">
                Platform live · Accepting orders
              </span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}