'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  RefreshCw,
  Loader2,
  Scale,
  Building2,
  ShieldAlert,
  ClipboardList,
  Wrench,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

interface UnmatchedTransfer {
  id: string;
  user_id: string;
  amount: number;
  reference: string;
  status: string;
  admin_note: string | null;
  proof_path: string | null;
  created_at: string;
  user_profiles: { full_name: string; email: string } | null;
}

interface FailedVerification {
  id: string;
  event_type: string;
  reference: string | null;
  email: string | null;
  amount_kobo: number | null;
  status: string;
  error_message: string | null;
  created_at: string;
}

interface AuditEntry {
  id: string;
  admin_email: string | null;
  user_email: string;
  amount: number;
  reference: string;
  credit_source: string;
  reason: string;
  outcome: string;
  created_at: string;
}

type TabKey = 'transfers' | 'failed' | 'audit';

interface CreditForm {
  email: string;
  amount: string;
  reference: string;
  reason: string;
  source: string;
}

const EMPTY_FORM: CreditForm = { email: '', amount: '', reference: '', reason: '', source: 'manual' };

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return (
    d.toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' '+ d.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', hour12: false })
  );
};

const formatNaira = (n: number) =>
  `₦${Number(n).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;

function Pill({ label, tone }: { label: string; tone: 'green' | 'red' | 'yellow' | 'blue' }) {
  const map = {
    green: 'bg-green-400/10 text-green-400 border-green-400/20',
    red: 'bg-red-400/10 text-red-400 border-red-400/20',
    yellow: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
    blue: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${map[tone]}`}>
      {label}
    </span>
  );
}

const TH = 'text-left px-3 py-2.5 font-semibold text-muted-foreground whitespace-nowrap';

