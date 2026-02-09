
import React from 'react';
import { ArrowRight, ShieldCheck, Calendar } from 'lucide-react';
import { BOOKING_LINK } from '../constants';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-24 lg:pt-52 lg:pb-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-[0.2em] mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Operational Control & Clarity
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.05] max-w-5xl text-balance">
            Stop Guessing Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Visa Revenue.</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-12 leading-relaxed max-w-2xl text-balance">
            We audit your <span className="font-semibold text-slate-900">Financial Operations</span>, not just your filings. Track counselor activity, verify leads, and secure pending commissions with surgical precision.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center w-full max-w-md">
            <a 
              href={BOOKING_LINK} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-slate-900 text-white px-8 py-4 rounded-full text-base font-bold hover:bg-indigo-600 transition-all duration-300 shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group"
            >
              <Calendar className="h-4 w-4" />
              Schedule 30 Min Call
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#pricing" className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-full text-base font-bold hover:border-slate-900 transition-all duration-300 flex items-center justify-center gap-2">
              Explore Plans
            </a>
          </div>
          
          <div className="mt-20 flex flex-wrap justify-center items-center gap-8 lg:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="flex items-center gap-2 font-bold text-slate-400">
               <ShieldCheck className="h-5 w-5" />
               <span className="tracking-widest uppercase text-[10px]">Process Audited</span>
             </div>
             <div className="text-slate-400 font-bold tracking-widest uppercase text-[10px]">Financial Integrity</div>
             <div className="text-slate-400 font-bold tracking-widest uppercase text-[10px]">Revenue Security</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
