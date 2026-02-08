import Link from 'next/link';
import { useContext, useMemo, useEffect, useState } from 'react';
import { DataContext } from '@/context/DataContext';
import MetricCard from '@/components/common/MetricCard';
import { calculateMarketingMetrics } from '@/utils/marketingMetrics';
import { calculateCallCenterMetrics } from '@/utils/callCenterMetrics';
import { calculateSalesMetrics } from '@/utils/salesMetrics';
import Modal from '@/components/common/Modal';
import { GrowthTrendChart, SourcePerformanceChart } from '@/components/dashboards/ceo/CEOCharts';

const AVG_FEE = 100000; // NPR estimate per Visa

export default function CEODashboard() {
    const context = useContext(DataContext);
    const {
        loading,
        marketingSpend,
        leads,
        callCenterData,
        salesData,
        dateRange,
        selectedSources
    } = context || {};

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalContent, setModalContent] = useState<any[]>([]);
    const [modalKeys, setModalKeys] = useState<string[]>([]);

    const metrics = useMemo(() => {
        if (!context || !dateRange) return null;

        const m = marketingSpend && leads ? calculateMarketingMetrics(marketingSpend, leads, dateRange, selectedSources!) : null;
        const c = callCenterData ? calculateCallCenterMetrics(callCenterData, dateRange, selectedSources!) : null;
        const s = salesData ? calculateSalesMetrics(salesData, dateRange) : null;

        return { m, c, s };
    }, [context, marketingSpend, leads, callCenterData, salesData, dateRange, selectedSources]);

    const handleCardClick = (type: string) => {
        if (!metrics) return;
        const { m, c, s } = metrics;
        let title = "";
        let data: any[] = [];
        let keys: string[] = [];

        if (type === 'spend' && m) {
            title = "Marketing Spend Breakdown";
            data = m.leaderboard.map(l => ({
                Source: l.src,
                Spend: `NPR ${l.spend.toLocaleString()}`,
                Leads: l.leads,
                "Cost/Lead": `NPR ${Math.round(l.cost)}`
            }));
        } else if (type === 'hot' && c) {
            title = "Hot Leads List";
            data = c.hotLeadsList.map(r => ({
                Name: r["Student Name"],
                Phone: r["Phone Number"],
                Source: r.Source,
                Rep: r.Rep
            }));
        } else if (type === 'leakage' && c) {
            title = "Leakage (Uncalled Leads)";
            data = c.leakageLeads.map(r => ({
                Name: r["Student Name"],
                Phone: r["Phone Number"],
                Source: r.Source,
                Date: new Date(r.Date).toLocaleDateString()
            }));
        } else if (type === 'visas' && s) {
            title = "Visas Granted This Period";
            data = s.grantedList.map(g => ({
                Student: g.name,
                Rep: g.rep,
                Date: new Date(g.date).toLocaleDateString()
            }));
        } else if (type === 'active' && s) {
            title = "Active Pipeline Files";
            // Aggregate all files from all stages
            data = s.stageStats.flatMap(st => st.files).map(f => ({
                ID: f['Client ID'],
                Name: f['Student Name'],
                Stage: f['Current Stage'] || f.Stage,
                Rep: f['Sales Rep'],
                "Stage Date": new Date(f['Stage Start Date'] || f.Date || "").toLocaleDateString()
            }));
        } else if (type === 'overdue' && s) {
            title = "Bottleneck Files (Overdue)";
            data = s.stageStats.flatMap(st => st.files.filter(f => {
                // Re-calculate overdue check simply
                const dateStr = f['Stage Start Date'] || f.Date || "";
                if (!dateStr) return false;
                const days = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
                return days > st.target;
            })).map(f => ({
                Name: f['Student Name'],
                Stage: f['Current Stage'],
                "Days Stuck": Math.floor((new Date().getTime() - new Date(f['Stage Start Date'] || f.Date || "").getTime()) / (1000 * 60 * 60 * 24)),
                Rep: f['Sales Rep']
            }));
        }

        if (data.length > 0) {
            setModalTitle(title);
            setModalContent(data);
            setModalKeys(Object.keys(data[0]));
            setIsModalOpen(true);
        }
    };

    if (!context) return null;

    if (loading && (!marketingSpend?.length && !callCenterData?.length && !salesData?.length)) {
        return <div className="p-12 text-center text-[#94A3B8]">Loading Executive View...</div>;
    }

    if (!metrics) return null;

    const { m, c, s } = metrics;

    // Financial Cals
    const spend = m?.totalSpend || 1; // avoid div by 0
    const activeCount = s ? s.repStats.reduce((acc, r) => acc + r.active, 0) : 0;

    return (
        <div className="p-4 space-y-4 h-full overflow-y-auto">
            <h2 className="text-lg font-bold text-white mb-2">Executive Overview</h2>

            {/* Financials & Peformers Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <MetricCard
                    icon="📉"
                    title="CAC"
                    value={`NPR ${s?.approvedCount ? Math.round(spend / s.approvedCount).toLocaleString() : '-'}`}
                    subtitle="Cost per Visa"
                    color="#A78BFA"
                    onClick={() => handleCardClick('spend')}
                />
                {/* Top Sales Rep */}
                <MetricCard
                    icon="🥇"
                    title="Top Sales Rep"
                    value={s && s.repStats.length > 0 ? s.repStats.reduce((prev, current) => (prev.approved > current.approved) ? prev : current).name : '-'}
                    subtitle={s && s.repStats.length > 0 ? `${Math.max(...s.repStats.map(r => r.approved))} Visas Granted` : 'No Data'}
                    color="#F59E0B"
                    onClick={() => handleCardClick('visas')}
                />
                {/* Top Caller */}
                <MetricCard
                    icon="🎧"
                    title="Top Caller"
                    value={c && c.repStats.length > 0 ? c.repStats.reduce((prev, current) => (prev.hot > current.hot) ? prev : current).name : '-'}
                    subtitle={c && c.repStats.length > 0 ? `${Math.max(...c.repStats.map(r => r.hot))} Hot Leads` : 'No Data'}
                    color="#10B981"
                    onClick={() => handleCardClick('hot')}
                />
                {/* Needs Attention (Low Stats) */}
                <MetricCard
                    icon="⚠️"
                    title="Needs Support"
                    value={s && s.repStats.length > 0 ? s.repStats.reduce((prev, current) => (prev.approved < current.approved) ? prev : current).name : '-'}
                    subtitle="Lowest Visa Count"
                    color="#EF4444"
                    onClick={() => handleCardClick('active')}
                />
            </div>

            {/* CHARTS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-[#1e293b]/50 border border-white/5 rounded-xl p-4">
                    <h3 className="text-base font-bold text-[#E5E7EB] mb-2">Growth Trend (Spend vs Visas)</h3>
                    <div className="h-[250px] w-full">
                        {metrics && (
                            <GrowthTrendChart
                                labels={s?.trendData.labels || []} // Use Sales labels as base (usually aligned)
                                spend={m?.trendData.spend || []}
                                visas={s?.trendData.visas || []}
                            />
                        )}
                    </div>
                </div>
                <div className="bg-[#1e293b]/50 border border-white/5 rounded-xl p-4">
                    <h3 className="text-base font-bold text-[#E5E7EB] mb-2">Visas by Source</h3>
                    <div className="h-[250px] w-full">
                        {metrics && s && (() => {
                            // Aggregate Visas by Source
                            const sourceCounts: Record<string, number> = {};
                            s.grantedList.forEach(g => {
                                const src = g.source || "Unknown";
                                sourceCounts[src] = (sourceCounts[src] || 0) + 1;
                            });
                            const labels = Object.keys(sourceCounts);
                            const data = Object.values(sourceCounts);

                            if (labels.length === 0) return <div className="text-center text-slate-500 pt-12">No Visas Granted Yet</div>;

                            return <SourcePerformanceChart labels={labels} data={data} />;
                        })()}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Marketing Highlights */}
                <MetricCard
                    icon="📢"
                    title="Marketing Spend"
                    value={m ? `NPR ${m.totalSpend.toLocaleString()}` : '-'}
                    subtitle="Total Ad Spend"
                    color="#22D3EE"
                    onClick={() => handleCardClick('spend')}
                />
                <MetricCard
                    icon="🎯"
                    title="Cost Per Qual Lead"
                    value={m ? `NPR ${Math.round(m.costPerQualLead)}` : '-'}
                    subtitle="Efficiency Metric"
                    color={m && m.costPerQualLead < 1000 ? "#22c55e" : "#FEBB2E"}
                    onClick={() => handleCardClick('spend')}
                />

                {/* Call Center Highlights */}
                <MetricCard
                    icon="🔥"
                    title="Hot Leads"
                    value={c ? c.hotLeads : '-'}
                    subtitle="Sales Ready"
                    color="#FEBB2E"
                    onClick={() => handleCardClick('hot')}
                />
                <MetricCard
                    icon="📞"
                    title="Leakage"
                    value={c ? `${c.leakage} Leads` : '-'}
                    subtitle="Needs Attention"
                    color="#FF3B57"
                    onClick={() => handleCardClick('leakage')}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Sales Highlights */}
                <MetricCard
                    icon="🏆"
                    title="Visas Granted"
                    value={s ? s.approvedCount : '-'}
                    subtitle="In Period"
                    color="#22c55e"
                    onClick={() => handleCardClick('visas')}
                />
                <MetricCard
                    icon="📈"
                    title="Success Rate"
                    value={s ? `${s.successRate}%` : '-'}
                    subtitle="Approval Rate"
                    color={s && s.successRate > 90 ? "#22c55e" : "#A78BFA"}
                    onClick={() => handleCardClick('visas')}
                />
                <MetricCard
                    icon="👥"
                    title="Active Clients"
                    value={activeCount}
                    subtitle="Total Pipeline"
                    color="#3b82f6"
                    onClick={() => handleCardClick('active')}
                />
                <MetricCard
                    icon="⚠️"
                    title="Overdue Stages"
                    value={s ? s.stageStats.reduce((acc, st) => acc + st.overdue, 0) : '-'}
                    subtitle="Bottlenecks"
                    color="#FF3B57"
                    onClick={() => handleCardClick('overdue')}
                />
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalTitle}
            >
                <div className="overflow-x-auto max-h-[60vh]">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-xs text-slate-400">Detailed breakdown of selected metric.</p>
                        <button
                            onClick={() => {
                                // Simple CSV export logic could go here
                                alert("Export feature coming soon!");
                            }}
                            className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-white transition-colors"
                        >
                            Export CSV
                        </button>
                    </div>
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-white/10 text-slate-400 text-xs uppercase">
                                {modalKeys.map(k => <th key={k} className="p-2">{k}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {modalContent.map((row, i) => (
                                <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                                    {modalKeys.map(k => (
                                        <td key={k} className="p-2 text-slate-300">{row[k]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {modalContent.length === 0 && (
                        <div className="p-4 text-center text-slate-500">No data available for this view.</div>
                    )}
                </div>
            </Modal>
        </div>
    );
}
