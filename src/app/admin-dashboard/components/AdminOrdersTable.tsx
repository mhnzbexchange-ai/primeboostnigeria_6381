'use client';

import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, RefreshCw } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

interface AdminOrder {
  id: string;
  user_id: string;
  platform: string;
  service_name: string;
  quantity: number;
  amount: number;
  order_status: string;
  created_at: string;
  progress: number;
  user_profiles?: { full_name: string; email: string } | null;
}

type OrderStatus = 'all' | 'pending' | 'processing' | 'active' | 'completed' | 'failed' | 'cancelled';

export default function AdminOrdersTable() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus>('all');
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchOrders();
  }, []);

  // Real-time subscription for all orders
  useEffect(() => {
    const channel = supabase
      .channel('admin_orders_realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders',
      }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, user_profiles(full_name, email)')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        if (error.code?.startsWith('42')) throw error;
        console.log('Admin orders error:', error.message);
        return;
      }
      setOrders(data || []);
    } catch (err: any) {
      console.log('Admin orders fetch error:', err?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ order_status: newStatus, progress: newStatus === 'completed' ? 100 : undefined })
        .eq('id', orderId);

      if (error) throw error;
      toast.success(`Order updated to ${newStatus}`);

      // Send status update email for delivered or cancelled orders
      if (newStatus === 'completed' || newStatus === 'cancelled') {
        try {
          const order = orders.find(o => o.id === orderId);
          const userEmail = order?.user_profiles?.email;
          const userName = order?.user_profiles?.full_name || order?.user_profiles?.email || '';
          if (userEmail && order) {
            await fetch('/api/send-order-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: newStatus === 'completed' ? 'order_delivered' : 'order_cancelled',
                to: userEmail,
                name: userName,
                order: {
                  orderId: order.id.slice(0, 8).toUpperCase(),
                  platform: order.platform,
                  serviceName: order.service_name,
                  quantity: order.quantity,
                  amount: order.amount,
                },
              }),
            });
          }
        } catch {
          // Non-blocking: status update succeeds regardless of email
        }
      }

      fetchOrders();
    } catch (err: any) {
      toast.error('Failed to update order status');
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  const filtered = orders.filter(o => {
    const userName = o.user_profiles?.full_name || '';
    const userEmail = o.user_profiles?.email || '';
    const matchSearch = !search ||
      userName.toLowerCase().includes(search.toLowerCase()) ||
      o.id.includes(search) ||
      o.platform.toLowerCase().includes(search.toLowerCase()) ||
      userEmail.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.order_status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="card-base card-gradient-bg">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="font-bold text-base">Order Management</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{orders.length} total orders</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="flex items-center gap-2 bg-muted/40 rounded-lg px-3 py-2">
            <Search size={13} className="text-muted-foreground" />
            <input
              type="text"
              placeholder="Search orders..."
              className="bg-transparent text-xs outline-none text-foreground placeholder:text-muted-foreground w-32"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1.5 bg-muted/40 rounded-lg px-3 py-2">
            <select
              className="bg-transparent text-xs outline-none text-foreground cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus)}
            >
              {(['all', 'pending', 'processing', 'active', 'completed', 'failed', 'cancelled'] as OrderStatus[]).map(s => (
                <option key={s} value={s} className="bg-background">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <ChevronDown size={12} className="text-muted-foreground" />
          </div>
          <button onClick={fetchOrders} className="flex items-center gap-1.5 bg-muted/40 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCw size={12} />
            Refresh
          </button>
        </div>
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
                {['Order ID', 'User', 'Platform', 'Service', 'Qty', 'Amount', 'Status', 'Date', 'Actions'].map((col) => (
                  <th key={`admin-col-${col.replace(/\s/g, '-').toLowerCase()}`} className="text-left text-xs font-semibold text-muted-foreground pb-3 pr-4 whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors group">
                  <td className="py-3 pr-4">
                    <span className="font-mono text-xs text-primary">#{order.id.slice(0, 8).toUpperCase()}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <div>
                      <p className="text-xs font-medium">{order.user_profiles?.full_name || 'Unknown'}</p>
                      <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">{order.user_profiles?.email || ''}</p>
                    </div>
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <span className="text-xs font-medium">{order.platform}</span>
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
                    <StatusBadge status={order.order_status as any} size="sm" />
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <span className="text-xs text-muted-foreground">{formatDate(order.created_at)}</span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <select
                        className="bg-muted/40 text-xs rounded-lg px-2 py-1 border border-border outline-none cursor-pointer text-foreground"
                        value={order.order_status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        {['pending', 'processing', 'active', 'completed', 'failed', 'cancelled'].map(s => (
                          <option key={s} value={s} className="bg-background">{s}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-sm">No orders found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}