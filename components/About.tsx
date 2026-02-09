
import React from 'react';
import { CheckCircle } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 lg:py-32 bg-slate-900 text-white relative overflow-hidden">
      {/* Background accents - refined for subtlety */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-b from-indigo-500/10 to-transparent blur-3xl transform translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-t from-blue-500/10 to-transparent blur-3xl transform -translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Image Column */}
          <div className="lg:col-span-5 relative group">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-slate-800 border-2 border-slate-700/50 transition-transform duration-500 hover:scale-[1.02]">
              <img
                src="/ashish-shrestha.png"
                alt="Ashish Shrestha - Principal Consultant"
                className="w-full h-full object-cover object-top transition-all duration-700 ease-in-out"
              />

              {/* Floating Experience Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:bg-white/15">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-white mb-1">8+</div>
                    <div className="text-indigo-200 text-xs font-semibold uppercase tracking-wider">Years Experience</div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements behind image */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl -z-10"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl -z-10"></div>
          </div>

          {/* Content Column */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
              Principal Consultant
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight">
              Ashish Shrestha
            </h2>

            <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
              <p className="font-light">
                Specializing in <span className="text-indigo-400 font-medium">Educational Consultancy Operations</span>, I bridge the critical gap between front-office sales enthusiasm and back-office financial reality.
              </p>
              <p className="font-light border-l-4 border-indigo-500/30 pl-6 italic text-slate-400">
                "Most agencies lose 15-20% of their potential commissions due to broken handovers and forgotten invoices. I provide the oversight needed to capture every single rupee."
              </p>
            </div>

            <div className="mt-10 grid sm:grid-cols-2 gap-5">
              {[
                { title: "Gap Analysis", desc: "Identifying leakage in the enrollment pipeline." },
                { title: "MIS Reporting", desc: "Real-time visibility into branch performance." },
                { title: "Staff Audit", desc: "Ensuring counselors follow through on every lead." },
                { title: "AR Security", desc: "Guaranteeing pending commissions are tracked." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800 transition-all group">
                  <div className="shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
