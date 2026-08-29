'use client';

import React from 'react';
import {
  ShieldCheck,
  CreditCard,
  Clock,
  Headphones,
} from 'lucide-react';
import ActiveUsersCounter from './ActiveUsersCounter';
import Icon from '@/components/ui/AppIcon';



const highlights = [
  {
    id: 'highlight-pricing',
    icon: CreditCard,
    title: 'Naira Pricing',
    description:
      'View service prices in Nigerian Naira before placing an order.',
    color: 'text-primary',
  },
  {
    id: 'highlight-order',
    icon: ShieldCheck,
    title: 'Secure Ordering',
    description:
      'Place orders through your PrimeBoost account without sharing your social media password.',
    color: 'text-green-400',
  },
  {
    id: 'highlight-delivery',
    icon: Clock,
    title: 'Order Tracking',
    description:
      'Monitor your order status from your account after placing an order.',
    color: 'text-blue-400',
  },
  {
    id: 'highlight-support',
    icon: Headphones,
    title: 'Customer Support',
    description:
      'Contact the PrimeBoost support team if you need help with an order.',
    color: 'text-purple-400',
  },
];

interface HomepageStatsProps {
  activeUsersCount: number;
}

export default function HomepageStats({ activeUsersCount }: HomepageStatsProps) {
  return (
    <section className="bg-secondary/30 py-20">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">

        {/* Section heading */}
        <div className="mb-12 text-center">

          <p className="section-label mb-3">
            WHY PRIMEBOOST
          </p>

          <h2 className="text-hero-md font-bold">
            A Simple Way to Manage
            <span className="gold-gradient-text">
              {' '}Social Promotion
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            PrimeBoost provides a straightforward way to browse available
            promotion services, check pricing and manage your orders from
            one account.
          </p>

        </div>

        {/* Active Users Live Counter */}
        {activeUsersCount > 0 && (
          <div className="mb-10 flex justify-center">
            <div className="card-base card-gradient-bg inline-flex flex-col items-center gap-3 border-green-500/20 px-10 py-6 text-center hover:border-green-500/40 transition-all duration-300">
              <ActiveUsersCounter initialCount={activeUsersCount} />
              <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
                Registered users who have been active on the platform
              </p>
            </div>
          </div>
        )}

        {/* Highlights */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {highlights?.map((item) => {
            const Icon = item?.icon;

            return (
              <div
                key={item?.id}
                className="card-base card-gradient-bg group flex flex-col items-center text-center transition-all duration-300 hover:border-primary/30 hover:glow-gold-sm"
              >
                <div className="mb-4 rounded-xl bg-muted/50 p-3 transition-colors group-hover:bg-primary/10">
                  <Icon
                    size={24}
                    className={item?.color}
                  />
                </div>
                <h3 className="mb-2 text-sm font-semibold">
                  {item?.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {item?.description}
                </p>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}