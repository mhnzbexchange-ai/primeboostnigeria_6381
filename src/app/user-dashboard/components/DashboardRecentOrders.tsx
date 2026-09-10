'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ExternalLink, RefreshCw, ArrowRight } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Order {
  id: string;
  platform: string;
  service_name: string;
  quantity: number;
  amount: number;
  target_url: string;
  order_status: 'pending' | 'processing' | 'active' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  started_at: string;
  completed_at: string | null;
}

const platformEmoji: Record<string, string> = {
  TikTok: '🎵',
  Instagram: '📸',
  Telegram: '✈️',
  Snapchat: '👻',
  'X (Twitter)': '𝕏',
};

const STATUS_MESSAGES: Record<string, string> = {
  processing: 'is now being processed',
  active: 'is now active and running',
  completed: 'has been completed! 🎉',
  failed: 'has failed. Please contact support.',
  cancelled: 'has been cancelled.',
};

export default function DashboardRecentOrders() {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'failed'>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const [updatedIds, setUpdatedIds] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const supabase = createClient();
  const prevStatusRef = useRef<Record<string, string>>({});

  const fetchOrders = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        if (error.code?.startsWith('42')) throw error;
        console.log('Orders fetch error:', error.message);
        return;
      }
      const fetched = data || [];
      // Seed the previous status map on initial load
      const statusMap: Record<string, string> = {};
      fetched.forEach((o) => { statusMap[o.id] = o.order_status; });
      prevStatusRef.current = statusMap;
      setOrders(fetched);
    } catch (err: any) {
      console.log('Orders error:', err?.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Flash highlight helper
  const flashRow = (id: string) => {
    setUpdatedIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setUpdatedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 2500);
  };

  // Real-time subscription for order status updates
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`user_orders_realtime_${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const newOrder = payload.new as Order;
          setOrders((prev) => [newOrder, ...prev]);
          prevStatusRef.current[newOrder.id] = newOrder.order_status;
          flashRow(newOrder.id);
          toast.info(`New order #${newOrder.id.slice(0, 8).toUpperCase()} placed for ${newOrder.platform}`);
        } else if (payload.eventType === 'UPDATE') {
          const updated = payload.new as Order;
          const prevStatus = prevStatusRef.current[updated.id];

          setOrders((prev) =>
            prev.map((o) => o.id === updated.id ? { ...o, ...updated } : o)
          );
          flashRow(updated.id);

          // Only notify if status actually changed
          if (prevStatus && prevStatus !== updated.order_status) {
            const msg = STATUS_MESSAGES[updated.order_status];
            if (msg) {
              const shortId = `#${updated.id.slice(0, 8).toUpperCase()}`;
              if (updated.order_status === 'completed') {
                toast.success(`Order ${shortId} ${msg}`);
              } else if (updated.order_status === 'failed') {
                toast.error(`Order ${shortId} ${msg}`);
              } else {
                toast.info(`Order ${shortId} ${msg}`);
              }
            }
          }
          prevStatusRef.current[updated.id] = updated.order_status;
        } else if (payload.eventType === 'DELETE') {
          setOrders((prev) => prev.filter((o) => o.id !== payload.old.id));
        }
      })
      .subscribe((status) => {
        setRealtimeConnected(status === 'SUBSCRIBED');
      });

    return () => { supabase.removeChannel(channel); };
  }, [user?.id]);

  const filtered = filter === 'all'
    ? orders
    : orders.filter(o =>
        filter === 'active'
          ? (o.order_status === 'active' || o.order_status === 'processing')
          : o.order_status === filter
      );

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  return (
    <div className="card-base card-gradient-bg">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-base">Recent Orders</h2>
            <span
              className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium transition-all ${
                realtimeConnected
                  ? 'bg-green-500/15 text-green-400' :'bg-muted/40 text-muted-foreground'
              }`}
              title={realtimeConnected ? 'Live updates active' : 'Connecting…'}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  realtimeConnected ? 'bg-green-400 animate-pulse' : 'bg-muted-foreground'
                }`}
              />
              {realtimeConnected ? 'Live' : 'Connecting'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">Your latest {orders.length} orders</p>
        </div>
        <Link href="/order-form" className="btn-primary flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold">
          New Order <ArrowRight size={12} />
        </Link>
      </div>

      <div className="flex gap-1.5 mb-4 flex-wrap">
        {(['all', 'active', 'completed', 'failed'] as const).map((f) => (
          <button
            key={`order-filter-${f}`}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === f ? 'gold-gradient-bg text-primary-foreground' : 'bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/60'}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-sm">Loading orders...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Order ID', 'Platform', 'Service', 'Qty', 'Amount', 'Progress', 'Status', 'Date', ''].map((col) => (
                  <th key={`col-${col.replace(/\s/g, '-').toLowerCase() || 'actions'}`} className="text-left text-xs font-semibold text-muted-foreground pb-3 pr-4 whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  className={`border-b border-border/50 hover:bg-muted/20 transition-colors group ${
                    updatedIds.has(order.id) ? 'bg-primary/5 border-primary/20' : ''
                  }`}
                >
                  <td className="py-3 pr-4">
                    <span className="font-mono text-xs text-primary">#{order.id.slice(0, 8).toUpperCase()}</span>
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      <span className="text-base">{platformEmoji[order.platform] || '🌐'}</span>
                      <span className="text-xs font-medium">{order.platform}</span>
                    </span>
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <span className="text-xs">{order.service_name}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-xs tabular-nums font-semibold">{order.quantity?.toLocaleString('en-NG')}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-xs tabular-nums font-semibold text-primary">₦{Number(order.amount)?.toLocaleString('en-NG')}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2 min-w-[80px]">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${order.order_status === 'failed' ? 'bg-red-400' : order.order_status === 'completed' ? 'bg-green-400' : 'gold-gradient-bg'}`}
                          style={{ width: `${order.progress || 0}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground tabular-nums w-8 text-right">{order.progress || 0}%</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <StatusBadge status={order.order_status as any} size="sm" />
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <span className="text-xs text-muted-foreground">{formatDate(order.started_at)}</span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a
                        href={order.target_url?.startsWith('http') ? order.target_url : `https://${order.target_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        title="View URL"
                      >
                        <ExternalLink size={13} />
                      </a>
                      {(order.order_status === 'active' || order.order_status === 'processing') && (
                        <button
                          onClick={fetchOrders}
                          className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                          title="Refresh status"
                        >
                          <RefreshCw size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-sm">No {filter} orders found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}