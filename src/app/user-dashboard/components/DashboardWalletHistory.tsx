'use client';

import React, { useEffect, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Wallet } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Transaction {
  id: string;
  transaction_type: 'credit' | 'debit';
  description: string;
  amount: number;
  created_at: string;
}

export default function DashboardWalletHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    if (!user?.id) return;
    fetchTransactions();
  }, [user?.id]);

  const fetchTransactions = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('id, transaction_type, description, amount, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        if (error.code?.startsWith('42')) throw error;
        console.log('Transactions fetch error:', error.message);
        return;
      }
      setTransactions(data || []);
    } catch (err: any) {
      console.log('Transactions error:', err?.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return { date: '', time: '' };
    const d = new Date(dateStr);
    return {
      date: `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`,
      time: `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`,
    };
  };

  return (
    <div className="card-base card-gradient-bg">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Wallet size={18} className="text-primary" />
          <h2 className="font-bold text-base">Wallet History</h2>
        </div>
        <button className="text-xs text-primary hover:underline">View all</button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground text-sm">Loading transactions...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground text-sm">No transactions yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {transactions?.map((txn) => {
            const { date, time } = formatDateTime(txn?.created_at);
            return (
              <div key={txn?.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/30 transition-colors">
                <div className={`p-2 rounded-lg flex-shrink-0 ${txn?.transaction_type === 'credit' ? 'bg-green-400/10' : 'bg-red-400/10'}`}>
                  {txn?.transaction_type === 'credit'
                    ? <ArrowDownLeft size={14} className="text-green-400" />
                    : <ArrowUpRight size={14} className="text-red-400" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{txn?.description}</p>
                  <p className="text-[10px] text-muted-foreground">{date} · {time}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-bold tabular-nums ${txn?.transaction_type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                    {txn?.transaction_type === 'credit' ? '+' : '-'}₦{Number(txn?.amount)?.toLocaleString('en-NG')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}