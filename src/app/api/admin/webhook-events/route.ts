import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const perPage = 50;
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const eventType = searchParams.get('event_type') || '';

    let query = supabase
      .from('paystack_webhook_events')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (eventType) {
      query = query.eq('event_type', eventType);
    }

    const { data: events, count, error } = await query;

    if (error) {
      console.error('Failed to fetch webhook events:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      events: events || [],
      meta: {
        total: count || 0,
        page,
        perPage,
        pageCount: Math.ceil((count || 0) / perPage),
      },
    });
  } catch (err) {
    console.error('Webhook events API error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
