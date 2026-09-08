import React from 'react';
import HomepageHero from './components/HomepageHero';
import HomepageServices from './components/HomepageServices';
import HomepageTestimonials from './components/HomepageTestimonials';
import HomepageFAQ from './components/HomepageFAQ';
import HomepageFooter from './components/HomepageFooter';
import HomepageNav from './components/HomepageNav';
import HomepageStats from './components/HomepageStats';

function Advertisement() {
  return (
    <section
      id="advertise"
      className="relative overflow-hidden bg-background px-4 py-6 sm:py-8"
      aria-label="PrimeBoost advertising"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-2xl border border-primary/15 bg-card/60 shadow-sm backdrop-blur">

          <div className="flex flex-col items-center justify-between gap-5 px-5 py-6 text-center sm:flex-row sm:text-left sm:px-7">

            <div className="flex items-start gap-4">

              <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 sm:flex">
                <span className="text-lg">📢</span>
              </div>

              <div>

                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                  PRIMEBOOST ADVERTISING
                </p>

                <h2 className="text-base font-bold sm:text-lg">
                  Put Your Brand in Front of More People
                </h2>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground sm:text-sm">
                  Advertise your business, brand, product or service on
                  PrimeBoost Nigeria.
                </p>

              </div>

            </div>

            <a
              href="#advertise"
              className="inline-flex shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 px-5 py-2.5 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-primary-foreground sm:text-sm"
            >
              Advertise With Us
              <span className="ml-2">→</span>
            </a>

          </div>

        </div>
      </div>
    </section>
  );
}

export default async function Homepage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background">

      {/* Navigation */}
      <HomepageNav />

      {/* Hero */}
      <HomepageHero />

      {/* Advertising */}
      <Advertisement />

      {/* Featured services */}
      <div id="services">
        <HomepageServices />
      </div>

      {/* Why PrimeBoost */}
      <HomepageTestimonials />

      {/* Frequently asked questions */}
      <HomepageFAQ />

      {/* Footer / contact */}
      <HomepageFooter />

    </main>
  );
}