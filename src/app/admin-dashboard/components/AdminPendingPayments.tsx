'use client';

import React, {
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  CheckCircle,
  X,
  AlertCircle,
  Loader2,
  RefreshCw,
  ExternalLink,
  FileText,
  Building2,
} from 'lucide-react';
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
  const [payments, setPayments] = useState<
    BankTransferPayment[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<
    string | null
  >(null);

  const [viewingProof, setViewingProof] = useState<
    string | null
  >(null);

  const supabase = createClient();

  const fetchPendingPayments = useCallback(async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('bank_transfer_payments')
        .select(`
          id,
          user_id,
          order_id,
          amount,
          reference,
          proof_url,
          proof_path,
          status,
          admin_note,
          created_at,
          user_profiles (
            full_name,
            email
          )
        `)
        .eq('status', 'pending')
        .order('created_at', {
          ascending: false,
        });

      if (error) {
        throw error;
      }

      setPayments(
        (data as BankTransferPayment[]) || []
      );
    } catch (error: any) {
      console.error(
        'Fetch pending payments error:',
        error
      );

      toast.error(
        error?.message ||
          'Failed to load pending payments'
      );
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchPendingPayments();
  }, [fetchPendingPayments]);

  const viewPaymentProof = async (
    payment: BankTransferPayment
  ) => {
    if (!payment.proof_path) {
      toast.error('No payment proof was uploaded.');
      return;
    }

    try {
      setActionLoading(payment.id + '-proof');

      const { data, error } =
        await supabase.storage
          .from('payment-proofs')
          .createSignedUrl(
            payment.proof_path,
            60 * 10
          );

      if (error || !data?.signedUrl) {
        throw new Error(
          error?.message ||
            'Unable to open payment proof.'
        );
      }

      setViewingProof(data.signedUrl);

      window.open(
        data.signedUrl,
        '_blank',
        'noopener,noreferrer'
      );
    } catch (error: any) {
      toast.error(
        error?.message ||
          'Unable to open payment proof.'
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleApprove = async (
    paymentId: string,
    userName: string,
    amount: number
  ) => {
    const confirmed = window.confirm(
      `Confirm that you have received ₦${amount.toLocaleString(
        'en-NG'
      )} from ${userName}?\n\nOnly approve after checking your Kuda account and confirming that the money was actually received.`
    );

    if (!confirmed) {
      return;
    }

    setActionLoading(
      paymentId + '-approve'
    );

    try {
      const { data, error } =
        await supabase.rpc(
          'approve_bank_transfer',
          {
            payment_id: paymentId,
            admin_note_text:
              'Payment verified and approved',
          }
        );

      if (error) {
        throw error;
      }

      const result = data as {
        success: boolean;
        error?: string;
        new_balance?: number;
      };

      if (!result?.success) {
        throw new Error(
          result?.error ||
            'Approval failed'
        );
      }

      toast.success(
        `₦${amount.toLocaleString(
          'en-NG'
        )} payment from ${userName} approved. Wallet funded successfully.`
      );

      setPayments((previous) =>
        previous.filter(
          (payment) =>
            payment.id !== paymentId
        )
      );
    } catch (error: any) {
      console.error(
        'Approve bank transfer error:',
        error
      );

      toast.error(
        error?.message ||
          'Failed to approve payment'
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (
    paymentId: string,
    userName: string
  ) => {
    const confirmed = window.confirm(
      `Reject the bank transfer from ${userName}?\n\nThe customer's payment will not be credited.`
    );

    if (!confirmed) {
      return;
    }

    setActionLoading(
      paymentId + '-reject'
    );

    try {
      const { data, error } =
        await supabase.rpc(
          'reject_bank_transfer',
          {
            payment_id: paymentId,
            admin_note_text:
              'Payment could not be verified',
          }
        );

      if (error) {
        throw error;
      }

      const result = data as {
        success: boolean;
        error?: string;
      };

      if (!result?.success) {
        throw new Error(
          result?.error ||
            'Rejection failed'
        );
      }

      toast.success(
        `Payment from ${userName} was rejected.`
      );

      setPayments((previous) =>
        previous.filter(
          (payment) =>
            payment.id !== paymentId
        )
      );
    } catch (error: any) {
      console.error(
        'Reject bank transfer error:',
        error
      );

      toast.error(
        error?.message ||
          'Failed to reject payment'
      );
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (
    dateString: string
  ) => {
    const date = new Date(dateString);

    return (
      date.toLocaleDateString('en-NG', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) +
      ' · ' +
      date.toLocaleTimeString('en-NG', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    );
  };

  return (
    <>
      <div className="card-base card-gradient-bg">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-base flex items-center gap-2">
              <Building2
                size={16}
                className="text-primary"
              />

              Pending Bank Transfers

              {!loading && (
                <span className="badge-base status-pending">
                  {payments.length}
                </span>
              )}
            </h2>

            <p className="text-xs text-muted-foreground mt-0.5">
              Verify received payments before approving
            </p>
          </div>

          <button
            type="button"
            onClick={fetchPendingPayments}
            disabled={loading}
            className="p-2 rounded-lg bg-muted/40 hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            title="Refresh pending payments"
          >
            <RefreshCw
              size={14}
              className={
                loading
                  ? 'animate-spin'
                  : ''
              }
            />
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2
              size={24}
              className="animate-spin text-muted-foreground"
            />
          </div>
        ) : payments.length === 0 ? (
          /* Empty state */
          <div className="text-center py-10">
            <CheckCircle
              size={34}
              className="text-green-400 mx-auto mb-3 opacity-70"
            />

            <p className="text-sm font-semibold text-muted-foreground">
              No pending bank transfers
            </p>

            <p className="text-xs text-muted-foreground mt-1">
              New transfers will appear here after customers submit payment proof.
            </p>
          </div>
        ) : (
          /* Payments */
          <div className="space-y-3">
            {payments.map((payment) => {
              const userName =
                payment.user_profiles
                  ?.full_name ||
                'Unknown User';

              const userEmail =
                payment.user_profiles
                  ?.email || '';

              const approving =
                actionLoading ===
                payment.id +
                  '-approve';

              const rejecting =
                actionLoading ===
                payment.id +
                  '-reject';

              const openingProof =
                actionLoading ===
                payment.id +
                  '-proof';

              const acting =
                approving ||
                rejecting ||
                openingProof;

              return (
                <div
                  key={payment.id}
                  className="p-4 rounded-xl bg-muted/20 border border-border hover:border-primary/20 transition-all"
                >
                  {/* Customer + amount */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">
                        {userName}
                      </p>

                      {userEmail && (
                        <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                          {userEmail}
                        </p>
                      )}
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="font-extrabold text-base gold-gradient-text tabular-nums">
                        ₦
                        {payment.amount.toLocaleString(
                          'en-NG'
                        )}
                      </p>

                      <span className="text-[10px] text-yellow-400">
                        Bank Transfer
                      </span>
                    </div>
                  </div>

                  {/* Reference */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] text-muted-foreground">
                        Reference
                      </span>

                      <code className="text-[10px] font-mono bg-muted/40 px-2 py-1 rounded max-w-[180px] truncate">
                        {payment.reference ||
                          'No reference'}
                      </code>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] text-muted-foreground">
                        Submitted
                      </span>

                      <span className="text-[10px] text-muted-foreground">
                        {formatDate(
                          payment.created_at
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] text-muted-foreground">
                        Payment proof
                      </span>

                      {payment.proof_path ? (
                        <span className="flex items-center gap-1 text-[10px] text-green-400">
                          <CheckCircle
                            size={10}
                          />
                          Uploaded
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] text-red-400">
                          <AlertCircle
                            size={10}
                          />
                          Missing
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Warning */}
                  <div className="flex items-start gap-2 p-2.5 mb-3 rounded-lg bg-yellow-400/5 border border-yellow-400/20">
                    <AlertCircle
                      size={13}
                      className="text-yellow-400 flex-shrink-0 mt-0.5"
                    />

                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      <strong className="text-yellow-400">
                        Verify first:
                      </strong>{' '}
                      Check your Kuda account and confirm the exact amount was received before approving.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleApprove(
                          payment.id,
                          userName,
                          payment.amount
                        )
                      }
                      disabled={acting}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-green-400/10 hover:bg-green-400/20 text-green-400 text-xs font-semibold transition-colors border border-green-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {approving ? (
                        <Loader2
                          size={12}
                          className="animate-spin"
                        />
                      ) : (
                        <CheckCircle size={12} />
                      )}

                      Approve
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleReject(
                          payment.id,
                          userName
                        )
                      }
                      disabled={acting}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-red-400/10 hover:bg-red-400/20 text-red-400 text-xs font-semibold transition-colors border border-red-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {rejecting ? (
                        <Loader2
                          size={12}
                          className="animate-spin"
                        />
                      ) : (
                        <X size={12} />
                      )}

                      Reject
                    </button>

                    {payment.proof_path ? (
                      <button
                        type="button"
                        onClick={() =>
                          viewPaymentProof(
                            payment
                          )
                        }
                        disabled={acting}
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-muted/40 hover:bg-muted/60 text-muted-foreground hover:text-foreground text-xs font-semibold transition-colors border border-border disabled:opacity-50"
                      >
                        {openingProof ? (
                          <Loader2
                            size={12}
                            className="animate-spin"
                          />
                        ) : (
                          <ExternalLink
                            size={12}
                          />
                        )}

                        Receipt
                      </button>
                    ) : (
                      <div className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-muted/20 text-muted-foreground text-xs border border-border">
                        <FileText
                          size={12}
                        />
                        No Proof
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Proof viewer fallback */}
      {viewingProof && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() =>
            setViewingProof(null)
          }
        >
          <div
            className="max-w-4xl max-h-[90vh] w-full bg-background rounded-2xl overflow-hidden"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex items-center justify-between p-3 border-b border-border">
              <p className="text-sm font-semibold">
                Payment Proof
              </p>

              <button
                type="button"
                onClick={() =>
                  setViewingProof(null)
                }
                className="p-2 rounded-lg hover:bg-muted/50"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 text-center">
              <a
                href={viewingProof}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 btn-primary px-4 py-2 rounded-lg text-sm font-semibold"
              >
                <ExternalLink
                  size={14}
                />
                Open Payment Proof
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}