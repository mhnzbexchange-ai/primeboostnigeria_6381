'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * Silently updates the authenticated user's last_seen timestamp.
 * Renders nothing — purely a side-effect component.
 * Place inside any authenticated layout/page.
 */
export default function LastSeenUpdater() {
  useEffect(() => {
    const supabase = createClient();

    const update = async () => {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) return;

      await supabase?.rpc('update_user_last_seen');
    };

    update();
  }, []);

  return null;
}
