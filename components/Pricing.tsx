import React from 'react';
import { PRICING_PLANS, BOOKING_LINK, openCalendly } from '../constants';
import { Check, X, ArrowRight, Phone } from 'lucide-react';

const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl opacity-20 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-indigo-400 font-bold tracking-widest uppercase text-xs mb-4">Pricing Models</h2>
          <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6">Simple, High-ROI Engagement.</h3>
          <p className="text-slate-400 text-lg">
            Most consultancies recover my fee within the first 30 days simply by plugging leaks in their enrollment pipeline.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 flex flex-col border transition-all duration-300 hover:-translate-y-2 ${plan.popular
                ? 'bg-slate-900/80 border-indigo-500 shadow-2xl shadow-indigo-500/20'
                : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/60 hover:border-slate-700'
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h4 className="text-xl font-bold text-white mb-2">{plan.name}</h4>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.period && <span className="text-slate-500 text-sm font-medium">{plan.period}</span>}
                </div>
                <p className="text-slate-400 text-sm mt-4 leading-relaxed h-10">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, idx) => {
                  const isNegative = feature.startsWith("❌");
                  const cleanFeature = feature.replace("❌", "").trim();

                  return (
                    <li key={idx} className={`flex items-start gap-3 text-sm ${isNegative ? 'text-slate-500' : 'text-slate-300'}`}>
                      {isNegative ? (
                        <X className="h-5 w-5 shrink-0 text-slate-600" />
                      ) : (
                        <Check className={`h-5 w-5 shrink-0 ${plan.popular ? 'text-indigo-400' : 'text-slate-500'}`} />
                      )}
                      <span>{cleanFeature}</span>
                    </li>
                  );
                })}
              </ul>

              <a
                href={BOOKING_LINK}
                onClick={openCalendly}
                className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${plan.popular
                  ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/25'
                  : 'bg-slate-800 text-white hover:bg-slate-700'
                  }`}
              >
                {plan.name === "Fractional CFO" ? "Join Waitlist" : "Get Started"}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-slate-900/50 border border-slate-800 rounded-2xl p-8 lg:p-12 text-center">
          <h4 className="text-2xl font-bold text-white mb-4">Not sure what you need?</h4>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Book a free 30-minute discovery call. I'll audit one part of your process live on the call and show you exactly where you're losing money.
          </p>
          <a
            href={BOOKING_LINK}
            onClick={openCalendly}
            className="inline-flex items-center gap-2 bg-white text-slate-950 px-8 py-4 rounded-full font-bold hover:bg-indigo-50 transition-colors cursor-pointer"
          >
            <Phone className="h-4 w-4" />
            Book Discovery Call
          </a>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
