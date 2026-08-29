'use client';

import React, { useEffect, useState } from 'react';
import { Users, ShoppingBag, Wallet, TrendingUp, AlertCircle, CheckCircle, BarChart3, Activity, UserCheck, CalendarDays } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface AdminStats {
  totalRevenue: number;
  totalUsers: number;
  newUsersToday: number;
  totalOrders: number;
  ordersToday: number;
  pendingOrders: number;
  failedOrders: number;
  completionRate: number;
  totalWalletFunds: number;
  pendingPayments: number;
  activeServices: number;
  // Active user stats
  activeUsers: number;
  activeToday: number;
  activeLast7Days: number;
}

export default function AdminBentoGrid() {
  const [stats, setStats] = useState<AdminStats>({
    totalRevenue: 0,
    totalUsers: 0,
    newUsersToday: 0,
    totalOrders: 0,
    ordersToday: 0,
    pendingOrders: 0,
    failedOrders: 0,
    completionRate: 0,
    totalWalletFunds: 0,
    pendingPayments: 0,
    activeServices: 0,
    activeUsers: 0,
    activeToday: 0,
    activeLast7Days: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    setLoading(true);
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayISO = todayStart.toISOString();

      // Fetch all orders
      const { data: orders } = await supabase
        .from('orders')
        .select('amount, order_status, created_at');

      // Fetch users
      const { count: totalUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      const { count: newUsersToday } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayISO);

      // Fetch wallet totals
      const { data: wallets } = await supabase
        .from('wallets')
        .select('total_funded');

      // Fetch active services
      const { count: activeServices } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Fetch active user stats via secure RPC
      const { data: activeData } = await supabase.rpc('get_active_users_count', {
        activity_window_minutes: 30,
      });
      const activeRow = Array.isArray(activeData) ? activeData[0] : activeData;

      const totalOrders = orders?.length || 0;
      const ordersToday = orders?.filter(o => o.created_at >= todayISO).length || 0;
      const pendingOrders = orders?.filter(o => o.order_status === 'pending' || o.order_status === 'processing').length || 0;
      const failedOrders = orders?.filter(o => o.order_status === 'failed').length || 0;
      const completedOrders = orders?.filter(o => o.order_status === 'completed').length || 0;
      const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100 * 10) / 10 : 0;
      const totalRevenue = orders?.filter(o => o.order_status === 'completed').reduce((sum, o) => sum + Number(o.amount), 0) || 0;
      const totalWalletFunds = wallets?.reduce((sum, w) => sum + Number(w.total_funded || 0), 0) || 0;

      setStats({
        totalRevenue,
        totalUsers: totalUsers || 0,
        newUsersToday: newUsersToday || 0,
        totalOrders,
        ordersToday,
        pendingOrders,
        failedOrders,
        completionRate,
        totalWalletFunds,
        pendingPayments: 0,
        activeServices: activeServices || 0,
        activeUsers: Number(activeRow?.active_users ?? 0),
        activeToday: Number(activeRow?.active_today ?? 0),
        activeLast7Days: Number(activeRow?.active_last_7_days ?? 0),
      });
    } catch (err: any) {
      console.log('Admin stats error:', err?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Hero: Total Revenue */}
      <div className="sm:col-span-2 xl:col-span-2 card-base card-gradient-bg border-primary/30 glow-gold-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 blur-2xl" style={{ background: 'var(--primary)', transform: 'translate(30%, -30%)' }} />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <p className="section-label">TOTAL REVENUE</p>
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp size={18} className="text-primary" />
            </div>
          </div>
          <div className="text-4xl font-extrabold tabular-nums gold-gradient-text mb-1">
            {loading ? '...' : `₦${(stats?.totalRevenue / 1000000)?.toFixed(2)}M`}
          </div>
          <p className="text-xs text-muted-foreground mb-3">All-time platform revenue</p>
          <div className="flex items-center gap-2">
            <span className="badge-base status-active">{stats?.completionRate}% completion rate</span>
          </div>
        </div>
      </div>

      {/* Total Users */}
      <div className="card-base card-gradient-bg hover:border-primary/20 transition-all">
        <div className="flex items-center justify-between mb-3">
          <p className="section-label">USERS</p>
          <div className="p-2 rounded-lg bg-blue-400/10">
            <Users size={16} className="text-blue-400" />
          </div>
        </div>
        <div className="text-3xl font-extrabold tabular-nums mb-1">{loading ? '...' : stats?.totalUsers?.toLocaleString('en-NG')}</div>
        <p className="text-xs text-muted-foreground">Registered accounts</p>
        <div className="mt-2">
          <span className="badge-base status-active">+{stats?.newUsersToday} today</span>
        </div>
      </div>

      {/* Pending Orders — alert */}
      <div className={`card-base card-gradient-bg border-yellow-500/30 transition-all ${stats?.pendingOrders > 0 ? 'bg-yellow-500/5' : ''}`}>
        <div className="flex items-center justify-between mb-3">
          <p className="section-label text-yellow-400/70">PENDING ORDERS</p>
          <div className="p-2 rounded-lg bg-yellow-400/10">
            <AlertCircle size={16} className="text-yellow-400 animate-pulse" />
          </div>
        </div>
        <div className="text-3xl font-extrabold tabular-nums mb-1 text-yellow-400">{loading ? '...' : stats?.pendingOrders}</div>
        <p className="text-xs text-muted-foreground">Awaiting processing</p>
        <div className="mt-2">
          <button className="text-xs text-yellow-400 hover:underline font-medium">Review now →</button>
        </div>
      </div>

      {/* ── ACTIVE USERS SECTION (3 cards spanning full row) ── */}

      {/* Active Users (last 30 min) */}
      <div className="card-base card-gradient-bg border-green-500/20 hover:border-green-500/40 transition-all">
        <div className="flex items-center justify-between mb-3">
          <p className="section-label text-green-400/70">ACTIVE USERS</p>
          <div className="p-2 rounded-lg bg-green-400/10">
            <Activity size={16} className="text-green-400 animate-pulse" />
          </div>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span className="text-3xl font-extrabold tabular-nums text-green-400">
            {loading ? '...' : stats?.activeUsers?.toLocaleString('en-NG')}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">Active in last 30 minutes</p>
        <div className="mt-2">
          <span className="badge-base" style={{ background: 'rgba(74,222,128,0.1)', color: 'rgb(74,222,128)', border: '1px solid rgba(74,222,128,0.2)' }}>
            of {stats?.totalUsers} total
          </span>
        </div>
      </div>

      {/* Active Today */}
      <div className="card-base card-gradient-bg hover:border-primary/20 transition-all">
        <div className="flex items-center justify-between mb-3">
          <p className="section-label">ACTIVE TODAY</p>
          <div className="p-2 rounded-lg bg-blue-400/10">
            <UserCheck size={16} className="text-blue-400" />
          </div>
        </div>
        <div className="text-3xl font-extrabold tabular-nums mb-1 text-blue-400">
          {loading ? '...' : stats?.activeToday?.toLocaleString('en-NG')}
        </div>
        <p className="text-xs text-muted-foreground">Seen today (UTC)</p>
      </div>

      {/* Active Last 7 Days */}
      <div className="card-base card-gradient-bg hover:border-primary/20 transition-all">
        <div className="flex items-center justify-between mb-3">
          <p className="section-label">LAST 7 DAYS</p>
          <div className="p-2 rounded-lg bg-purple-400/10">
            <CalendarDays size={16} className="text-purple-400" />
          </div>
        </div>
        <div className="text-3xl font-extrabold tabular-nums mb-1 text-purple-400">
          {loading ? '...' : stats?.activeLast7Days?.toLocaleString('en-NG')}
        </div>
        <p className="text-xs text-muted-foreground">Active users, past 7 days</p>
      </div>

      {/* Total Orders */}
      <div className="card-base card-gradient-bg hover:border-primary/20 transition-all">
        <div className="flex items-center justify-between mb-3">
          <p className="section-label">TOTAL ORDERS</p>
          <div className="p-2 rounded-lg bg-green-400/10">
            <ShoppingBag size={16} className="text-green-400" />
          </div>
        </div>
        <div className="text-2xl font-extrabold tabular-nums mb-1">{loading ? '...' : stats?.totalOrders?.toLocaleString('en-NG')}</div>
        <p className="text-xs text-muted-foreground">All-time orders</p>
        <div className="mt-2">
          <span className="badge-base status-active">+{stats?.ordersToday} today</span>
        </div>
      </div>

      {/* Wallet Funds */}
      <div className="card-base card-gradient-bg hover:border-primary/20 transition-all">
        <div className="flex items-center justify-between mb-3">
          <p className="section-label">WALLET FUNDS</p>
          <div className="p-2 rounded-lg bg-primary/10">
            <Wallet size={16} className="text-primary" />
          </div>
        </div>
        <div className="text-2xl font-extrabold tabular-nums mb-1 gold-gradient-text">
          {loading ? '...' : `₦${(stats?.totalWalletFunds / 1000000)?.toFixed(2)}M`}
        </div>
        <p className="text-xs text-muted-foreground">Total funded by users</p>
      </div>

      {/* Failed Orders */}
      <div className={`card-base card-gradient-bg border-red-500/30 transition-all ${stats?.failedOrders > 0 ? 'bg-red-500/5' : ''}`}>
        <div className="flex items-center justify-between mb-3">
          <p className="section-label text-red-400/70">FAILED ORDERS</p>
          <div className="p-2 rounded-lg bg-red-400/10">
            <AlertCircle size={16} className="text-red-400" />
          </div>
        </div>
        <div className="text-2xl font-extrabold tabular-nums mb-1 text-red-400">{loading ? '...' : stats?.failedOrders}</div>
        <p className="text-xs text-muted-foreground">Needs refund processing</p>
        <div className="mt-2">
          <button className="text-xs text-red-400 hover:underline font-medium">View failed →</button>
        </div>
      </div>

      {/* Active Services */}
      <div className="card-base card-gradient-bg hover:border-primary/20 transition-all">
        <div className="flex items-center justify-between mb-3">
          <p className="section-label">ACTIVE SERVICES</p>
          <div className="p-2 rounded-lg bg-primary/10">
            <BarChart3 size={16} className="text-primary" />
          </div>
        </div>
        <div className="text-2xl font-extrabold tabular-nums mb-1 text-primary">{loading ? '...' : stats?.activeServices}</div>
        <p className="text-xs text-muted-foreground">Services available</p>
        <div className="mt-2">
          <div className="flex items-center gap-1.5">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full gold-gradient-bg rounded-full" style={{ width: '85%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="card-base card-gradient-bg hover:border-primary/20 transition-all">
        <div className="flex items-center justify-between mb-3">
          <p className="section-label">COMPLETION RATE</p>
          <div className="p-2 rounded-lg bg-green-400/10">
            <CheckCircle size={16} className="text-green-400" />
          </div>
        </div>
        <div className="text-2xl font-extrabold tabular-nums mb-1 text-green-400">{loading ? '...' : `${stats?.completionRate}%`}</div>
        <p className="text-xs text-muted-foreground">Orders fulfilled</p>
        <div className="mt-2">
          <div className="flex items-center gap-1.5">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-green-400 rounded-full" style={{ width: `${stats?.completionRate}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}