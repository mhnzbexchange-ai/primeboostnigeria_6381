import React from 'react';
import AppLayout from '@/components/AppLayout';
import DashboardBentoGrid from './components/DashboardBentoGrid';
import DashboardRecentOrders from './components/DashboardRecentOrders';
import DashboardReferralWidget from './components/DashboardReferralWidget';
import DashboardWalletHistory from './components/DashboardWalletHistory';

export default function UserDashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Welcome back, Adaeze 👋 Here&apos;s what&apos;s happening.</p>
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