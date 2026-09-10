import React from 'react';
import Link from 'next/link';
import { Gift, ArrowRight, Users, DollarSign, Share2 } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


export default function HomepageReferral() {
  return (
    <section
      className="relative overflow-hidden bg-background py-24 sm:py-28"
      aria-labelledby="referral-heading"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-screen-xl px-4 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-primary/25 bg-card/60 backdrop-blur-xl">
          {/* Top accent */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/70 to-transparent" />

          <div className="relative p-8 sm:p-12 lg:p-14">
            {/* Radial glow inside card */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(212,175,55,0.12),transparent_55%)]" />

            <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-16">

              {/* Left: Content */}
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-2">
                  <Gift size={13} className="text-primary" aria-hidden="true" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                    Referral Program
                  </span>
                </div>

                <h2 id="referral-heading" className="text-hero-md font-bold tracking-tight">
                  Refer & Earn{' '}
                  <span className="gold-gradient-text">₦2,000</span>
                </h2>

                <p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
                  Share your unique referral link with friends, colleagues, or your audience.
                  When eligible referrals are completed, you earn your referral reward directly
                  into your PrimeBoost account.
                </p>

                <div className="mt-8 space-y-3">
                  {[
                    { icon: Share2, text: 'Get your referral link from your account dashboard' },
                    { icon: Users, text: 'Share it with friends, followers, or your community' },
                    { icon: DollarSign, text: 'Earn ₦2,000 when eligible referrals are completed' },
                  ]?.map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                        <Icon size={13} className="text-primary" aria-hidden="true" />
                      </div>
                      <p className="text-[13px] leading-6 text-muted-foreground">{text}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-9 flex flex-wrap gap-3">
                  <Link
                    href="/sign-up-login-screen"
                    className="btn-primary inline-flex items-center gap-2.5 rounded-xl px-7 py-3.5 text-sm font-bold shadow-[0_0_20px_rgba(212,175,55,0.25)] transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Join & Start Earning
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                  <Link
                    href="/referrals"
                    className="btn-outline-gold inline-flex items-center gap-2.5 rounded-xl px-7 py-3.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Learn More
                  </Link>
                </div>
              </div>

              {/* Right: Visual card */}
              <div className="flex justify-center lg:justify-end">
                <div className="w-full max-w-[320px] overflow-hidden rounded-2xl border border-primary/20 bg-background/60 p-6 shadow-xl backdrop-blur-xl">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                      <Gift size={20} className="text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Your Reward</p>
                      <p className="text-2xl font-extrabold text-foreground">₦2,000</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-xl border border-border/50 bg-muted/20 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Per Eligible Referral</p>
                      <p className="mt-1 text-sm font-bold text-foreground">₦2,000 reward</p>
                    </div>
                    <div className="rounded-xl border border-border/50 bg-muted/20 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Paid To</p>
                      <p className="mt-1 text-sm font-bold text-foreground">Your PrimeBoost wallet</p>
                    </div>
                    <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-green-400">Status</p>
                      <p className="mt-1 text-sm font-bold text-green-400">Program Active</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
