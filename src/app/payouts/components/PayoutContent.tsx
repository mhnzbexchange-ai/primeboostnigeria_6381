'use client';

import React, { useState, useEffect } from 'react';
import {
  Wallet,
  Plus,
  Building2,
  CheckCircle,
  Clock,
  XCircle,
  ChevronDown,
  AlertCircle,
  ArrowDownToLine,
  Trash2,
  Star,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const MINIMUM_PAYOUT = 2000;

const NIGERIAN_BANKS = [
  'Access Bank',
  'Citibank Nigeria',
  'Ecobank Nigeria',
  'Fidelity Bank',
  'First Bank of Nigeria',
  'First City Monument Bank (FCMB)',
  'Guaranty Trust Bank',
  'Heritage Bank',
  'Keystone Bank',
  'Polaris Bank',
  'Providus Bank',
  'Stanbic IBTC Bank',
  'Standard Chartered Bank',
  'Sterling Bank',
  'SunTrust Bank',
  'Union Bank of Nigeria',
  'United Bank for Africa (UBA)',
  'Unity Bank',
  'Wema Bank',
  'Zenith Bank',
  'Kuda Bank',
  'Opay',
  'Palmpay',
  'Moniepoint',
];

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
}

interface PayoutRequest {
  id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed';
  bankName: string;
  accountNumber: string;
  note: string;
  createdAt: string;
  processedAt: string | null;
}

const statusConfig: Record<PayoutRequest['status'], { label: string; className: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', className: 'status-pending', icon: <Clock size={11} /> },
  approved: { label: 'Approved', className: 'status-active', icon: <CheckCircle size={11} /> },
  processing: { label: 'Processing', className: 'status-active', icon: <Loader2 size={11} /> },
  completed: { label: 'Completed', className: 'status-completed', icon: <CheckCircle size={11} /> },
  rejected: { label: 'Rejected', className: 'status-failed', icon: <XCircle size={11} /> },
};

