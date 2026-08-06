'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { Menu, X } from 'lucide-react';

export default function HomepageNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-card/95 backdrop-blur-xl border-b border-border shadow-card' : 'bg-transparent'}`}>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <AppLogo size={36} />
          <span className="font-bold text-base gold-gradient-text tracking-wide">PrimeBoost Nigeria</span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {[
            { label: 'Services', href: '/service-catalog' },
            { label: 'Pricing', href: '/service-catalog' },
            { label: 'About', href: '#about' },
            { label: 'Contact', href: '#contact' },
          ]?.map((item) => (
            <Link
              key={`nav-${item?.label?.toLowerCase()}`}
              href={item?.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              {item?.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/sign-up-login-screen" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Sign In
          </Link>
          <Link href="/sign-up-login-screen" className="btn-primary px-5 py-2 rounded-lg text-sm">
            Get Started
          </Link>
        </div>

        {/* Mobile */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-b border-border animate-slide-down">
          <div className="px-4 py-4 space-y-2">
            {[
              { label: 'Services', href: '/service-catalog' },
              { label: 'Pricing', href: '/service-catalog' },
              { label: 'Sign In', href: '/sign-up-login-screen' },
            ]?.map((item) => (
              <Link
                key={`mobile-${item?.label?.toLowerCase()}`}
                href={item?.href}
                className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {item?.label}
              </Link>
            ))}
            <Link
              href="/sign-up-login-screen"
              className="block btn-primary px-4 py-2.5 rounded-lg text-sm text-center mt-2"
              onClick={() => setMobileOpen(false)}
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}