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
    <section className="w-full px-4 py-4 bg-background">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          
          {/* Advertisement label */}
          <div className="px-4 pt-3 text-center">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Advertisement
            </span>
          </div>

          {/* Advertisement content */}
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className="px-6 py-6 text-center sm:py-8">
              <p className="mb-2 text-sm font-semibold text-primary">
                🚀 GROW YOUR BUSINESS WITH PRIMEBOOST
              </p>

              <h2 className="text-xl font-bold sm:text-2xl">
                Reach More People. Get More Attention.
              </h2>

              <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
                Advertise your business, brand or service to people visiting
                PrimeBoost Nigeria.
              </p>

              <span className="mt-5 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
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

      {/* Advertisement shown before the main homepage */}
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
