
import React, { useState, useEffect } from 'react';
import { Menu, X, BarChart3, Calendar } from 'lucide-react';
import { NAV_LINKS, BOOKING_LINK } from '../constants';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${
      scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200 py-4' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-slate-900 p-2 rounded-lg group-hover:bg-indigo-600 transition-colors">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tighter text-slate-900 block leading-none">SHRESTHA</span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-slate-500 font-bold">Consolidated</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-10">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a 
              href={BOOKING_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200 flex items-center gap-2"
            >
              <Calendar className="h-3 w-3" />
              Schedule Call
            </a>
          </div>
          
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-900">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 animate-in slide-in-from-top duration-300">
          <div className="px-6 pt-6 pb-10 space-y-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block text-sm font-bold text-slate-600 hover:text-indigo-600"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <a 
              href={BOOKING_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Schedule 30 Min Call
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
