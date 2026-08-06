'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const revenueData = [
  { date: '07/07', revenue: 142000 },
  { date: '08/07', revenue: 168000 },
  { date: '09/07', revenue: 135000 },
  { date: '10/07', revenue: 189000 },
  { date: '11/07', revenue: 220000 },
  { date: '12/07', revenue: 198000 },
  { date: '13/07', revenue: 87000 },
  { date: '14/07', revenue: 245000 },
  { date: '15/07', revenue: 267000 },
  { date: '16/07', revenue: 234000 },
  { date: '17/07', revenue: 289000 },
  { date: '18/07', revenue: 312000 },
  { date: '19/07', revenue: 278000 },
  { date: '20/07', revenue: 156000 },
  { date: '21/07', revenue: 189000 },
  { date: '22/07', revenue: 334000 },
  { date: '23/07', revenue: 298000 },
  { date: '24/07', revenue: 356000 },
  { date: '25/07', revenue: 389000 },
  { date: '26/07', revenue: 412000 },
  { date: '27/07', revenue: 178000 },
  { date: '28/07', revenue: 367000 },
  { date: '29/07', revenue: 423000 },
  { date: '30/07', revenue: 445000 },
  { date: '31/07', revenue: 398000 },
  { date: '01/08', revenue: 467000 },
  { date: '02/08', revenue: 489000 },
  { date: '03/08', revenue: 412000 },
  { date: '04/08', revenue: 534000 },
  { date: '05/08', revenue: 287000 },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-card">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="text-sm font-extrabold gold-gradient-text tabular-nums">
          ₦{payload[0].value.toLocaleString('en-NG')}
        </p>
      </div>
    );
  }
  return null;
};

export default function RevenueChartInner() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          interval={4}
        />
        <YAxis
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}K`}
          width={52}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="var(--primary)"
          strokeWidth={2}
          fill="url(#revenueGradient)"
          dot={false}
          activeDot={{ r: 5, fill: 'var(--primary)', stroke: 'var(--card)', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}