import React from 'react';
import HomepageHero from './components/HomepageHero';
import HomepageServices from './components/HomepageServices';
import HomepageTestimonials from './components/HomepageTestimonials';
import HomepageFAQ from './components/HomepageFAQ';
import HomepageFooter from './components/HomepageFooter';
import HomepageNav from './components/HomepageNav';
import HomepageStats from './components/HomepageStats';
import HomepageHowItWorks from './components/HomepageHowItWorks';
import HomepageReferral from './components/HomepageReferral';

export default function Homepage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background">

      {/* Navigation */}
      <HomepageNav />

      {/* Hero */}
      <HomepageHero />

      {/* Trust / Benefits */}
      <HomepageStats />

      {/* Featured services */}
      <HomepageServices />

      {/* How It Works */}
      <HomepageHowItWorks />

      {/* Referral Program */}
      <HomepageReferral />

      {/* Why PrimeBoost Nigeria */}
      <HomepageTestimonials />

      {/* Frequently asked questions */}
      <HomepageFAQ />

      {/* Footer / contact */}
      <HomepageFooter />

    </main>
  );
}