'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { RefreshCw, Loader2, Wallet, Search } from 'lucide-react';

interface UserBalance {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role: string;
  balance: number;
  total_funded: number;
  total_spent: number;
  updated_at: string | null;
}

const formatNaira = (n: number) =>
  `₦${n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function AdminUserBalances() {
  const [users, setUsers] = useState<UserBalance[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchBalances = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/user-balances');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
        setTotalBalance(data.totalBalance || 0);
      } else {
        setError(data.error || 'Failed to load balances');
      }
    } catch (err) {
      console.error('Failed to fetch user balances:', err);
      setError('Failed to load balances');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.email.toLowerCase().includes(q) || u.full_name.toLowerCase().includes(q)
    );
  }, [users, search]);

  return (
    <div className="card-base card-gradient-bg">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="font-bold text-base flex items-center gap-2">
            <Wallet size={16} className="text-muted-foreground" />
            User Wallet Balances
            <span className="badge-base status-pending">{users.length}</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Total held in wallets:{' '}
            <span className="font-semibold gold-gradient-text">{formatNaira(totalBalance)}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              size={12}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email"
              className="text-xs bg-muted/40 border border-border rounded-lg pl-7 pr-2.5 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 w-48"
            />
          </div>
          <button
            onClick={fetchBalances}
            disabled={loading}
            className="p-2 rounded-lg bg-muted/40 hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-14">
          <Loader2 size={24} className="animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="text-center py-14">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-14">
          <Wallet size={32} className="mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No users found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border max-h-[480px] overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-card">
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground whitespace-nowrap">
                  User
                </th>
                <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground whitespace-nowrap">
                  Email
                </th>
                <th className="text-right px-3 py-2.5 font-semibold text-muted-foreground whitespace-nowrap">
                  Balance
                </th>
                <th className="text-right px-3 py-2.5 font-semibold text-muted-foreground whitespace-nowrap">
                  Total Funded
                </th>
                <th className="text-right px-3 py-2.5 font-semibold text-muted-foreground whitespace-nowrap">
                  Total Spent
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr
                  key={u.id}
                  className={`border-b border-border/50 hover:bg-muted/10 transition-colors ${
                    i % 2 === 0 ? '' : 'bg-muted/5'
                  }`}
                >
                  <td className="px-3 py-2.5 whitespace-nowrap text-foreground">
                    {u.full_name || <span className="text-muted-foreground/40">—</span>}
                    {u.role === 'admin' && (
                      <span className="ml-2 badge-base status-failed">Admin</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 max-w-[220px] truncate text-muted-foreground">
                    {u.email}
                  </td>
                  <td className="px-3 py-2.5 text-right font-semibold tabular-nums gold-gradient-text whitespace-nowrap">
                    {formatNaira(u.balance)}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground whitespace-nowrap">
                    {formatNaira(u.total_funded)}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground whitespace-nowrap">
                    {formatNaira(u.total_spent)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
