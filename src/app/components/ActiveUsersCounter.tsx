'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ActiveUsersCounterProps {
  initialCount: number;
}

function formatCount(n: number): string {
  if (n >= 100_000) return `${(n / 100_000).toFixed(0)}00K`;
  if (n >= 10_000) return `${Math.floor(n / 1_000)}0K`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return n.toLocaleString('en-NG');
}

export default function ActiveUsersCounter({ initialCount }: ActiveUsersCounterProps) {
  const [displayCount, setDisplayCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Intersection Observer — animate only when visible
  useEffect(() => {
    if (hasAnimated || initialCount === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();

          // Smooth count-up animation
          const duration = 1200;
          const steps = 40;
          const increment = initialCount / steps;
          let current = 0;
          let step = 0;

          const timer = setInterval(() => {
            step++;
            current = Math.min(Math.round(increment * step), initialCount);
            setDisplayCount(current);
            if (step >= steps) clearInterval(timer);
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [initialCount, hasAnimated]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-1">
      {/* Green live indicator + count */}
      <div className="flex items-center gap-2">
        {/* Pulsing green dot */}
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
        </span>

        <span className="text-3xl font-extrabold tabular-nums text-foreground sm:text-4xl">
          {formatCount(displayCount)}+
        </span>
      </div>

      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Active Users
      </span>
    </div>
  );
}
