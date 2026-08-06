'use client';

import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle, Gift, Users, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ReferralData {
  code: string;
  link: string;
  totalReferrals: number;
  activeReferrals: number;
  totalEarned: number;
  pendingWithdrawal: number;
  commissionRate: number;
}

interface ReferralEntry {
  id: string;
  name: string;
  joinedAt: string;
  orders: number;
  earned: number;
}

export default function DashboardReferralWidget() {
  const [copied, setCopied] = useState(false);
  const [referralData, setReferralData] = useState<ReferralData>({
    code: '',
    link: '',
    totalReferrals: 0,
    activeReferrals: 0,
    totalEarned: 0,
    pendingWithdrawal: 0,
    commissionRate: 5,
  });
  const [referralHistory, setReferralHistory] = useState<ReferralEntry[]>([]);
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
      // Get user profile for referral code
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('referral_code')
        .eq('id', user.id)
        .maybeSingle();

      // Get wallet for earnings
      const { data: wallet } = await supabase
        .from('wallets')
        .select('referral_earnings, pending_referral_withdrawal')
        .eq('user_id', user.id)
        .maybeSingle();

      // Get referrals
      const { data: referrals } = await supabase
        .from('referrals')
        .select('id, referred_id, commission_earned, orders_count, created_at')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      // Get referred user names
      const referralEntries: ReferralEntry[] = [];
      if (referrals && referrals.length > 0) {
        const referredIds = referrals.map(r => r.referred_id);
        const { data: referredProfiles } = await supabase
          .from('user_profiles')
          .select('id, full_name, created_at')
          .in('id', referredIds);

        referrals.forEach(ref => {
          const profile = referredProfiles?.find(p => p.id === ref.referred_id);
          if (profile) {
            const d = new Date(profile.created_at);
            referralEntries.push({
              id: ref.id,
              name: profile.full_name || 'Unknown User',
              joinedAt: `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`,
              orders: ref.orders_count || 0,
              earned: Number(ref.commission_earned || 0),
            });
          }
        });
      }

      const code = profile?.referral_code || '';
      const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://primeboostng.com';

      setReferralData({
        code,
        link: code ? `${siteUrl}/ref/${code}` : '',
        totalReferrals: referrals?.length || 0,
        activeReferrals: referrals?.filter(r => r.orders_count > 0).length || 0,
        totalEarned: Number(wallet?.referral_earnings || 0),
        pendingWithdrawal: Number(wallet?.pending_referral_withdrawal || 0),
        commissionRate: 5,
      });
      setReferralHistory(referralEntries);
    } catch (err: any) {
      console.log('Referral fetch error:', err?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!referralData?.link) return;
    navigator.clipboard?.writeText(referralData?.link);
    setCopied(true);
    toast?.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="card-base card-gradient-bg">
      <div className="flex items-center gap-2 mb-5">
        <Gift size={18} className="text-primary" />
        <h2 className="font-bold text-base">Referral Program</h2>
        <span className="badge-base status-completed ml-auto">{referralData?.commissionRate}% commission</span>
      </div>

      {/* Referral link */}
      <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 mb-5">
        <p className="text-xs font-semibold text-muted-foreground mb-2">Your Referral Link</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-xs font-mono text-primary truncate">
            {loading ? 'Loading...' : (referralData?.link || 'No referral link yet')}
          </code>
          <button
            onClick={handleCopy}
            disabled={!referralData?.link}
            className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-primary flex-shrink-0 disabled:opacity-50"
            title="Copy referral link"
          >
            {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="text-center p-2.5 rounded-xl bg-muted/30">
          <Users size={14} className="text-blue-400 mx-auto mb-1" />
          <div className="font-bold text-lg tabular-nums">{loading ? '...' : referralData?.totalReferrals}</div>
          <p className="text-[10px] text-muted-foreground">Total</p>
        </div>
        <div className="text-center p-2.5 rounded-xl bg-muted/30">
          <TrendingUp size={14} className="text-green-400 mx-auto mb-1" />
          <div className="font-bold text-lg tabular-nums">{loading ? '...' : referralData?.activeReferrals}</div>
          <p className="text-[10px] text-muted-foreground">Active</p>
        </div>
        <div className="text-center p-2.5 rounded-xl bg-muted/30">
          <Gift size={14} className="text-primary mx-auto mb-1" />
          <div className="font-bold text-sm tabular-nums gold-gradient-text">
            {loading ? '...' : `₦${(referralData?.totalEarned / 1000)?.toFixed(1)}K`}
          </div>
          <p className="text-[10px] text-muted-foreground">Earned</p>
        </div>
      </div>

      {/* Recent referrals */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-2">Recent Referrals</p>
        {loading ? (
          <p className="text-xs text-muted-foreground text-center py-4">Loading...</p>
        ) : referralHistory.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">No referrals yet. Share your link!</p>
        ) : (
          <div className="space-y-2">
            {referralHistory?.map((ref) => (
              <div key={ref?.id} className="flex items-center gap-2 py-1.5">
                <div className="w-7 h-7 rounded-full gold-gradient-bg flex items-center justify-center text-[10px] font-bold text-primary-foreground flex-shrink-0">
                  {ref?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{ref?.name}</p>
                  <p className="text-[10px] text-muted-foreground">{ref?.orders} orders · {ref?.joinedAt}</p>
                </div>
                <span className="text-xs font-bold text-green-400 tabular-nums">+₦{ref?.earned?.toLocaleString('en-NG')}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Withdraw CTA */}
      {referralData?.pendingWithdrawal >= 2000 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold">Available to withdraw</p>
              <p className="text-lg font-extrabold gold-gradient-text tabular-nums">₦{referralData?.pendingWithdrawal?.toLocaleString('en-NG')}</p>
            </div>
            <button className="btn-primary px-4 py-2 rounded-lg text-xs font-semibold">
              Withdraw
            </button>
          </div>
        </div>
      )}
    </div>
  );
}