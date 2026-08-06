'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import RevenueChartInner from '@/app/admin-dashboard/components/RevenueChartInner';


const RevenueChartInner = dynamic(
  () => import(/* webpackChunkName: "revenue-chart-inner" */ './RevenueChartInner'),
  { ssr: false, loading: () => <div className="h-[200px]" /> }
);

export default function AdminRevenueChart() {
  return (
    <div className="card-base card-gradient-bg">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-bold text-base">Revenue (Last 30 Days)</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Daily revenue in Nigerian Naira</p>
        </div>
        <div className="flex gap-2">
          {['7D', '30D', '90D']?.map((r) => (
            <button
              key={`range-${r}`}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${r === '30D' ? 'gold-gradient-bg text-primary-foreground' : 'bg-muted/40 text-muted-foreground hover:text-foreground'}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <RevenueChartInner />
    </div>
  );
}