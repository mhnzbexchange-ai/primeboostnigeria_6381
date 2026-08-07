import React from 'react';
import HomepageHero from './components/HomepageHero';
import HomepageStats from './components/HomepageStats';
import HomepageServices from './components/HomepageServices';
import HomepageTestimonials from './components/HomepageTestimonials';
import HomepageFAQ from './components/HomepageFAQ';
import HomepageFooter from './components/HomepageFooter';
import HomepageNav from './components/HomepageNav';

function Advertisement() {
  return (
    <section className="w-full px-4 py-2 bg-background">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-sm">

          <div className="px-4 pt-2 text-center">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Advertisement
            </span>
          </div>

          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className="px-4 py-4 text-center sm:py-5">

              <p className="mb-1 text-xs font-semibold text-primary">
                🚀 GROW YOUR BUSINESS WITH PRIMEBOOST
              </p>

              <h2 className="text-lg font-bold sm:text-xl">
                Reach More People. Get More Attention.
              </h2>

              <p className="mx-auto mt-1 max-w-2xl text-xs text-muted-foreground sm:text-sm">
                Advertise your business, brand or service to people visiting
                PrimeBoost Nigeria.
              </p>

              <span className="mt-3 inline-block rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:text-sm">
                Advertise With Us →
              </span>

            </div>
          </a>

        </div>
      </div>
    </section>
  );
}

export default function Homepage() {
  return (
    <div className="min-h-screen bg-background">
      <HomepageNav />

      <Advertisement />

      <HomepageHero />
      <HomepageStats />
      <HomepageServices />
      <HomepageTestimonials />
      <HomepageFAQ />
      <HomepageFooter />
    </div>
  );
}
