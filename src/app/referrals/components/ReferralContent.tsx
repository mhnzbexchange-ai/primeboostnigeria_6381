'use client';

import React, { useState, useEffect } from 'react';
import {
  Gift,
  Copy,
  CheckCircle,
  Users,
  TrendingUp,
  MousePointerClick,
  DollarSign,
  Share2,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ReferralStats {
  code: string;
  link: string;
  totalClicks: number;
  totalReferrals: number;
  activeReferrals: number;
  totalEarned: number;
  pendingWithdrawal: number;
  commissionRate: number;
  thisMonthEarned: number;
}

interface ReferralEntry {
  id: string;
  name: string;
  joinedAt: string;
  orders: number;
  earned: number;
  isActive: boolean;
}

interface EarningsBreakdown {
  month: string;
  amount: number;
}

export default function ReferralContent() {
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<ReferralStats>({
    code: '',
    link: '',
    totalClicks: 0,
    totalReferrals: 0,
    activeReferrals: 0,
    totalEarned: 0,
    pendingWithdrawal: 0,
    commissionRate: 5,
    thisMonthEarned: 0,
  });
  const [referralHistory, setReferralHistory] = useState<ReferralEntry[]>([]);
  const [earningsBreakdown, setEarningsBreakdown] = useState<EarningsBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    if (!user?.id) return;
    fetchReferralData();
  }, [user?.id]);

  const fetchReferralData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [profileRes, walletRes, referralsRes] = await Promise.all([
        supabase.from('user_profiles').select('referral_code').eq('id', user.id).maybeSingle(),
        supabase.from('wallets').select('referral_earnings, pending_referral_withdrawal').eq('user_id', user.id).maybeSingle(),
        supabase.from('referrals').select('id, referred_id, commission_earned, orders_count, created_at').eq('referrer_id', user.id).order('created_at', { ascending: false }),
      ]);

      const code = profileRes.data?.referral_code || '';
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://primeboostng.com';
      const referralLink = code ? `${siteUrl}/ref/${code}` : '';

      const referrals = referralsRes.data || [];

      // Fetch referred user profiles
      const referralEntries: ReferralEntry[] = [];
      if (referrals.length > 0) {
        const referredIds = referrals.map((r) => r.referred_id);
        const { data: referredProfiles } = await supabase
          .from('user_profiles')
          .select('id, full_name, created_at')
          .in('id', referredIds);

        referrals.forEach((ref) => {
          const profile = referredProfiles?.find((p) => p.id === ref.referred_id);
          if (profile) {
            const d = new Date(profile.created_at);
            referralEntries.push({
              id: ref.id,
              name: profile.full_name || 'Unknown User',
              joinedAt: `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`,
              orders: ref.orders_count || 0,
              earned: Number(ref.commission_earned || 0),
              isActive: (ref.orders_count || 0) > 0,
            });
          }
        });
      }

      // Build monthly earnings breakdown from referral entries
      const monthlyMap: Record<string, number> = {};
      referralEntries.forEach((entry) => {
        const parts = entry.joinedAt.split('/');
        const monthKey = `${parts[2]}-${parts[1]}`;
        monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + entry.earned;
      });
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const breakdown: EarningsBreakdown[] = Object.entries(monthlyMap)
        .sort(([a], [b]) => b.localeCompare(a))
        .slice(0, 6)
        .map(([key, amount]) => {
          const [, month] = key.split('-');
          return { month: monthNames[parseInt(month, 10) - 1], amount };
        })
        .reverse();

      const now = new Date();
      const thisMonthEarned = referralEntries
        .filter((e) => {
          const parts = e.joinedAt.split('/');
          return parseInt(parts[2], 10) === now.getFullYear() && parseInt(parts[1], 10) === now.getMonth() + 1;
        })
        .reduce((sum, e) => sum + e.earned, 0);

      setStats({
        code,
        link: referralLink,
        totalClicks: 0,
        totalReferrals: referrals.length,
        activeReferrals: referrals.filter((r) => r.orders_count > 0).length,
        totalEarned: Number(walletRes.data?.referral_earnings || 0),
        pendingWithdrawal: Number(walletRes.data?.pending_referral_withdrawal || 0),
        commissionRate: 5,
        thisMonthEarned,
      });
      setReferralHistory(referralEntries);
      setEarningsBreakdown(breakdown);
    } catch (err: any) {
      console.error('Referral fetch error:', err?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!stats.link) return;
    navigator.clipboard?.writeText(stats.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    if (!stats.link) return;
    const message = encodeURIComponent(
      `🚀 Boost your social media with PrimeBoost Nigeria!\nUse my referral link and get started:\n${stats.link}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const maxEarnings = Math.max(...earningsBreakdown.map((e) => e.amount), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Referral Program</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Earn {stats.commissionRate}% commission on every order your referrals place.
          </p>
        </div>
        <span className="badge-base status-completed text-xs px-3 py-1">
          {stats.commissionRate}% Commission
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-base card-gradient-bg flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <MousePointerClick size={16} className="text-blue-400" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Clicks</span>
          </div>
          <div className="text-2xl font-extrabold tabular-nums">
            {loading ? '—' : stats.totalClicks.toLocaleString('en-NG')}
          </div>
          <p className="text-xs text-muted-foreground">Total link clicks</p>
        </div>

        <div className="card-base card-gradient-bg flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Users size={16} className="text-purple-400" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Referrals</span>
          </div>
          <div className="text-2xl font-extrabold tabular-nums">
            {loading ? '—' : stats.totalReferrals}
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-400 font-semibold">{loading ? '—' : stats.activeReferrals} active</span>
          </p>
        </div>

        <div className="card-base card-gradient-bg flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <TrendingUp size={16} className="text-green-400" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Active</span>
          </div>
          <div className="text-2xl font-extrabold tabular-nums">
            {loading ? '—' : stats.activeReferrals}
          </div>
          <p className="text-xs text-muted-foreground">Placed at least 1 order</p>
        </div>

        <div className="card-base card-gradient-bg flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <DollarSign size={16} className="text-primary" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Earned</span>
          </div>
          <div className="text-2xl font-extrabold tabular-nums gold-gradient-text">
            {loading ? '—' : `₦${stats.totalEarned.toLocaleString('en-NG')}`}
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="text-primary font-semibold">
              +₦{loading ? '—' : stats.thisMonthEarned.toLocaleString('en-NG')}
            </span>{' '}
            this month
          </p>
        </div>
      </div>

      {/* Referral Link + Earnings Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Referral Link Card */}
        <div className="lg:col-span-3 card-base card-gradient-bg space-y-5">
          <div className="flex items-center gap-2">
            <Gift size={18} className="text-primary" />
            <h2 className="font-bold text-base">Your Referral Link</h2>
          </div>

          {/* Link display */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Share this link to earn commissions</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs font-mono text-primary truncate">
                {loading ? 'Loading your link...' : (stats.link || 'No referral link available')}
              </code>
            </div>
            {stats.code && (
              <p className="text-[10px] text-muted-foreground mt-2">
                Code: <span className="font-bold text-foreground">{stats.code}</span>
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              disabled={!stats.link || loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-sm font-semibold transition-all disabled:opacity-50"
            >
              {copied ? <CheckCircle size={15} /> : <Copy size={15} />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <button
              onClick={handleWhatsAppShare}
              disabled={!stats.link || loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-semibold transition-all disabled:opacity-50"
            >
              <Share2 size={15} />
              WhatsApp
            </button>
          </div>

          {/* How it works */}
          <div className="pt-4 border-t border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-3">How it works</p>
            <div className="space-y-2">
              {[
                { step: '1', text: 'Share your unique referral link with friends' },
                { step: '2', text: 'They sign up and place an order on PrimeBoost' },
                { step: '3', text: `You earn ${stats.commissionRate}% commission on every order they make` },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full gold-gradient-bg flex items-center justify-center text-[10px] font-bold text-primary-foreground flex-shrink-0 mt-0.5">
                    {item.step}
                  </span>
                  <p className="text-xs text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Withdraw CTA */}
          {stats.pendingWithdrawal >= 2000 && (
            <div className="pt-4 border-t border-border flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold">Available to withdraw</p>
                <p className="text-xl font-extrabold gold-gradient-text tabular-nums">
                  ₦{stats.pendingWithdrawal.toLocaleString('en-NG')}
                </p>
              </div>
              <button className="btn-primary px-5 py-2 rounded-xl text-sm font-semibold">
                Withdraw
              </button>
            </div>
          )}
        </div>

        {/* Earnings Breakdown */}
        <div className="lg:col-span-2 card-base card-gradient-bg space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-primary" />
            <h2 className="font-bold text-base">Earnings Breakdown</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          ) : earningsBreakdown.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2">
              <Gift size={28} className="text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground text-center">No earnings yet. Start sharing!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {earningsBreakdown.map((item) => (
                <div key={item.month} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-8 flex-shrink-0">{item.month}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted/40 overflow-hidden">
                    <div
                      className="h-full rounded-full gold-gradient-bg transition-all duration-500"
                      style={{ width: `${(item.amount / maxEarnings) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold tabular-nums text-right w-20 flex-shrink-0">
                    ₦{item.amount.toLocaleString('en-NG')}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Summary totals */}
          <div className="pt-4 border-t border-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Total earned</span>
              <span className="font-bold gold-gradient-text">₦{stats.totalEarned.toLocaleString('en-NG')}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Pending withdrawal</span>
              <span className="font-bold text-yellow-400">₦{stats.pendingWithdrawal.toLocaleString('en-NG')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Referral History Table */}
      <div className="card-base card-gradient-bg">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-primary" />
            <h2 className="font-bold text-base">Referral History</h2>
          </div>
          <span className="text-xs text-muted-foreground">{stats.totalReferrals} total</span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 rounded-xl bg-muted/30 animate-pulse" />
            ))}
          </div>
        ) : referralHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Gift size={24} className="text-primary/60" />
            </div>
            <p className="text-sm font-medium">No referrals yet</p>
            <p className="text-xs text-muted-foreground text-center max-w-xs">
              Share your referral link and start earning commissions when friends place orders.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-muted-foreground pb-3 pr-4">User</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground pb-3 pr-4">Joined</th>
                  <th className="text-center text-xs font-semibold text-muted-foreground pb-3 pr-4">Orders</th>
                  <th className="text-center text-xs font-semibold text-muted-foreground pb-3 pr-4">Status</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground pb-3">Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {referralHistory.map((ref) => (
                  <tr key={ref.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full gold-gradient-bg flex items-center justify-center text-[10px] font-bold text-primary-foreground flex-shrink-0">
                          {ref.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="font-medium text-sm truncate max-w-[120px]">{ref.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock size={11} />
                        {ref.joinedAt}
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-center">
                      <span className="text-sm font-semibold tabular-nums">{ref.orders}</span>
                    </td>
                    <td className="py-3 pr-4 text-center">
                      <span className={`badge-base text-[10px] ${ref.isActive ? 'status-completed' : 'status-pending'}`}>
                        {ref.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1 text-green-400 font-bold text-sm tabular-nums">
                        <ArrowUpRight size={12} />
                        ₦{ref.earned.toLocaleString('en-NG')}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
