import React from 'react';
import HomepageHero from './components/HomepageHero';
import HomepageServices from './components/HomepageServices';
import HomepageTestimonials from './components/HomepageTestimonials';
import HomepageFAQ from './components/HomepageFAQ';
import HomepageFooter from './components/HomepageFooter';
import HomepageNav from './components/HomepageNav';
import HomepageStats from './components/HomepageStats';

// Fetch active users count server-side — no sensitive data exposed to browser
async function getActiveUsersCount(): Promise<number> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      'https://primeboost7331.builtwithrocket.new';

    const res = await fetch(`${baseUrl}/api/active-users`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return 0;
    const data = await res.json();
    return data?.totalRegistered ?? 0;
  } catch {
    return 0;
  }
}

function Advertisement() {
  return (
    <section className="w-full bg-background px-4 py-3">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-sm">

          <div className="px-4 pt-2 text-center">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Advertisement
            </span>
          </div>

          <div className="px-4 py-4 text-center sm:py-5">

            <p className="mb-1 text-xs font-semibold text-primary">
              PROMOTE YOUR BUSINESS WITH PRIMEBOOST
            </p>

            <h2 className="text-2xl font-bold sm:text-3xl">
              Put Your Brand in Front of More People
            </h2>

            <p className="mx-auto mt-1 max-w-2xl text-xs text-muted-foreground sm:text-sm">
              Advertise your business, brand, product or service on PrimeBoost
              Nigeria.
            </p>

            <a
              href="#advertise"
              className="mt-3 inline-block rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:text-sm"
            >
              Advertise With Us →
            </a>

          </div>
        </div>
      </div>
    </section>
  );
}

export default async function Homepage() {
  const activeUsersCount = await getActiveUsersCount();

  return (
    <div className="min-h-screen bg-background">

      <HomepageNav />

      <Advertisement />

      <HomepageHero />

      <div id="services">
        <HomepageServices />
      </div>

      {/* Stats section with live active users counter */}
      <HomepageStats activeUsersCount={activeUsersCount} />

      <HomepageTestimonials />

      <HomepageFAQ />

      <HomepageFooter />

    </div>
  );
}