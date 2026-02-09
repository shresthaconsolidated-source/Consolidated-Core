
import React from 'react';
import { ArrowRight, ShieldCheck, Calendar } from 'lucide-react';
import { BOOKING_LINK, openCalendly } from '../constants';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-slate-950">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] -z-10 opacity-50"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-indigo-400 text-xs font-bold uppercase tracking-[0.2em] mb-8 animate-fade-in shadow-xl shadow-indigo-500/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Operational Control
          </div>

          {/* Headline */}
          <h1 className="text-5xl lg:text-7xl font-extrabold text-white tracking-tight mb-8 leading-[1.05] max-w-5xl text-balance">
            We don't sell dashboards. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">We install discipline.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-slate-400 mb-12 leading-relaxed max-w-2xl text-balance font-light">
            I set up the tracking, I train your staff to use it, and I send you <span className="text-white font-medium">Weekly CEO Reports</span> that tell you exactly who is performing and who isn't.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center w-full max-w-md mb-20">
            <a
              href={BOOKING_LINK}
              onClick={openCalendly}
              className="bg-indigo-600 text-white px-8 py-4 rounded-full text-base font-bold hover:bg-indigo-500 transition-all duration-300 shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Calendar className="h-4 w-4" />
              Audit My Process
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#about" className="bg-slate-900 text-white border border-slate-800 px-8 py-4 rounded-full text-base font-bold hover:bg-slate-800 transition-all duration-300 flex items-center justify-center gap-2">
              See How It Works
            </a>
          </div>

          {/* Dashboard Preview */}
          <div className="relative w-full max-w-5xl mx-auto perspective-1000">
            <div className="relative rounded-xl bg-slate-900 p-2 ring-1 ring-white/10 shadow-2xl shadow-indigo-500/20 transform rotate-x-6 hover:rotate-x-0 transition-transform duration-700 ease-out">
              <div className="rounded-lg overflow-hidden bg-slate-950 aspect-[16/9] relative group">
                {/* Fallback pattern or actual image */}
                <img
                  src="/dashboard-preview.jpg"
                  alt="Consolidated Care Dashboard Interface"
                  className="w-full h-full object-cover"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent pointer-events-none"></div>
              </div>
            </div>

            {/* Background Glow behind dashboard */}
            <div className="absolute -inset-4 bg-indigo-500/20 blur-3xl -z-10 rounded-[3rem]"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
