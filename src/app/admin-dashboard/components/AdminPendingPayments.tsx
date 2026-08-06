'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, X, AlertCircle, Loader2, RefreshCw, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

interface BankTransferPayment {
  id: string;
  user_id: string;
  order_id: string | null;
  amount: number;
  reference: string;
  proof_url: string;
  proof_path: string;
  status: string;
  admin_note: string;
  created_at: string;
  user_profiles: {
    full_name: string;
    email: string;
  } | null;
}

export default function AdminPendingPayments() {
  const [payments, setPayments] = useState<BankTransferPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [viewingProof, setViewingProof] = useState<string | null>(null);
  const supabase = createClient();

  const fetchPendingPayments = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bank_transfer_payments')
        .select(`
          id, user_id, order_id, amount, reference, proof_url, proof_path,
          status, admin_note, created_at,
          user_profiles (full_name, email)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments((data as BankTransferPayment[]) || []);
    } catch (err: any) {
      console.log('Fetch pending payments error:', err?.message);
      toast.error('Failed to load pending payments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingPayments();
  }, [fetchPendingPayments]);

  const handleApprove = async (paymentId: string, userName: string, amount: number) => {
    setActionLoading(paymentId + '-approve');
    try {
      const { data, error } = await supabase.rpc('approve_bank_transfer', {
        payment_id: paymentId,
        admin_note_text: 'Payment verified and approved',
      });

      if (error) throw error;
      const result = data as { success: boolean; error?: string };
      if (!result.success) throw new Error(result.error || 'Approval failed');

      toast.success(`₦${amount.toLocaleString('en-NG')} payment from ${userName} approved. Wallet funded.`);
      setPayments(prev => prev.filter(p => p.id !== paymentId));
    } catch (err: any) {
      toast.error(err?.message || 'Failed to approve payment');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (paymentId: string, userName: string) => {
    setActionLoading(paymentId + '-reject');
    try {
      const { data, error } = await supabase.rpc('reject_bank_transfer', {
        payment_id: paymentId,
        admin_note_text: 'Payment could not be verified',
      });

      if (error) throw error;
      const result = data as { success: boolean; error?: string };
      if (!result.success) throw new Error(result.error || 'Rejection failed');

      toast.error(`Payment from ${userName} rejected`);
      setPayments(prev => prev.filter(p => p.id !== paymentId));
    } catch (err: any) {
      toast.error(err?.message || 'Failed to reject payment');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-NG', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
      ' ' + d.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <div className="card-base card-gradient-bg">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-bold text-base flex items-center gap-2">
            Pending Bank Transfers
            {!loading && (
              <span className="badge-base status-pending">{payments.length}</span>
            )}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Awaiting manual payment verification</p>
        </div>
        <button
          onClick={fetchPendingPayments}
          disabled={loading}
          className="p-2 rounded-lg bg-muted/40 hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 size={24} className="animate-spin text-muted-foreground" />
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center py-10">
          <CheckCircle size={32} className="text-green-400 mx-auto mb-3 opacity-60" />
          <p className="text-sm font-semibold text-muted-foreground">No pending payments</p>
          <p className="text-xs text-muted-foreground mt-1">All bank transfers have been reviewed</p>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((pay) => {
            const userName = pay.user_profiles?.full_name || 'Unknown User';
            const userEmail = pay.user_profiles?.email || '';
            const isApprovingThis = actionLoading === pay.id + '-approve';
            const isRejectingThis = actionLoading === pay.id + '-reject';
            const isActing = isApprovingThis || isRejectingThis;

            return (
              <div key={pay.id} className="p-3.5 rounded-xl bg-muted/20 border border-border hover:border-primary/20 transition-all">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{userName}</p>
                    <p className="text-[10px] text-muted-foreground">{userEmail}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-extrabold text-sm gold-gradient-text tabular-nums">₦{pay.amount.toLocaleString('en-NG')}</p>
                    <span className="text-[10px] text-muted-foreground">🏦 Bank Transfer</span>
                  </div>
                </div>

                {/* Reference */}
                <div className="flex items-center justify-between mb-2">
                  <code className="text-[10px] font-mono text-muted-foreground bg-muted/40 px-2 py-0.5 rounded truncate max-w-[160px]">
                    {pay.reference || 'No reference'}
                  </code>
                  <div className="flex items-center gap-1">
                    {pay.proof_url ? (
                      <span className="flex items-center gap-1 text-[10px] text-green-400">
                        <CheckCircle size={10} />
                        Proof uploaded
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] text-yellow-400">
                        <AlertCircle size={10} />
                        No proof
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-[10px] text-muted-foreground mb-3">{formatDate(pay.created_at)}</p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(pay.id, userName, pay.amount)}
                    disabled={isActing}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-green-400/10 hover:bg-green-400/20 text-green-400 text-xs font-semibold transition-colors border border-green-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isApprovingThis ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(pay.id, userName)}
                    disabled={isActing}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-400/10 hover:bg-red-400/20 text-red-400 text-xs font-semibold transition-colors border border-red-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRejectingThis ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
                    Reject
                  </button>
                  {pay.proof_url && (
                    <a
                      href={pay.proof_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-muted/40 hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
                      title="View payment proof"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}