export default function AdminDisputeResolution() {
  const [tab, setTab] = useState<TabKey>('transfers');
  const [loading, setLoading] = useState(true);
  const [transfers, setTransfers] = useState<UnmatchedTransfer[]>([]);
  const [failed, setFailed] = useState<FailedVerification[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreditForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/dispute-resolution', { cache: 'no-store' });
      const data = await res.json();
      if (!data?.success) {
        throw new Error(data?.error || 'Failed to load dispute data');
      }
      setTransfers(data?.unmatchedTransfers || []);
      setFailed(data?.failedVerifications || []);
      setAudit(data?.auditLog || []);
    } catch (err: any) {
      console.error('Dispute resolution fetch error:', err);
      toast.error(err?.message || 'Failed to load dispute data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openForm = (prefill?: Partial<CreditForm>) => {
    setForm({ ...EMPTY_FORM, ...prefill });
    setShowForm(true);
  };

  const submitCredit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!form.email.trim() || !form.reference.trim() || !form.reason.trim() || !Number.isFinite(amount) || amount <= 0) {
      toast.error('Email, amount, reference and reason are all required');
      return;
    }
    setSubmitting(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc('admin_manual_credit_wallet', {
        p_user_email: form.email.trim(),
        p_amount: amount,
        p_reference: form.reference.trim(),
        p_reason: form.reason.trim(),
        p_credit_source: form.source,
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Credit failed');
      toast.success(data?.message || 'Wallet credited');
      setShowForm(false);
      setForm(EMPTY_FORM);
      await fetchData();
      setTab('audit');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to credit wallet');
    } finally {
      setSubmitting(false);
    }
  };

  const tabs: { key: TabKey; label: string; icon: React.ReactNode; count: number }[] = [
    { key: 'transfers', label: 'Unmatched Transfers', icon: <Building2 size={13} />, count: transfers.length },
    { key: 'failed', label: 'Failed Verifications', icon: <ShieldAlert size={13} />, count: failed.length },
    { key: 'audit', label: 'Manual Credit Audit Log', icon: <ClipboardList size={13} />, count: audit.length },
  ];

  return (
    <div className="card-base card-gradient-bg">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="font-bold text-base flex items-center gap-2">
            <Scale size={16} className="text-muted-foreground" />
            Dispute Resolution
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Unmatched bank transfers, failed Paystack verifications and an audit trail of every manual credit
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => openForm()}
            className="text-xs px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-semibold transition-colors flex items-center gap-1.5"
          >
            <Wrench size={13} /> Manual Credit
          </button>
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 rounded-lg bg-muted/40 hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="flex gap-1.5 mb-4 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              tab === t.key
                ? 'bg-primary/10 text-primary border-primary/30' :'bg-muted/30 text-muted-foreground border-border hover:text-foreground'
            }`}
          >
            {t.icon}
            {t.label}
            <span className="badge-base status-pending">{t.count}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-14">
          <Loader2 size={24} className="animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          {tab === 'transfers' && (
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className={TH}>Date</th>
                  <th className={TH}>Customer</th>
                  <th className={TH}>Reference</th>
                  <th className={`${TH} text-right`}>Amount</th>
                  <th className={TH}>Status</th>
                  <th className={TH}>Admin Note</th>
                  <th className={TH}>Action</th>
                </tr>
              </thead>
              <tbody>
                {transfers?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-muted-foreground">
                      No unmatched bank transfers
                    </td>
                  </tr>
                ) : (
                  transfers?.map((t) => (
                    <tr key={t.id} className="border-b border-border/50 hover:bg-muted/10">
                      <td className="px-3 py-2.5 whitespace-nowrap text-muted-foreground">{formatDate(t.created_at)}</td>
                      <td className="px-3 py-2.5">
                        <div className="font-medium text-foreground">{t?.user_profiles?.full_name || '—'}</div>
                        <div className="text-[10px] text-muted-foreground">{t?.user_profiles?.email || '—'}</div>
                      </td>
                      <td className="px-3 py-2.5">
                        <code className="font-mono text-[10px] bg-muted/40 px-1.5 py-0.5 rounded text-muted-foreground">
                          {t.reference || '—'}
                        </code>
                      </td>
                      <td className="px-3 py-2.5 text-right font-semibold tabular-nums gold-gradient-text whitespace-nowrap">
                        {formatNaira(t.amount)}
                      </td>
                      <td className="px-3 py-2.5">
                        <Pill label={t.status === 'pending' ? 'Pending' : 'Rejected'} tone={t.status === 'pending' ? 'yellow' : 'red'} />
                      </td>
                      <td className="px-3 py-2.5 max-w-[180px] truncate text-muted-foreground text-[10px]">
                        {t.admin_note || '—'}
                      </td>
                      <td className="px-3 py-2.5">
                        <button
                          onClick={() =>
                            openForm({
                              email: t?.user_profiles?.email || '',
                              amount: String(t.amount),
                              reference: `MANUAL-BANK-${t.reference || t.id.slice(0, 8)}`,
                              source: 'bank_transfer',
                              reason: `Dispute: bank transfer ${t.reference || t.id} verified manually`,
                            })
                          }
                          className="text-[10px] px-2 py-1 rounded-md bg-primary/10 hover:bg-primary/20 text-primary font-semibold whitespace-nowrap"
                        >
                          Credit manually
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {tab === 'failed' && (
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className={TH}>Timestamp</th>
                  <th className={TH}>Event</th>
                  <th className={TH}>Reference</th>
                  <th className={TH}>Email</th>
                  <th className={`${TH} text-right`}>Amount</th>
                  <th className={TH}>Status</th>
                  <th className={TH}>Error</th>
                  <th className={TH}>Action</th>
                </tr>
              </thead>
              <tbody>
                {failed?.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-muted-foreground">
                      No failed Paystack verifications
                    </td>
                  </tr>
                ) : (
                  failed?.map((f) => (
                    <tr key={f.id} className="border-b border-border/50 hover:bg-muted/10">
                      <td className="px-3 py-2.5 whitespace-nowrap text-muted-foreground">{formatDate(f.created_at)}</td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <Pill label={f.event_type} tone="blue" />
                      </td>
                      <td className="px-3 py-2.5">
                        {f.reference ? (
                          <code className="font-mono text-[10px] bg-muted/40 px-1.5 py-0.5 rounded text-muted-foreground">
                            {f.reference}
                          </code>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-3 py-2.5 max-w-[180px] truncate text-foreground">{f.email || '—'}</td>
                      <td className="px-3 py-2.5 text-right font-semibold tabular-nums gold-gradient-text whitespace-nowrap">
                        {f.amount_kobo === null ? '—' : formatNaira(f.amount_kobo / 100)}
                      </td>
                      <td className="px-3 py-2.5">
                        <Pill label={f.status === 'failed' ? 'Failed' : 'Skipped'} tone={f.status === 'failed' ? 'red' : 'yellow'} />
                      </td>
                      <td className="px-3 py-2.5 max-w-[220px] truncate text-muted-foreground text-[10px]" title={f.error_message || ''}>
                        {f.error_message || '—'}
                      </td>
                      <td className="px-3 py-2.5">
                        {f.reference && f.email && f.amount_kobo !== null ? (
                          <button
                            onClick={() =>
                              openForm({
                                email: f.email || '',
                                amount: String((f.amount_kobo || 0) / 100),
                                reference: f.reference || '',
                                source: 'paystack',
                                reason: `Dispute: Paystack ${f.event_type} ${f.status} - reconciled manually`,
                              })
                            }
                            className="text-[10px] px-2 py-1 rounded-md bg-primary/10 hover:bg-primary/20 text-primary font-semibold whitespace-nowrap"
                          >
                            Reconcile
                          </button>
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {tab === 'audit' && (
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className={TH}>Date</th>
                  <th className={TH}>Admin</th>
                  <th className={TH}>Customer</th>
                  <th className={`${TH} text-right`}>Amount</th>
                  <th className={TH}>Reference</th>
                  <th className={TH}>Source</th>
                  <th className={TH}>Outcome</th>
                  <th className={TH}>Reason</th>
                </tr>
              </thead>
              <tbody>
                {audit?.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-muted-foreground">
                      No manual credits recorded yet
                    </td>
                  </tr>
                ) : (
                  audit?.map((a) => (
                    <tr key={a.id} className="border-b border-border/50 hover:bg-muted/10">
                      <td className="px-3 py-2.5 whitespace-nowrap text-muted-foreground">{formatDate(a.created_at)}</td>
                      <td className="px-3 py-2.5 max-w-[160px] truncate">{a.admin_email || 'system'}</td>
                      <td className="px-3 py-2.5 max-w-[180px] truncate text-foreground">{a.user_email}</td>
                      <td className="px-3 py-2.5 text-right font-semibold tabular-nums gold-gradient-text whitespace-nowrap">
                        {formatNaira(a.amount)}
                      </td>
                      <td className="px-3 py-2.5">
                        <code className="font-mono text-[10px] bg-muted/40 px-1.5 py-0.5 rounded text-muted-foreground">
                          {a.reference}
                        </code>
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap text-muted-foreground">{a.credit_source}</td>
                      <td className="px-3 py-2.5">
                        <Pill
                          label={a.outcome === 'credited' ? 'Credited' : 'Duplicate skipped'}
                          tone={a.outcome === 'credited' ? 'green' : 'yellow'}
                        />
                      </td>
                      <td className="px-3 py-2.5 max-w-[260px] truncate text-muted-foreground" title={a.reason}>
                        {a.reason}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form
            onSubmit={submitCredit}
            className="w-full max-w-md card-base bg-card border border-border rounded-2xl p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm">Manual Wallet Credit</h3>
              <button type="button" onClick={() => setShowForm(false)} className="p-1 rounded-md hover:bg-muted/40">
                <X size={14} />
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Credits are idempotent on reference and permanently recorded in the audit log.
            </p>

            <input
              type="email"
              placeholder="Customer email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full text-xs bg-muted/40 border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/50"
              required
            />
            <input
              type="number"
              min="1"
              step="0.01"
              placeholder="Amount (₦)"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full text-xs bg-muted/40 border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/50"
              required
            />
            <input
              type="text"
              placeholder="Unique reference"
              value={form.reference}
              onChange={(e) => setForm({ ...form, reference: e.target.value })}
              className="w-full text-xs bg-muted/40 border border-border rounded-lg px-3 py-2 font-mono focus:outline-none focus:ring-1 focus:ring-primary/50"
              required
            />
            <select
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              className="w-full text-xs bg-muted/40 border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              <option value="manual">Manual</option>
              <option value="bank_transfer">Bank transfer</option>
              <option value="paystack">Paystack</option>
            </select>
            <textarea
              placeholder="Reason for dispute resolution (required)"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              rows={3}
              className="w-full text-xs bg-muted/40 border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/50"
              required
            />

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-xs px-3 py-2 rounded-lg bg-muted/40 hover:bg-muted/60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="text-xs px-3 py-2 rounded-lg bg-primary text-primary-foreground font-semibold disabled:opacity-50 flex items-center gap-1.5"
              >
                {submitting && <Loader2 size={12} className="animate-spin" />}
                Credit &amp; Log
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
