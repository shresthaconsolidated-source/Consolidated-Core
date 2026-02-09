
import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import ProcessInsights from './components/ProcessInsights';
import PrivacyPolicy from './components/PrivacyPolicy';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (currentPath === '/privacy-policy') {
    return <PrivacyPolicy />;
  }

  return (
    <div className="min-h-screen bg-slate-950 selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navigation />
      <main>
        <Hero />
        <ProcessInsights />
        <About />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}

export default App;
