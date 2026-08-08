'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import DashboardBentoGrid from './components/DashboardBentoGrid';
import DashboardRecentOrders from './components/DashboardRecentOrders';
import DashboardReferralWidget from './components/DashboardReferralWidget';
import DashboardWalletHistory from './components/DashboardWalletHistory';
import { useAuth } from '@/contexts/AuthContext';

export default function UserDashboardPage() {
  const { user, loading } = useAuth();

  const firstName =
    user?.user_metadata?.first_name ||
    user?.user_metadata?.full_name?.split(' ')[0] ||
    'there';

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>

            <p className="text-sm text-muted-foreground mt-0.5">
              Welcome back, {loading ? '...' : firstName} 👋 Here's what's happening.
            </p>
          </div>

          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Last updated: just now
          </span>
        </div>

        <DashboardBentoGrid />

        <DashboardRecentOrders />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardWalletHistory />
          <DashboardReferralWidget />
        </div>
      </div>
    </AppLayout>
  );
}