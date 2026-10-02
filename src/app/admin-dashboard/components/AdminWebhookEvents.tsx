'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Webhook,
  AlertTriangle,
} from 'lucide-react';

interface WebhookEvent {
  id: string;
  event_type: string;
  reference: string | null;
  email: string | null;
  amount_kobo: number | null;
  status: string;
  error_message: string | null;
  created_at: string;
}

interface Meta {
  total: number;
  page: number;
  pageCount: number;
  perPage: number;
}

const EVENT_TYPE_FILTERS = [
  { label: 'All Events', value: '' },
  { label: 'charge.success', value: 'charge.success' },
  { label: 'transfer.success', value: 'transfer.success' },
  { label: 'transfer.failed', value: 'transfer.failed' },
];

function StatusBadge({ status }: { status: string }) {
  if (status === 'processed') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-400/10 text-green-400 border border-green-400/20">
        <CheckCircle size={9} /> Processed
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
  if (status === 'skipped') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
        <AlertTriangle size={9} /> Skipped
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-400/10 text-blue-400 border border-blue-400/20">
      <Clock size={9} /> {status}
    </span>
  );
}

function EventTypeBadge({ eventType }: { eventType: string }) {
  const colorMap: Record<string, string> = {
    'charge.success': 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
    'transfer.success': 'bg-blue-400/10 text-blue-400 border-blue-400/20',
    'transfer.failed': 'bg-red-400/10 text-red-400 border-red-400/20',
  };
  const cls = colorMap[eventType] || 'bg-muted/40 text-muted-foreground border-border';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cls}`}>
      {eventType}
    </span>
  );
}

export default function AdminWebhookEvents() {
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [eventTypeFilter, setEventTypeFilter] = useState('');

  const fetchEvents = useCallback(async (p: number, filter: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p) });
      if (filter) params.set('event_type', filter);
      const res = await fetch(`/api/admin/webhook-events?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setEvents(data.events);
        setMeta(data.meta);
      }
    } catch (err) {
      console.error('Failed to fetch webhook events:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents(page, eventTypeFilter);
  }, [fetchEvents, page, eventTypeFilter]);

  const handleFilterChange = (value: string) => {
    setEventTypeFilter(value);
    setPage(1);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return (
      d.toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ' '+ d.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    );
  };

  const formatAmount = (kobo: number | null) => {
    if (kobo === null) return '—';
    return `₦${(kobo / 100).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="card-base card-gradient-bg">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="font-bold text-base flex items-center gap-2">
            <Webhook size={16} className="text-muted-foreground" />
            Paystack Webhook Events
            {meta && (
              <span className="badge-base status-pending">{meta.total}</span>
            )}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            All incoming webhook events — charge.success, verification attempts, failed reconciliations
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Event type filter */}
          <select
            value={eventTypeFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="text-xs bg-muted/40 border border-border rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          >
            {EVENT_TYPE_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => fetchEvents(page, eventTypeFilter)}
            disabled={loading}
            className="p-2 rounded-lg bg-muted/40 hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-14">
          <Loader2 size={24} className="animate-spin text-muted-foreground" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-14">
          <Webhook size={32} className="mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No webhook events found</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Events will appear here once Paystack sends webhooks
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground whitespace-nowrap">
                    Timestamp
                  </th>
                  <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground whitespace-nowrap">
                    Event Type
                  </th>
                  <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground whitespace-nowrap">
                    Reference
                  </th>
                  <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground whitespace-nowrap">
                    Customer Email
                  </th>
                  <th className="text-right px-3 py-2.5 font-semibold text-muted-foreground whitespace-nowrap">
                    Amount
                  </th>
                  <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground whitespace-nowrap">
                    Status
                  </th>
                  <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground whitespace-nowrap">
                    Error / Note
                  </th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev, i) => (
                  <tr
                    key={ev.id}
                    className={`border-b border-border/50 hover:bg-muted/10 transition-colors ${
                      i % 2 === 0 ? '' : 'bg-muted/5'
                    }`}
                  >
                    <td className="px-3 py-2.5 whitespace-nowrap text-muted-foreground">
                      {formatDate(ev.created_at)}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <EventTypeBadge eventType={ev.event_type} />
                    </td>
                    <td className="px-3 py-2.5">
                      {ev.reference ? (
                        <code className="font-mono text-[10px] bg-muted/40 px-1.5 py-0.5 rounded text-muted-foreground">
                          {ev.reference}
                        </code>
                      ) : (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 max-w-[180px] truncate text-foreground">
                      {ev.email || <span className="text-muted-foreground/40">—</span>}
                    </td>
                    <td className="px-3 py-2.5 text-right font-semibold tabular-nums gold-gradient-text whitespace-nowrap">
                      {formatAmount(ev.amount_kobo)}
                    </td>
                    <td className="px-3 py-2.5">
                      <StatusBadge status={ev.status} />
                    </td>
                    <td className="px-3 py-2.5 max-w-[200px] truncate text-muted-foreground text-[10px]">
                      {ev.error_message || (
                        <span className="text-muted-foreground/30">—</span>
                      )}
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
                Page {meta.page} of {meta.pageCount} · {meta.total} total events
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || loading}
                  className="p-1.5 rounded-lg bg-muted/40 hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(meta.pageCount, p + 1))}
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
