import React from 'react';
import Navbar from './navbar';
import Hero from './hero';
import Features from './features';
import HowItWorks from './how-it-works';
import Testimonials from './testimonials';
import CTABand from './cta-band';
import FAQ from './faq';
import Footer from './footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main id="main-content">
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTABand />
        <FAQ />
        <Footer />
      </main>
    </div>
  );
};

export default LandingPage;
