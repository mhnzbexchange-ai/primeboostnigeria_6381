'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Loader2, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface PaystackTransaction {
  id: number;
  reference: string;
  amount: number;
  status: string;
  currency: string;
  paid_at: string | null;
  created_at: string;
  customer: {
    id: number;
    email: string;
    customer_code: string;
  };
  metadata?: {
    user_id?: string;
    [key: string]: any;
  };
  channel: string;
  gateway_response: string;
}

interface Meta {
  total: number;
  page: number;
  pageCount: number;
  perPage: number;
}

export default function AdminPaystackTransactions() {
  const [transactions, setTransactions] = useState<PaystackTransaction[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchTransactions = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/paystack-transactions?page=${p}`);
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions);
        setMeta(data.meta);
      }
    } catch (err) {
      console.error('Failed to fetch Paystack transactions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions(page);
  }, [fetchTransactions, page]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return (
      d.toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ' '+ d.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', hour12: false })
    );
  };

  const formatAmount = (kobo: number, currency: string) => {
    const naira = kobo / 100;
    return `${currency === 'NGN' ? '₦' : currency + ' '}${naira.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
  };

  const StatusBadge = ({ status }: { status: string }) => {
    if (status === 'success') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-400/10 text-green-400 border border-green-400/20">
          <CheckCircle size={9} /> Success
        </span>
      );
    }
    if (status === 'failed') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-400/10 text-red-400 border border-red-400/20">
          <XCircle size={9} /> Failed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
        <Clock size={9} /> {status}
      </span>
    );
  };

  return (
    <div className="card-base card-gradient-bg">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-bold text-base flex items-center gap-2">
            Paystack Transactions
            {meta && (
              <span className="badge-base status-pending">{meta.total}</span>
            )}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Live transaction log from Paystack — for accounting reconciliation
          </p>
        </div>
        <button
          onClick={() => fetchTransactions(page)}
          disabled={loading}
          className="p-2 rounded-lg bg-muted/40 hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-14">
          <Loader2 size={24} className="animate-spin text-muted-foreground" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-14">
          <p className="text-sm text-muted-foreground">No transactions found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground whitespace-nowrap">Date / Time</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground whitespace-nowrap">Reference</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground whitespace-nowrap">Customer</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground whitespace-nowrap">User ID</th>
                  <th className="text-right px-3 py-2.5 font-semibold text-muted-foreground whitespace-nowrap">Amount</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground whitespace-nowrap">Channel</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground whitespace-nowrap">Status</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground whitespace-nowrap">Gateway Response</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, i) => (
                  <tr
                    key={tx.id}
                    className={`border-b border-border/50 hover:bg-muted/10 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/5'}`}
                  >
                    <td className="px-3 py-2.5 whitespace-nowrap text-muted-foreground">
                      {formatDate(tx.paid_at || tx.created_at)}
                    </td>
                    <td className="px-3 py-2.5">
                      <code className="font-mono text-[10px] bg-muted/40 px-1.5 py-0.5 rounded text-muted-foreground">
                        {tx.reference}
                      </code>
                    </td>
                    <td className="px-3 py-2.5 max-w-[160px] truncate text-foreground">
                      {tx.customer?.email || '—'}
                    </td>
                    <td className="px-3 py-2.5">
                      {tx.metadata?.user_id ? (
                        <code className="font-mono text-[10px] bg-muted/40 px-1.5 py-0.5 rounded text-muted-foreground">
                          {tx.metadata.user_id.slice(0, 8)}…
                        </code>
                      ) : (
                        <span className="text-muted-foreground/50">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-right font-semibold tabular-nums gold-gradient-text whitespace-nowrap">
                      {formatAmount(tx.amount, tx.currency)}
                    </td>
                    <td className="px-3 py-2.5 capitalize text-muted-foreground whitespace-nowrap">
                      {tx.channel || '—'}
                    </td>
                    <td className="px-3 py-2.5">
                      <StatusBadge status={tx.status} />
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground max-w-[140px] truncate">
                      {tx.gateway_response || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.pageCount > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Page {meta.page} of {meta.pageCount} · {meta.total} total transactions
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1 || loading}
                  className="p-1.5 rounded-lg bg-muted/40 hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => setPage(p => Math.min(meta.pageCount, p + 1))}
                  disabled={page >= meta.pageCount || loading}
                  className="p-1.5 rounded-lg bg-muted/40 hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
