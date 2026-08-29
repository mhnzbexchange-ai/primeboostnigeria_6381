import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Activity window in minutes — configurable here, not scattered throughout the app
const ACTIVE_WINDOW_MINUTES = 30;

export const revalidate = 60; // Cache for 60 seconds — efficient, not stale

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc('get_active_users_count', {
      activity_window_minutes: ACTIVE_WINDOW_MINUTES,
    });

    if (error) {
      console.error('active-users RPC error:', error.message);
      return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }

    const row = Array.isArray(data) ? data[0] : data;

    // Return ONLY aggregate numbers — never individual user records
    return NextResponse.json({
      totalRegistered: Number(row?.total_registered ?? 0),
      activeUsers: Number(row?.active_users ?? 0),
      activeToday: Number(row?.active_today ?? 0),
      activeLast7Days: Number(row?.active_last_7_days ?? 0),
      windowMinutes: ACTIVE_WINDOW_MINUTES,
    });
  } catch (err: any) {
    console.error('active-users route error:', err?.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