export default function PayoutContent() {
  const { user } = useAuth();
  const supabase = createClient();

  const [referralBalance, setReferralBalance] = useState(0);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [payoutHistory, setPayoutHistory] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Payout form state
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [payoutAmount, setPayoutAmount] = useState('');
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  // Add bank account form state
  const [showAddBank, setShowAddBank] = useState(false);
  const [newBank, setNewBank] = useState({ bankName: '', accountNumber: '', accountName: '' });
  const [addingBank, setAddingBank] = useState(false);
  const [bankError, setBankError] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    fetchData();
  }, [user?.id]);

  const fetchData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [walletRes, accountsRes, payoutsRes] = await Promise.all([
        supabase.from('wallets').select('referral_earnings').eq('user_id', user.id).maybeSingle(),
        supabase.from('bank_accounts').select('*').eq('user_id', user.id).order('is_default', { ascending: false }),
        supabase
          .from('payout_requests')
          .select('id, amount, status, note, created_at, processed_at, bank_accounts(bank_name, account_number)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20),
      ]);

      setReferralBalance(Number(walletRes.data?.referral_earnings || 0));

      const accounts: BankAccount[] = (accountsRes.data || []).map((a: any) => ({
        id: a.id,
        bankName: a.bank_name,
        accountNumber: a.account_number,
        accountName: a.account_name,
        isDefault: a.is_default,
      }));
      setBankAccounts(accounts);

      if (accounts.length > 0 && !selectedAccountId) {
        const def = accounts.find((a) => a.isDefault) || accounts[0];
        setSelectedAccountId(def.id);
      }

      const history: PayoutRequest[] = (payoutsRes.data || []).map((p: any) => {
        const d = new Date(p.created_at);
        return {
          id: p.id,
          amount: Number(p.amount),
          status: p.status as PayoutRequest['status'],
          bankName: p.bank_accounts?.bank_name || '—',
          accountNumber: p.bank_accounts?.account_number || '—',
          note: p.note || '',
          createdAt: `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`,
          processedAt: p.processed_at
            ? (() => {
                const pd = new Date(p.processed_at);
                return `${pd.getDate().toString().padStart(2, '0')}/${(pd.getMonth() + 1).toString().padStart(2, '0')}/${pd.getFullYear()}`;
              })()
            : null,
        };
      });
      setPayoutHistory(history);
    } catch (err: any) {
      console.error('Payout fetch error:', err?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayout = async () => {
    setError('');
    setSuccessMsg('');
    const amount = parseFloat(payoutAmount);

    if (!selectedAccountId) {
      setError('Please select a bank account.');
      return;
    }
    if (!payoutAmount || isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (amount < MINIMUM_PAYOUT) {
      setError(`Minimum payout amount is ₦${MINIMUM_PAYOUT.toLocaleString('en-NG')}.`);
      return;
    }
    if (amount > referralBalance) {
      setError('Amount exceeds your available referral earnings balance.');
      return;
    }

    // Check for pending payout
    const hasPending = payoutHistory.some((p) => p.status === 'pending' || p.status === 'processing');
    if (hasPending) {
      setError('You already have a pending payout request. Please wait for it to be processed.');
      return;
    }

    setSubmitting(true);
    try {
      const { error: insertErr } = await supabase.from('payout_requests').insert({
        user_id: user!.id,
        bank_account_id: selectedAccountId,
        amount,
        status: 'pending',
      });

      if (insertErr) throw insertErr;

      setSuccessMsg(`Payout request of ₦${amount.toLocaleString('en-NG')} submitted successfully! We will process it within 1–3 business days.`);
      setPayoutAmount('');
      await fetchData();
    } catch (err: any) {
      setError(err?.message || 'Failed to submit payout request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddBank = async () => {
    setBankError('');
    if (!newBank.bankName) { setBankError('Please select a bank.'); return; }
    if (!newBank.accountNumber || newBank.accountNumber.length !== 10) { setBankError('Account number must be 10 digits.'); return; }
    if (!newBank.accountName.trim()) { setBankError('Please enter the account name.'); return; }

    setAddingBank(true);
    try {
      const isFirst = bankAccounts.length === 0;
      const { error: insertErr } = await supabase.from('bank_accounts').insert({
        user_id: user!.id,
        bank_name: newBank.bankName,
        account_number: newBank.accountNumber,
        account_name: newBank.accountName.trim(),
        is_default: isFirst,
      });
      if (insertErr) throw insertErr;
      setNewBank({ bankName: '', accountNumber: '', accountName: '' });
      setShowAddBank(false);
      await fetchData();
    } catch (err: any) {
      setBankError(err?.message || 'Failed to add bank account.');
    } finally {
      setAddingBank(false);
    }
  };

  const handleSetDefault = async (accountId: string) => {
    try {
      await supabase.from('bank_accounts').update({ is_default: false }).eq('user_id', user!.id);
      await supabase.from('bank_accounts').update({ is_default: true }).eq('id', accountId);
      await fetchData();
    } catch (err: any) {
      console.error('Set default error:', err?.message);
    }
  };

  const handleDeleteBank = async (accountId: string) => {
    try {
      await supabase.from('bank_accounts').delete().eq('id', accountId);
      if (selectedAccountId === accountId) setSelectedAccountId('');
      await fetchData();
    } catch (err: any) {
      console.error('Delete bank error:', err?.message);
    }
  };

  const selectedAccount = bankAccounts.find((a) => a.id === selectedAccountId);
  const amountNum = parseFloat(payoutAmount) || 0;
  const belowMinimum = referralBalance < MINIMUM_PAYOUT;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payout Requests</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Withdraw your referral earnings to your bank account.</p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground"
          title="Refresh"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Balance + Payout Form */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Balance Card */}
        <div className="lg:col-span-2 card-base card-gradient-bg flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Wallet size={18} className="text-primary" />
            <h2 className="font-bold text-base">Referral Earnings</h2>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Available Balance</p>
            <div className="text-3xl font-extrabold tabular-nums gold-gradient-text">
              {loading ? '—' : `₦${referralBalance.toLocaleString('en-NG')}`}
            </div>
          </div>

          {belowMinimum && !loading && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <AlertCircle size={15} className="text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-300">
                Minimum payout is <span className="font-bold">₦{MINIMUM_PAYOUT.toLocaleString('en-NG')}</span>. Keep earning to unlock withdrawals.
              </p>
            </div>
          )}

          <div className="pt-2 border-t border-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Minimum payout</span>
              <span className="font-semibold">₦{MINIMUM_PAYOUT.toLocaleString('en-NG')}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Processing time</span>
              <span className="font-semibold">1–3 business days</span>
            </div>
          </div>
        </div>

        {/* Payout Form */}
        <div className="lg:col-span-3 card-base card-gradient-bg space-y-5">
          <div className="flex items-center gap-2">
            <ArrowDownToLine size={18} className="text-primary" />
            <h2 className="font-bold text-base">Request Payout</h2>
          </div>

          {/* Success message */}
          {successMsg && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
              <CheckCircle size={15} className="text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-green-300">{successMsg}</p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          {/* Bank Account Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Bank Account</label>
            {bankAccounts.length === 0 ? (
              <div className="p-3 rounded-xl border border-dashed border-border text-center">
                <p className="text-xs text-muted-foreground">No bank accounts added yet.</p>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-muted/30 border border-border hover:border-primary/40 transition-colors text-sm"
                >
                  {selectedAccount ? (
                    <div className="flex items-center gap-3 min-w-0">
                      <Building2 size={15} className="text-primary flex-shrink-0" />
                      <div className="text-left min-w-0">
                        <p className="font-semibold truncate">{selectedAccount.bankName}</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedAccount.accountNumber} · {selectedAccount.accountName}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Select bank account</span>
                  )}
                  <ChevronDown size={15} className={`text-muted-foreground flex-shrink-0 transition-transform ${accountDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {accountDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 z-10 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                    {bankAccounts.map((acc) => (
                      <button
                        key={acc.id}
                        onClick={() => { setSelectedAccountId(acc.id); setAccountDropdownOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors ${selectedAccountId === acc.id ? 'bg-primary/10' : ''}`}
                      >
                        <Building2 size={14} className="text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{acc.bankName}</p>
                          <p className="text-xs text-muted-foreground">{acc.accountNumber} · {acc.accountName}</p>
                        </div>
                        {acc.isDefault && (
                          <span className="badge-base status-completed text-[10px]">Default</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Amount (₦)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">₦</span>
              <input
                type="number"
                value={payoutAmount}
                onChange={(e) => { setPayoutAmount(e.target.value); setError(''); setSuccessMsg(''); }}
                placeholder={`Min. ₦${MINIMUM_PAYOUT.toLocaleString('en-NG')}`}
                min={MINIMUM_PAYOUT}
                max={referralBalance}
                className="w-full pl-8 pr-4 py-3 rounded-xl bg-muted/30 border border-border focus:border-primary/60 focus:outline-none text-sm transition-colors"
              />
            </div>
            {amountNum > 0 && amountNum < MINIMUM_PAYOUT && (
              <p className="text-xs text-red-400">Minimum payout is ₦{MINIMUM_PAYOUT.toLocaleString('en-NG')}</p>
            )}
            {amountNum > referralBalance && referralBalance > 0 && (
              <p className="text-xs text-red-400">Amount exceeds available balance</p>
            )}
          </div>

          <button
            onClick={handleRequestPayout}
            disabled={submitting || belowMinimum || loading}
            className="w-full btn-primary py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <><Loader2 size={15} className="animate-spin" /> Processing...</>
            ) : (
              <><ArrowDownToLine size={15} /> Request Payout</>
            )}
          </button>
        </div>
      </div>

      {/* Bank Accounts Management */}
      <div className="card-base card-gradient-bg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 size={18} className="text-primary" />
            <h2 className="font-bold text-base">Saved Bank Accounts</h2>
          </div>
          <button
            onClick={() => { setShowAddBank(!showAddBank); setBankError(''); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-xs font-semibold transition-all"
          >
            <Plus size={13} />
            Add Account
          </button>
        </div>

        {/* Add Bank Form */}
        {showAddBank && (
          <div className="p-4 rounded-xl bg-muted/20 border border-border space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">New Bank Account</p>

            {bankError && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertCircle size={13} className="text-red-400 flex-shrink-0" />
                <p className="text-xs text-red-300">{bankError}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Bank Name</label>
                <select
                  value={newBank.bankName}
                  onChange={(e) => setNewBank({ ...newBank, bankName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary/60 focus:outline-none text-sm transition-colors"
                >
                  <option value="">Select bank...</option>
                  {NIGERIAN_BANKS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Account Number</label>
                <input
                  type="text"
                  value={newBank.accountNumber}
                  onChange={(e) => setNewBank({ ...newBank, accountNumber: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  placeholder="10-digit account number"
                  className="w-full px-3 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary/60 focus:outline-none text-sm transition-colors"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs text-muted-foreground">Account Name</label>
                <input
                  type="text"
                  value={newBank.accountName}
                  onChange={(e) => setNewBank({ ...newBank, accountName: e.target.value })}
                  placeholder="As it appears on your bank statement"
                  className="w-full px-3 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary/60 focus:outline-none text-sm transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleAddBank}
                disabled={addingBank}
                className="flex-1 btn-primary py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {addingBank ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                {addingBank ? 'Saving...' : 'Save Account'}
              </button>
              <button
                onClick={() => { setShowAddBank(false); setBankError(''); setNewBank({ bankName: '', accountNumber: '', accountName: '' }); }}
                className="px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:bg-muted/50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Bank Accounts List */}
        {loading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-muted/30 animate-pulse" />
            ))}
          </div>
        ) : bankAccounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 size={20} className="text-primary/60" />
            </div>
            <p className="text-sm font-medium">No bank accounts yet</p>
            <p className="text-xs text-muted-foreground text-center max-w-xs">
              Add a bank account to start requesting payouts from your referral earnings.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {bankAccounts.map((acc) => (
              <div
                key={acc.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${acc.isDefault ? 'border-primary/30 bg-primary/5' : 'border-border bg-muted/10'}`}
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Building2 size={16} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold truncate">{acc.bankName}</p>
                    {acc.isDefault && (
                      <span className="badge-base status-completed text-[10px]">Default</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{acc.accountNumber} · {acc.accountName}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!acc.isDefault && (
                    <button
                      onClick={() => handleSetDefault(acc.id)}
                      title="Set as default"
                      className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-primary"
                    >
                      <Star size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteBank(acc.id)}
                    title="Remove account"
                    className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payout History */}
      <div className="card-base card-gradient-bg">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-primary" />
            <h2 className="font-bold text-base">Payout History</h2>
          </div>
          <span className="text-xs text-muted-foreground">{payoutHistory.length} requests</span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-muted/30 animate-pulse" />
            ))}
          </div>
        ) : payoutHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <ArrowDownToLine size={24} className="text-primary/60" />
            </div>
            <p className="text-sm font-medium">No payout requests yet</p>
            <p className="text-xs text-muted-foreground text-center max-w-xs">
              Your payout request history will appear here once you submit your first request.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-muted-foreground pb-3 pr-4">Date</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground pb-3 pr-4">Bank</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground pb-3 pr-4">Amount</th>
                  <th className="text-center text-xs font-semibold text-muted-foreground pb-3 pr-4">Status</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground pb-3">Processed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {payoutHistory.map((payout) => {
                  const cfg = statusConfig[payout.status];
                  return (
                    <tr key={payout.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 pr-4">
                        <span className="text-xs text-muted-foreground">{payout.createdAt}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <div>
                          <p className="text-sm font-medium truncate max-w-[140px]">{payout.bankName}</p>
                          <p className="text-xs text-muted-foreground">{payout.accountNumber}</p>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-right">
                        <span className="font-bold tabular-nums gold-gradient-text">
                          ₦{payout.amount.toLocaleString('en-NG')}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-center">
                        <span className={`badge-base text-[10px] inline-flex items-center gap-1 ${cfg.className}`}>
                          {cfg.icon}
                          {cfg.label}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-xs text-muted-foreground">
                          {payout.processedAt || '—'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
