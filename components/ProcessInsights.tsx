import React from 'react';
import { TrendingUp, AlertTriangle, PhoneOff, UserX } from 'lucide-react';

const ProcessInsights: React.FC = () => {
    return (
        <section className="py-24 bg-slate-950 relative">
            {/* Glow effects */}
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -z-10"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-indigo-400 font-bold tracking-widest uppercase text-xs mb-4">The CEO Report</h2>
                    <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6">Weekly insights that actually matter.</h3>
                    <p className="text-slate-400 text-lg">
                        Forget vanity metrics. Our weekly CEO Reports highlight exactly where your process is breaking down, so you can fix it before Monday morning.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Card 1: Marketing ROI */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-emerald-500/50 transition-colors group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TrendingUp className="w-16 h-16 text-emerald-500" />
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h4 className="text-white font-bold mb-2">Real Ad Cost</h4>
                        <div className="text-emerald-400 text-2xl font-mono font-bold mb-1">NPR 2,088</div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-4">Per Enrolled Student</p>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            "You spent NPR 6.6L on ads. Most of it was wasted. Here is the actual cost to get one student."
                        </p>
                    </div>

                    {/* Card 2: Staff Performance */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-red-500/50 transition-colors group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <UserX className="w-16 h-16 text-red-500" />
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
                            <UserX className="w-5 h-5 text-red-400" />
                        </div>
                        <h4 className="text-white font-bold mb-2">Staff Activity</h4>
                        <div className="text-red-400 text-2xl font-mono font-bold mb-1">Simrik</div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-4">Needs Correction</p>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            "Simrik missed 40% of her follow-up calls today. She needs a formal warning."
                        </p>
                    </div>

                    {/* Card 3: Missed Opportunities */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-orange-500/50 transition-colors group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <PhoneOff className="w-16 h-16 text-orange-500" />
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4">
                            <PhoneOff className="w-5 h-5 text-orange-400" />
                        </div>
                        <h4 className="text-white font-bold mb-2">Revenue Leaks</h4>
                        <div className="text-orange-400 text-2xl font-mono font-bold mb-1">79 Leads</div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-4">Went Cold Today</p>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            "79 interested students were not called back within 24 hours. They have likely moved on."
                        </p>
                    </div>

                    {/* Card 4: Pipeline Bottlenecks */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-blue-500/50 transition-colors group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <AlertTriangle className="w-16 h-16 text-blue-500" />
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                            <AlertTriangle className="w-5 h-5 text-blue-400" />
                        </div>
                        <h4 className="text-white font-bold mb-2">Stuck Applications</h4>
                        <div className="text-blue-400 text-2xl font-mono font-bold mb-1">14 Students</div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-4">Offer Letter Stage</p>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            "These 14 students have been stuck in 'Offer Letter' stage for 10+ days. Follow up immediately."
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProcessInsights;
