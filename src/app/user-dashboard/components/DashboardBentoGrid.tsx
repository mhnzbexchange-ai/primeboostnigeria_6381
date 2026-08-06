'use client';

import React, { useState, useEffect } from 'react';
import { Wallet, ShoppingBag, TrendingUp, Gift, AlertCircle, CheckCircle, Clock, Plus } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardStats {
  walletBalance: number;
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  failedOrders: number;
  referralEarnings: number;
  pendingReferralWithdrawal: number;
  thisMonthSpend: number;
}

export default function DashboardBentoGrid() {
  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('paystack');
  const [fundLoading, setFundLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    walletBalance: 0,
    totalOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    failedOrders: 0,
    referralEarnings: 0,
    pendingReferralWithdrawal: 0,
    thisMonthSpend: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    if (!user?.id) return;
    fetchStats();
  }, [user?.id]);

  const fetchStats = async () => {
    if (!user?.id) return;
    setStatsLoading(true);
    try {
      // Fetch wallet
      const { data: wallet } = await supabase
        .from('wallets')
        .select('balance, referral_earnings, pending_referral_withdrawal')
        .eq('user_id', user.id)
        .maybeSingle();

      // Fetch order counts
      const { data: orders } = await supabase
        .from('orders')
        .select('order_status, amount, created_at')
        .eq('user_id', user.id);

      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const totalOrders = orders?.length || 0;
      const activeOrders = orders?.filter(o => o.order_status === 'active' || o.order_status === 'processing').length || 0;
      const completedOrders = orders?.filter(o => o.order_status === 'completed').length || 0;
      const failedOrders = orders?.filter(o => o.order_status === 'failed').length || 0;
      const thisMonthSpend = orders
        ?.filter(o => o.created_at >= monthStart && (o.order_status === 'completed' || o.order_status === 'active' || o.order_status === 'processing'))
        ?.reduce((sum, o) => sum + Number(o.amount), 0) || 0;

      setStats({
        walletBalance: Number(wallet?.balance || 0),
        totalOrders,
        activeOrders,
        completedOrders,
        failedOrders,
        referralEarnings: Number(wallet?.referral_earnings || 0),
        pendingReferralWithdrawal: Number(wallet?.pending_referral_withdrawal || 0),
        thisMonthSpend,
      });
    } catch (err: any) {
      console.log('Stats fetch error:', err?.message);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleFundWallet = async () => {
    if (!fundAmount || Number(fundAmount) < 500) {
      toast?.error('Minimum funding amount is ₦500');
      return;
    }
    setFundLoading(true);
    try {
      // Record the funding transaction (in a real app, payment gateway would confirm first)
      const { data: wallet } = await supabase
        .from('wallets')
        .select('id')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (wallet?.id) {
        await supabase.from('wallet_transactions').insert({
          user_id: user?.id,
          wallet_id: wallet.id,
          transaction_type: 'credit',
          source: 'wallet_fund',
          amount: Number(fundAmount),
          description: `Wallet funded via ${selectedMethod}`,
        });

        await supabase.from('wallets')
          .update({
            balance: stats.walletBalance + Number(fundAmount),
            total_funded: stats.walletBalance + Number(fundAmount),
          })
          .eq('user_id', user?.id);

        await fetchStats();
      }

      setFundModalOpen(false);
      toast?.success(`₦${Number(fundAmount)?.toLocaleString('en-NG')} wallet funding initiated via ${selectedMethod}`);
      setFundAmount('');
    } catch (err: any) {
      toast?.error('Failed to process funding. Please try again.');
    } finally {
      setFundLoading(false);
    }
  };

  const quickAmounts = [1000, 2000, 5000, 10000, 20000, 50000];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Hero: Wallet Balance */}
        <div className="sm:col-span-2 xl:col-span-2 card-base card-gradient-bg border-primary/30 glow-gold-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 blur-2xl" style={{ background: 'var(--primary)', transform: 'translate(30%, -30%)' }} />
          <div className="flex items-start justify-between mb-4 relative z-10">
            <div>
              <p className="section-label mb-1">WALLET BALANCE</p>
              <div className="text-4xl font-extrabold tabular-nums gold-gradient-text">
                {statsLoading ? '...' : `₦${stats?.walletBalance?.toLocaleString('en-NG')}`}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Available to spend</p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10">
              <Wallet size={24} className="text-primary" />
            </div>
          </div>
          <div className="flex gap-2 relative z-10">
            <button
              onClick={() => setFundModalOpen(true)}
              className="btn-primary flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold"
            >
              <Plus size={13} />
              Fund Wallet
            </button>
            <button className="btn-outline-gold px-4 py-2 rounded-lg text-xs font-semibold">
              Withdraw
            </button>
          </div>
        </div>

        {/* Total Orders */}
        <div className="card-base card-gradient-bg hover:border-primary/20 transition-all">
          <div className="flex items-center justify-between mb-3">
            <p className="section-label">TOTAL ORDERS</p>
            <div className="p-2 rounded-lg bg-blue-400/10">
              <ShoppingBag size={16} className="text-blue-400" />
            </div>
          </div>
          <div className="text-3xl font-extrabold tabular-nums mb-1">{statsLoading ? '...' : stats?.totalOrders}</div>
          <p className="text-xs text-muted-foreground">All time</p>
          <div className="mt-3 flex gap-1.5">
            <span className="badge-base status-completed">{stats?.completedOrders} done</span>
            <span className="badge-base status-failed">{stats?.failedOrders} failed</span>
          </div>
        </div>

        {/* Active Orders */}
        <div className={`card-base card-gradient-bg transition-all ${stats?.activeOrders > 0 ? 'border-yellow-500/30' : ''}`}>
          <div className="flex items-center justify-between mb-3">
            <p className="section-label">ACTIVE ORDERS</p>
            <div className="p-2 rounded-lg bg-yellow-400/10">
              <Clock size={16} className="text-yellow-400 animate-pulse" />
            </div>
          </div>
          <div className="text-3xl font-extrabold tabular-nums mb-1">{statsLoading ? '...' : stats?.activeOrders}</div>
          <p className="text-xs text-muted-foreground">Currently processing</p>
          {stats?.activeOrders > 0 && (
            <div className="mt-3">
              <span className="badge-base status-processing">In progress</span>
            </div>
          )}
        </div>

        {/* This month spend */}
        <div className="card-base card-gradient-bg hover:border-primary/20 transition-all">
          <div className="flex items-center justify-between mb-3">
            <p className="section-label">THIS MONTH</p>
            <div className="p-2 rounded-lg bg-green-400/10">
              <TrendingUp size={16} className="text-green-400" />
            </div>
          </div>
          <div className="text-2xl font-extrabold tabular-nums mb-1 text-green-400">
            {statsLoading ? '...' : `₦${stats?.thisMonthSpend?.toLocaleString('en-NG')}`}
          </div>
          <p className="text-xs text-muted-foreground">Total spent this month</p>
          <div className="mt-3 w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div className="h-full gold-gradient-bg rounded-full" style={{ width: '68%' }} />
          </div>
        </div>

        {/* Referral earnings */}
        <div className="card-base card-gradient-bg hover:border-primary/20 transition-all">
          <div className="flex items-center justify-between mb-3">
            <p className="section-label">REFERRAL EARNINGS</p>
            <div className="p-2 rounded-lg bg-primary/10">
              <Gift size={16} className="text-primary" />
            </div>
          </div>
          <div className="text-2xl font-extrabold tabular-nums mb-1 gold-gradient-text">
            {statsLoading ? '...' : `₦${stats?.referralEarnings?.toLocaleString('en-NG')}`}
          </div>
          <p className="text-xs text-muted-foreground">Total earned</p>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="badge-base status-pending">₦{stats?.pendingReferralWithdrawal?.toLocaleString('en-NG')} pending</span>
          </div>
        </div>

        {/* Alert: failed orders */}
        <div className={`card-base card-gradient-bg border-red-500/30 transition-all ${stats?.failedOrders > 0 ? 'bg-red-500/5' : ''}`}>
          <div className="flex items-center justify-between mb-3">
            <p className="section-label text-red-400/70">NEEDS ATTENTION</p>
            <div className="p-2 rounded-lg bg-red-400/10">
              <AlertCircle size={16} className="text-red-400" />
            </div>
          </div>
          <div className="text-2xl font-extrabold tabular-nums mb-1 text-red-400">{statsLoading ? '...' : stats?.failedOrders}</div>
          <p className="text-xs text-muted-foreground">Failed orders · Refunds pending</p>
          <div className="mt-3">
            <button className="text-xs text-red-400 hover:underline font-medium">View failed orders →</button>
          </div>
        </div>

        {/* Completed */}
        <div className="card-base card-gradient-bg hover:border-primary/20 transition-all">
          <div className="flex items-center justify-between mb-3">
            <p className="section-label">COMPLETED</p>
            <div className="p-2 rounded-lg bg-primary/10">
              <CheckCircle size={16} className="text-primary" />
            </div>
          </div>
          <div className="text-2xl font-extrabold tabular-nums mb-1 text-primary">{statsLoading ? '...' : stats?.completedOrders}</div>
          <p className="text-xs text-muted-foreground">Orders fulfilled</p>
          <div className="mt-2">
            <div className="flex items-center gap-1.5">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-400 rounded-full"
                  style={{ width: `${stats?.totalOrders > 0 ? Math.round((stats?.completedOrders / stats?.totalOrders) * 100) : 0}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground tabular-nums w-8 text-right">
                {stats?.totalOrders > 0 ? Math.round((stats?.completedOrders / stats?.totalOrders) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fund Wallet Modal */}
      <Modal open={fundModalOpen} onClose={() => setFundModalOpen(false)} title="Fund Your Wallet">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Enter Amount (₦)</label>
            <input
              type="number"
              className="input-field text-lg font-bold"
              placeholder="5,000"
              value={fundAmount}
              onChange={(e) => setFundAmount(e?.target?.value)}
              min={500}
            />
            <p className="text-xs text-muted-foreground mt-1.5">Minimum: ₦500 · Maximum: ₦500,000</p>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Quick amounts</p>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts?.map((amt) => (
                <button
                  key={`quick-${amt}`}
                  type="button"
                  onClick={() => setFundAmount(String(amt))}
                  className={`py-2 rounded-lg text-xs font-semibold border transition-all ${fundAmount === String(amt) ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'}`}
                >
                  ₦{amt?.toLocaleString('en-NG')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Payment Method</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'paystack', label: 'Paystack', emoji: '💳' },
                { id: 'flutterwave', label: 'Flutterwave', emoji: '🦋' },
                { id: 'bank', label: 'Bank Transfer', emoji: '🏦' },
                { id: 'opay', label: 'Opay', emoji: '📱' },
                { id: 'palmpay', label: 'PalmPay', emoji: '🌴' },
                { id: 'moniepoint', label: 'Moniepoint', emoji: '💰' },
              ]?.map((m) => (
                <button
                  key={`method-${m?.id}`}
                  type="button"
                  onClick={() => setSelectedMethod(m?.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all ${selectedMethod === m?.id ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/40 text-muted-foreground hover:text-foreground'}`}
                >
                  <span>{m?.emoji}</span>
                  {m?.label}
                </button>
              ))}
            </div>
          </div>

          {fundAmount && Number(fundAmount) >= 500 && (
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-semibold tabular-nums">₦{Number(fundAmount)?.toLocaleString('en-NG')}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-muted-foreground">Processing fee</span>
                <span className="font-semibold tabular-nums text-green-400">₦0</span>
              </div>
              <div className="border-t border-border mt-2 pt-2 flex justify-between">
                <span className="font-semibold text-sm">Total</span>
                <span className="font-extrabold gold-gradient-text tabular-nums">₦{Number(fundAmount)?.toLocaleString('en-NG')}</span>
              </div>
            </div>
          )}

          <button
            onClick={handleFundWallet}
            disabled={fundLoading || !fundAmount || Number(fundAmount) < 500}
            className="btn-primary w-full py-3 rounded-xl text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {fundLoading ? 'Processing...' : `Fund ₦${Number(fundAmount || 0)?.toLocaleString('en-NG')}`}
          </button>
        </div>
      </Modal>
    </>
  );
}