import React from 'react';
import {
    Users,
    Search,
    LayoutDashboard,
    Zap,
    ShieldCheck
} from 'lucide-react';

export default function ProcessRoadmap() {
    return (
        <section className="py-24 bg-slate-950 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">From Chaos to Control in 14 Days</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">A structured timeline to operational clarity.</p>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600/50 via-purple-600/50 to-blue-600/50 z-0"></div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
                        {[
                            {
                                step: "01",
                                title: "Engagement",
                                headline: "Select Your Tier",
                                text: "Choose the level of oversight your consultancy needs—from basic Dashboarding (Plan A) to Fractional CFO (Plan D).",
                                icon: Users,
                                color: "text-blue-400",
                                bg: "bg-blue-900/20",
                                border: "border-blue-500/30"
                            },
                            {
                                step: "02",
                                title: "Discovery",
                                headline: "Workflow Audit",
                                text: "We map your current data entry, identify commission leaks, and audit your existing Excel/CRM habits.",
                                icon: Search,
                                color: "text-purple-400",
                                bg: "bg-purple-900/20",
                                border: "border-purple-500/30"
                            },
                            {
                                step: "03",
                                title: "Deployment",
                                headline: "The Command Center",
                                text: "We configure your custom Dashboard. No complex software installation—just a clean, red-flag alert system.",
                                icon: LayoutDashboard,
                                color: "text-emerald-400",
                                bg: "bg-emerald-900/20",
                                border: "border-emerald-500/30"
                            },
                            {
                                step: "04",
                                title: "Alignment",
                                headline: "Staff Training",
                                text: "We train your counselors on the new \"6-Hour Protocol.\" They learn exactly what to log and why.",
                                icon: Zap,
                                color: "text-amber-400",
                                bg: "bg-amber-900/20",
                                border: "border-amber-500/30"
                            },
                            {
                                step: "05",
                                title: "Oversight",
                                headline: "Daily Control",
                                text: "The system goes live. We begin daily audits and send you the \"Weekly Truth\" report every Friday.",
                                icon: ShieldCheck,
                                color: "text-pink-400",
                                bg: "bg-pink-900/20",
                                border: "border-pink-500/30"
                            }
                        ].map((item, i) => (
                            <div key={i} className="group relative">
                                <div className="md:flex flex-col items-center text-center">
                                    {/* Icon Circle */}
                                    <div className={`w-24 h-24 rounded-full ${item.bg} ${item.border} border-2 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_-5px_rgba(0,0,0,0.5)] bg-slate-900`}>
                                        <item.icon className={`w-10 h-10 ${item.color}`} />
                                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white">
                                            {item.step}
                                        </div>
                                    </div>

                                    {/* Content Card */}
                                    <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 hover:bg-slate-800/50 transition-colors w-full min-h-[280px] flex flex-col backdrop-blur-sm">
                                        <div className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-2">{item.title}</div>
                                        <h3 className="text-lg font-bold text-white mb-3">{item.headline}</h3>
                                        <p className="text-sm text-slate-400 leading-relaxed">{item.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
