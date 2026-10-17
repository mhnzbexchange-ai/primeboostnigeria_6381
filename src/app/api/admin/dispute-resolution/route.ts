import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase?.auth?.getUser();
    if (authError || !user) {
      return NextResponse?.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase?.from('user_profiles')?.select('role')?.eq('id', user?.id)?.single();

    if (profile?.role !== 'admin') {
      return NextResponse?.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const [transfersRes, failedRes, auditRes] = await Promise.all([
      supabase?.from('bank_transfer_payments')?.select(
          'id, user_id, amount, reference, status, admin_note, proof_path, created_at, reviewed_at, user_profiles!bank_transfer_payments_user_id_fkey(full_name, email)'
        )?.in('status', ['pending', 'rejected'])?.order('created_at', { ascending: false })?.limit(100),
      supabase?.from('paystack_webhook_events')?.select('id, event_type, reference, email, amount_kobo, status, error_message, created_at')?.or('status.eq.failed,and(status.eq.skipped,event_type.eq.charge.success)')?.order('created_at', { ascending: false })?.limit(100),
      supabase?.from('manual_credit_audit_log')?.select(
          'id, admin_email, user_email, amount, reference, credit_source, reason, outcome, created_at'
        )?.order('created_at', { ascending: false })?.limit(100),
    ]);

    const firstError = transfersRes?.error || failedRes?.error || auditRes?.error;
    if (firstError) {
      console.error('Dispute resolution fetch error:', firstError);
      return NextResponse?.json({ success: false, error: firstError?.message }, { status: 500 });
    }

    return NextResponse?.json({
      success: true,
      unmatchedTransfers: transfersRes?.data || [],
      failedVerifications: failedRes?.data || [],
      auditLog: auditRes?.data || [],
    });
  } catch (err) {
    console.error('Dispute resolution API error:', err);
    return NextResponse?.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
