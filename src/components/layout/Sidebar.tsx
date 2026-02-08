'use client';

import { DashboardTab } from '@/app/page';
import { useContext, useState } from 'react';
import { DataContext } from '@/context/DataContext';
import { normalizeSource } from '@/utils/dataProcessing';

interface SidebarProps {
    activeTab: DashboardTab;
    setActiveTab: (tab: DashboardTab) => void;
}

const navItems: { id: DashboardTab; label: string; icon: string }[] = [
    { id: 'ceoview', label: 'CEO View', icon: '👁️' },
    { id: 'marketing', label: 'Marketing', icon: '📊' },
    { id: 'callcenter', label: 'Call Center', icon: '📞' },
    { id: 'salesvisa', label: 'Sales & Visa', icon: '✈️' }
];

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
    const context = useContext(DataContext);
    const [preset, setPreset] = useState('this_month');

    if (!context) return null;

    // Compute unique sources from data
    const availableSources = new Set<string>(["Facebook", "TikTok", "Walk-in", "Instagram", "Google", "Referral", "Unknown"]);
    if (context.leads) context.leads.forEach(l => availableSources.add(normalizeSource(l.Source)));
    if (context.marketingSpend) context.marketingSpend.forEach(s => availableSources.add(normalizeSource(s.Source)));

    // Sort sources: Standard ones first, then others alphabetically
    const standardOrder = ["Facebook", "TikTok", "Walk-in", "Instagram", "Google", "Referral", "Unknown"];
    const sortedSources = Array.from(availableSources).sort((a, b) => {
        const idxA = standardOrder.indexOf(a);
        const idxB = standardOrder.indexOf(b);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.localeCompare(b);
    });

    return (
        <aside className="w-[220px] bg-white/[0.02] border-r border-white/[0.05] flex flex-col overflow-y-auto">
            {/* Date Range Section */}
            <div className="p-4 border-b border-white/[0.05]">
                <div className="text-[12px] text-[#94A3B8] mb-2 mx-2 uppercase tracking-wide font-bold">
                    Date Range
                </div>
                <select
                    value={preset}
                    onChange={(e) => {
                        const val = e.target.value;
                        setPreset(val);
                        if (!context) return;

                        const now = new Date();
                        let start = new Date();
                        let end = new Date();

                        if (val === 'this_month') {
                            start = new Date(now.getFullYear(), now.getMonth(), 1);
                            end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                        } else if (val === 'last_month') {
                            start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                            end = new Date(now.getFullYear(), now.getMonth(), 0);
                        } else if (val === 'all_time') {
                            start = new Date(2020, 0, 1); // Way back
                            end = new Date(2030, 11, 31); // Way forward
                        }

                        // If custom, don't update dateRange immediately (wait for inputs)
                        if (val !== 'custom') {
                            context.setDateRange({ start, end });
                        }
                    }}
                    className="w-full bg-[#1e293b] border border-white/[0.18] rounded-xl px-3 py-2.5 text-[#E5E7EB] outline-none font-bold text-sm"
                >
                    <option value="custom" className="bg-[#1e293b] text-white">Custom</option>
                    <option value="this_month" className="bg-[#1e293b] text-white">This Month</option>
                    <option value="last_month" className="bg-[#1e293b] text-white">Last Month</option>
                    <option value="all_time" className="bg-[#1e293b] text-white">All Time</option>
                </select>

                <div className="flex gap-2.5 mt-2.5">
                    <div className="flex-1">
                        <div className="text-[11px] text-[#94A3B8] mb-1.5 mx-1.5">Start</div>
                        <input
                            type="date"
                            style={{ colorScheme: 'dark' }}
                            className="w-full bg-[#1e293b] border border-white/[0.18] rounded-xl px-2.5 py-2 text-[#E5E7EB] outline-none font-extrabold text-sm"
                        />
                    </div>
                    <div className="flex-1">
                        <div className="text-[11px] text-[#94A3B8] mb-1.5 mx-1.5">End</div>
                        <input
                            type="date"
                            style={{ colorScheme: 'dark' }}
                            className="w-full bg-[#1e293b] border border-white/[0.18] rounded-xl px-2.5 py-2 text-[#E5E7EB] outline-none font-extrabold text-sm"
                        />
                    </div>
                </div>

                <div className="text-[11px] text-[#64748B] mt-3 mx-2 leading-relaxed">
                    Spend data is monthly. If you pick Feb 1–Feb 4, spend will include the month bucket that falls inside the range.
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full text-left px-4 py-2.5 mb-1 flex items-center gap-2.5 transition-all ${activeTab === item.id
                            ? 'bg-[#22D3EE]/10 text-[#22D3EE] font-bold border-r-2 border-[#22D3EE]'
                            : 'text-[#E5E7EB] hover:bg-white/[0.04] font-medium'
                            }`}
                    >
                        <span className="text-base">{item.icon}</span>
                        <span className="text-sm">{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Source Filter */}
            <div className="p-4 border-t border-white/[0.05]">
                <div className="text-[12px] text-[#94A3B8] mb-3 uppercase tracking-wide font-bold">
                    Source Filter
                </div>
                {sortedSources.map((source) => (
                    <label key={source} className="flex items-center gap-2 mb-2 cursor-pointer hover:bg-white/[0.02] p-1 rounded">
                        <input
                            type="checkbox"
                            checked={context.selectedSources.has(source)}
                            onChange={() => context.toggleSource(source)}
                            className="w-4 h-4 rounded border-white/[0.18] bg-white/[0.035] text-[#22D3EE] focus:ring-0 focus:ring-offset-0"
                        />
                        <span className="text-sm text-[#E5E7EB]">{source}</span>
                    </label>
                ))}
            </div>

            {/* Data Source Info */}
            <div className="p-4 border-t border-white/[0.05] text-[11px] text-[#64748B]">
                Data sources: Google Sheets (CSV)
            </div>
        </aside>
    );
}
