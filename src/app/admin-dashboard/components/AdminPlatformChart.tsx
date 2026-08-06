'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import PlatformChartInner from '@/app/admin-dashboard/components/PlatformChartInner';


const PlatformChartInner = dynamic(
  () => import(/* webpackChunkName: "platform-chart-inner" */ './PlatformChartInner'),
  { ssr: false, loading: () => <div className="h-[200px]" /> }
);

export default function AdminPlatformChart() {
  return (
    <div className="card-base card-gradient-bg">
      <div className="mb-5">
        <h2 className="font-bold text-base">Orders by Platform</h2>
        <p className="text-xs text-muted-foreground mt-0.5">This month</p>
      </div>
      <PlatformChartInner />
    </div>
  );
}