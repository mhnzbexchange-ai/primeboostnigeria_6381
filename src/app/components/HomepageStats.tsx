'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Users, ShoppingBag, Star, Zap } from 'lucide-react';

const stats = [
  { id: 'stat-users', icon: Users, value: 47200, suffix: '+', label: 'Active Users', sub: 'Across Nigeria', color: 'text-blue-400' },
  { id: 'stat-orders', icon: ShoppingBag, value: 380000, suffix: '+', label: 'Orders Fulfilled', sub: 'Since 2022', color: 'text-green-400' },
  { id: 'stat-rating', icon: Star, value: 4.9, suffix: '/5', label: 'Average Rating', sub: 'Verified reviews', color: 'text-primary', decimal: true },
  { id: 'stat-speed', icon: Zap, value: 28, suffix: ' min', label: 'Avg. Start Time', sub: 'Fastest in Nigeria', color: 'text-accent' },
];

function useCountUp(target: number, decimal = false, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    const duration = 1800;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(decimal ? Math.round(current * 10) / 10 : Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target, decimal, active]);
  return count;
}

function StatCard({ stat, active }: { stat: typeof stats[0]; active: boolean }) {
  const count = useCountUp(stat.value, stat.decimal, active);
  const display = stat.decimal ? count.toFixed(1) : count.toLocaleString('en-NG');
  return (
    <div className="card-base card-gradient-bg flex flex-col items-center text-center hover:border-primary/30 transition-all duration-300 hover:glow-gold-sm group">
      <div className={`p-3 rounded-xl mb-4 bg-muted/50 group-hover:bg-primary/10 transition-colors`}>
        <stat.icon size={24} className={stat.color} />
      </div>
      <div className="tabular-nums text-3xl font-extrabold text-foreground mb-1">
        {display}{stat.suffix}
      </div>
      <div className="font-semibold text-sm mb-1">{stat.label}</div>
      <div className="text-xs text-muted-foreground">{stat.sub}</div>
    </div>
  );
}

export default function HomepageStats() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-20 bg-secondary/30">
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <p className="section-label mb-3">BY THE NUMBERS</p>
          <h2 className="text-hero-md font-bold">
            Nigeria&apos;s <span className="gold-gradient-text">Most Trusted</span> Platform
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.id} stat={stat} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
}