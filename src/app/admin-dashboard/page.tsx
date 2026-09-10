import React from 'react';
import AppLayout from '@/components/AppLayout';
import AdminBentoGrid from './components/AdminBentoGrid';
import AdminAdvertisements from './components/AdminAdvertisements';
import AdminRevenueChart from './components/AdminRevenueChart';
import AdminOrdersTable from './components/AdminOrdersTable';
import AdminPendingPayments from './components/AdminPendingPayments';
import AdminPlatformChart from './components/AdminPlatformChart';
import AdminPaystackTransactions from './components/AdminPaystackTransactions';

export default function AdminDashboardPage() {
  return (
    <AppLayout isAdmin>
      <div className="space-y-6">

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold">
              Admin Dashboard
            </h1>

            <p className="text-sm text-muted-foreground mt-0.5">
              PrimeBoost Nigeria — Platform Overview · August 2026
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              All systems operational
            </span>

            <span className="badge-base status-failed">
              Admin Access
            </span>
          </div>
        </div>

        <AdminBentoGrid />

        <AdminAdvertisements />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <AdminRevenueChart />
          </div>

          <AdminPlatformChart />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <AdminOrdersTable />
          </div>

          <AdminPendingPayments />
        </div>

        <AdminPaystackTransactions />

      </div>
    </AppLayout>
  );
}
