'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, Star, TrendingUp, Zap } from 'lucide-react';

const platforms = [
  { name: 'TikTok', color: 'text-red-400', emoji: '🎵' },
  { name: 'Instagram', color: 'text-pink-400', emoji: '📸' },
  { name: 'Telegram', color: 'text-blue-400', emoji: '✈️' },
  { name: 'Snapchat', color: 'text-yellow-400', emoji: '👻' },
  { name: 'X (Twitter)', color: 'text-sky-400', emoji: '𝕏' },
];

const particles = Array.from({ length: 18 })?.map((_, i) => ({
  id: `particle-${i + 1}`,
  size: 2 + (i % 4),
  left: (i * 5.5) % 100,
  duration: 8 + (i % 7),
  delay: (i * 0.7) % 6,
}));

export default function HomepageHero() {
  const canvasRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated background */}
      <div className="absolute inset-0 hero-glow" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(212,175,55,0.08)_0%,transparent_60%)]" />
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Particles */}
      <div ref={canvasRef} className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles?.map((p) => (
          <div
            key={p?.id}
            className="particle"
            style={{
              width: `${p?.size}px`,
              height: `${p?.size}px`,
              left: `${p?.left}%`,
              animationDuration: `${p?.duration}s`,
              animationDelay: `${p?.delay}s`,
            }}
          />
        ))}
      </div>
      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: 'var(--primary)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-5 blur-3xl" style={{ background: 'var(--accent)' }} />
      <div className="relative max-w-screen-xl mx-auto px-4 lg:px-8 text-center">
        {/* Trust badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 animate-fade-in-up">
          <span className="flex gap-0.5">
            {[1,2,3,4,5]?.map((s) => (
              <Star key={`star-${s}`} size={12} className="text-primary fill-primary" />
            ))}
          </span>
          <span className="text-xs font-medium text-muted-foreground">Trusted by 47,000+ Nigerians</span>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-400 font-medium">Live</span>
        </div>

        {/* Headline */}
        <h1 className="text-hero-xl font-extrabold text-foreground mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Nigeria&apos;s Trusted<br />
          <span className="gold-gradient-text">Digital Promotion</span><br />
          Platform.
        </h1>

        {/* Subheadline */}
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-4 animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
          Boost your social media presence with real followers, likes, views, and engagement.
          Fast delivery, affordable Naira pricing, and 24/7 support for Nigerian creators.
        </p>

        {/* Contact info */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
          <a href="mailto:primeboostnigeria@gmail.com" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <span className="text-primary">✉</span>
            primeboostnigeria@gmail.com
          </a>
          <a href="tel:07082653790" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <span className="text-primary">📞</span>
            07082653790
          </a>
        </div>

        {/* Platform pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          {platforms?.map((p) => (
            <span
              key={`platform-${p?.name?.toLowerCase()?.replace(/\s/g, '-')}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-card text-xs font-semibold"
            >
              <span>{p?.emoji}</span>
              <span className={p?.color}>{p?.name}</span>
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Link
            href="/sign-up-login-screen"
            className="btn-primary flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold glow-gold-sm"
          >
            Get Started Free
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/service-catalog"
            className="btn-outline-gold flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold"
          >
            <Play size={14} className="fill-primary" />
            View Pricing
          </Link>
        </div>

        {/* Social proof row */}
        <div className="flex flex-wrap justify-center gap-6 mt-12 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          {[
            { icon: TrendingUp, label: '₦2.4B+ delivered', sub: 'Total value boosted' },
            { icon: Zap, label: '< 30 min delivery', sub: 'Average start time' },
            { icon: Star, label: '4.9/5 rating', sub: 'From 12,000+ reviews' },
          ]?.map((item) => (
            <div key={`proof-${item?.label?.replace(/\s/g, '-')}`} className="flex items-center gap-2 text-left">
              <div className="p-2 rounded-lg glass-card">
                <item.icon size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold tabular-nums">{item?.label}</p>
                <p className="text-xs text-muted-foreground">{item?.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}