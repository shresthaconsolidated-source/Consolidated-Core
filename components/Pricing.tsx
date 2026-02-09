
import React from 'react';
import { PLANS } from '../constants';
import { Check, Minus, Star, AlertCircle } from 'lucide-react';

const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">The Operational Ladder</h2>
          <p className="text-lg text-slate-500 leading-relaxed">
            Professional auditing and oversight for consultancies of all sizes. 
            <span className="block font-semibold text-slate-900 mt-2">Recommended for most agencies: Plan B & Plan C</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 items-stretch">
          {PLANS.map((plan) => {
            const isCFO = plan.name === 'Fractional CFO';
            
            return (
              <div 
                key={plan.id}
                className={`relative flex flex-col rounded-3xl p-8 transition-all duration-500 ${
                  plan.highlight 
                    ? 'bg-white border-2 border-indigo-600 shadow-2xl scale-[1.02] z-10' 
                    : isCFO 
                      ? 'bg-slate-900 text-white shadow-xl' 
                      : 'bg-slate-50 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Recommended
                  </div>
                )}

                <div className="mb-8">
                  <h3 className={`text-sm font-black uppercase tracking-[0.2em] mb-4 ${
                    isCFO ? 'text-indigo-400' : 'text-slate-400'
                  }`}>
                    {plan.tagline}
                  </h3>
                  <div className="text-2xl font-bold mb-1">{plan.name}</div>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-black">{plan.price}</span>
                    <span className={`text-xs ${isCFO ? 'text-slate-400' : 'text-slate-500'}`}>/mo</span>
                  </div>
                  <div className={`text-xs py-2 px-3 rounded-lg inline-block font-bold ${
                    isCFO ? 'bg-white/10 text-white' : 'bg-slate-200/50 text-slate-700'
                  }`}>
                    Focus: {plan.focus}
                  </div>
                </div>

                <div className="flex-grow space-y-4 mb-10">
                  <FeatureRow label="Data Entry" value={plan.features.dataEntry} isDark={isCFO} />
                  <FeatureRow label="Process Audit" value={plan.features.processAudit} isDark={isCFO} />
                  <FeatureRow label="Lead Alerts" value={plan.features.missedLeadAlerts} isDark={isCFO} />
                  <FeatureRow label="Branch Comparison" value={plan.features.branchComparison} isDark={isCFO} />
                  {plan.features.accountsReceivable !== '❌ Not included' && (
                    <FeatureRow label="AR Aging" value={plan.features.accountsReceivable} isDark={isCFO} />
                  )}
                  {plan.features.cashFlow !== '❌ Not included' && (
                    <FeatureRow label="MIS Analysis" value={plan.features.cashFlow} isDark={isCFO} />
                  )}
                </div>

                <div className={`mt-auto pt-6 border-t ${isCFO ? 'border-white/10' : 'border-slate-200'}`}>
                  <p className={`text-[10px] uppercase tracking-widest font-bold mb-6 text-center ${
                    isCFO ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Ideal for {plan.idealClient}
                  </p>
                  
                  <button className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${
                    plan.highlight 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200' 
                      : isCFO 
                        ? 'bg-white text-slate-900 hover:bg-indigo-50' 
                        : 'bg-white border border-slate-300 text-slate-900 hover:border-slate-900'
                  }`}>
                    {isCFO ? 'Join Waitlist' : `Choose ${plan.name}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const FeatureRow = ({ label, value, isDark }: { label: string; value: string; isDark: boolean }) => {
  const isIncluded = value.includes('✅');
  const isAutomated = value.includes('⚠️');
  const isExcluded = value.includes('❌');

  return (
    <div className="flex flex-col gap-1">
      <div className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
        {label}
      </div>
      <div className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
        {value.replace('✅', '').replace('❌', '').replace('⚠️', '').trim()}
        {isIncluded ? (
          <Check className="h-3 w-3 inline ml-2 text-green-500" />
        ) : isAutomated ? (
          <AlertCircle className="h-3 w-3 inline ml-2 text-amber-500" />
        ) : (
          <Minus className="h-3 w-3 inline ml-2 text-slate-300" />
        )}
      </div>
    </div>
  );
};

export default Pricing;
