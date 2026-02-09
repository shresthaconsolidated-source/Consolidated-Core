
import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import ProcessRoadmap from './components/ProcessRoadmap';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import ProcessInsights from './components/ProcessInsights';
import PrivacyPolicy from './components/PrivacyPolicy';

function App() {
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (currentHash === '#/privacy-policy') {
    return <PrivacyPolicy />;
  }

  return (
    <div className="min-h-screen bg-slate-950 selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navigation />
      <main>
        <Hero />
        <ProcessInsights />
        <About />
        <ProcessRoadmap />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}

export default App;
