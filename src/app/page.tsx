import React from 'react';
import HomepageHero from './components/HomepageHero';
import HomepageStats from './components/HomepageStats';
import HomepageServices from './components/HomepageServices';
import HomepageTestimonials from './components/HomepageTestimonials';
import HomepageFAQ from './components/HomepageFAQ';
import HomepageFooter from './components/HomepageFooter';
import HomepageNav from './components/HomepageNav';

export default function Homepage() {
  return (
    <div className="min-h-screen bg-background">
      <HomepageNav />
      <HomepageHero />
      <HomepageStats />
      <HomepageServices />
      <HomepageTestimonials />
      <HomepageFAQ />
      <HomepageFooter />
    </div>
  );
}