import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('wallets')
      .select(
        'id, user_id, balance, total_funded, total_spent, updated_at, user_profiles!inner(full_name, email, role)'
      )
      .order('balance', { ascending: false })
      .limit(1000);

    if (error) {
      console.error('User balances fetch error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const rows = (data || []).map((w: any) => {
      const p = Array.isArray(w.user_profiles) ? w.user_profiles[0] : w.user_profiles;
      return {
        id: w.id,
        user_id: w.user_id,
        full_name: p?.full_name || '',
        email: p?.email || '',
        role: p?.role || 'user',
        balance: Number(w.balance) || 0,
        total_funded: Number(w.total_funded) || 0,
        total_spent: Number(w.total_spent) || 0,
        updated_at: w.updated_at,
      };
    });

    const totalBalance = rows.reduce((sum, r) => sum + r.balance, 0);

    return NextResponse.json({ success: true, users: rows, totalBalance });
  } catch (err) {
    console.error('User balances API error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
