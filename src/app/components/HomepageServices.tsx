import React from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, TrendingUp, Users } from 'lucide-react';
import { ALL_SERVICES, MINIMUM_ORDER_QTY } from '@/lib/pricing';

// Pick 6 featured services for the homepage
const FEATURED_IDS = [
  'svc-tt-followers',
  'svc-ig-likes',
  'svc-tg-channel',
  'svc-x-followers',
  'svc-yt-subscribers',
  'svc-yt-views',
];

const services = ALL_SERVICES?.filter(s => FEATURED_IDS?.includes(s?.id));

export default function HomepageServices() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-14">
          <p className="section-label mb-3">WHAT WE OFFER</p>
          <h2 className="text-hero-md font-bold mb-4">
            Premium <span className="gold-gradient-text">Promotion Services</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
            Choose from our range of social media growth services. All delivered fast, safely, and at prices designed for the Nigerian market. Minimum order: {MINIMUM_ORDER_QTY?.toLocaleString()} units.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-10">
          {services?.map((svc) => (
            <div
              key={svc?.id}
              className="card-base card-gradient-bg group hover:border-primary/40 transition-all duration-300 hover:glow-gold-sm flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${svc?.platformBg}`}>
                    <span className="text-lg">{svc?.emoji}</span>
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${svc?.platformColor}`}>{svc?.platform}</p>
                    <p className="font-bold text-sm">{svc?.service}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-extrabold gold-gradient-text tabular-nums">₦{svc?.pricePerUnit?.toLocaleString('en-NG')}</p>
                  <p className="text-xs text-muted-foreground">{svc?.unit}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">{svc?.description}</p>

              {/* Meta */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-muted/30 rounded-lg p-2 text-center">
                  <Clock size={12} className="text-muted-foreground mx-auto mb-1" />
                  <p className="text-xs font-semibold">{svc?.delivery}</p>
                  <p className="text-[10px] text-muted-foreground">Delivery</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-2 text-center">
                  <TrendingUp size={12} className="text-muted-foreground mx-auto mb-1" />
                  <p className="text-xs font-semibold tabular-nums">{svc?.minQty?.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">Min</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-2 text-center">
                  <Users size={12} className="text-muted-foreground mx-auto mb-1" />
                  <p className="text-xs font-semibold tabular-nums">{svc?.maxQty >= 1000000 ? `${(svc?.maxQty / 1000000)?.toFixed(1)}M` : `${(svc?.maxQty / 1000)?.toFixed(0)}K`}</p>
                  <p className="text-[10px] text-muted-foreground">Max</p>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/order-form"
                className="btn-outline-gold flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold group-hover:btn-primary transition-all"
              >
                Order Now
                <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/service-catalog"
            className="btn-primary inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold"
          >
            View All Services
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}