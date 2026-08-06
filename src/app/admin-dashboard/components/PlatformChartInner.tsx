'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const platformData = [
  { platform: 'TikTok', orders: 12847, color: '#f87171' },
  { platform: 'Instagram', orders: 9234, color: '#f472b6' },
  { platform: 'Telegram', orders: 7621, color: '#60a5fa' },
  { platform: 'X', orders: 4189, color: '#38bdf8' },
  { platform: 'Snapchat', orders: 2341, color: '#fbbf24' },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-card">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="text-sm font-bold tabular-nums">{payload[0].value.toLocaleString()} orders</p>
      </div>
    );
  }
  return null;
};

export default function PlatformChartInner() {
  return (
    <>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={platformData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal vertical={false} />
          <XAxis dataKey="platform" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="orders" radius={[6, 6, 0, 0]}>
            {platformData.map((entry) => (
              <Cell key={`cell-${entry.platform.toLowerCase()}`} fill={entry.color} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-4 space-y-2">
        {platformData.map((p) => {
          const total = platformData.reduce((s, d) => s + d.orders, 0);
          const pct = Math.round((p.orders / total) * 100);
          return (
            <div key={`legend-${p.platform.toLowerCase()}`} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: p.color }} />
              <span className="text-xs text-muted-foreground flex-1">{p.platform}</span>
              <span className="text-xs font-semibold tabular-nums">{p.orders.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground w-8 text-right">{pct}%</span>
            </div>
          );
        })}
      </div>
    </>
  );
}