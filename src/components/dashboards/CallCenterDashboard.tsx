'use client';

import { useContext, useMemo, useState } from 'react';
import { DataContext } from '@/context/DataContext';
import MetricCard from '@/components/common/MetricCard';
import RepStatusChart from '@/components/charts/RepStatusChart';
import PerformanceSummaryTable from '@/components/dashboards/callcenter/PerformanceSummaryTable';
import LossReasonChart from '@/components/charts/LossReasonChart';
import SourcePerformanceChart from '@/components/charts/SourcePerformanceChart';
import TrendChart from '@/components/charts/TrendChart';
import { calculateCallCenterMetrics } from '@/utils/callCenterMetrics';
import Modal from '@/components/common/Modal';

export default function CallCenterDashboard() {
    const context = useContext(DataContext);
    const { loading, callCenterData, dateRange, selectedSources } = context || {};

    const [activeTab, setActiveTab] = useState<'summary' | 'analytics'>('summary');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalContent, setModalContent] = useState<any[]>([]);
    const [modalKeys, setModalKeys] = useState<string[]>([]);

    const metrics = useMemo(() => {
        if (!context || !callCenterData) return null;
        return calculateCallCenterMetrics(
            callCenterData,
            dateRange!,
            selectedSources!
        );
    }, [context, callCenterData, dateRange, selectedSources]);

    const handleOpenDetails = (type: string, arg1?: string, arg2?: string) => {
        if (!metrics) return;

        let title = "";
        let rows: any[] = [];
        let keys: string[] = [];

        if (type === 'leakage') {
            title = "Leakage Details (Uncalled/New)";
            rows = metrics.leakageLeads || [];
        } else if (type === 'total') {
            title = "Total Calls Details";
            rows = metrics.filteredCalls || [];
        } else if (type === 'hot') {
            title = "Hot Leads Details";
            rows = metrics.hotLeadsList || [];
        } else if (type === 'rep_status' && arg1 && arg2) {
            title = `${arg1} - ${arg2} Leads`;
            rows = metrics.filteredCalls.filter(r => (r.Rep === arg1) && (r.Stage || "").trim() === arg2);
        } else if (type === 'rep_summary' && arg1) {
            title = `${arg1} - Total Calls`;
            rows = metrics.filteredCalls.filter(r => r.Rep === arg1);
        } else if (type === 'reverted') {
            title = "Reverted Clients";
            rows = []; // Proactively handled in metrics if needed
        }
        // Analytics Drill Downs
        else if (type === 'loss_reason' && arg1) {
            title = `Loss Reason: ${arg1}`;
            rows = metrics.lostLeadsList.filter(r => {
                const reason = r['Loss Reason'] || r.Status || 'Not Specified';
                return reason === arg1;
            });
        } else if (type === 'source_hot' && arg1) {
            title = `Hot Leads from ${arg1}`;
            // We need to filter by Source from hotLeadsList
            // Note: metrics.hotLeadsList is already filtered by Date
            rows = metrics.hotLeadsList.filter(r => {
                // We need to normalize source to match the chart key
                // Import normalizeSource? Or just loose match. 
                // Best to basic match or assume normalizeSource usage in chart generation
                const s = (r.Source || "").toLowerCase();
                const target = arg1.toLowerCase();
                if (target === 'facebook') return s.includes('facebook') || s.includes('fb');
                return s.includes(target) || (target === 'unknown' && (s === 'other' || s === ''));
            });
        } else if (type === 'trend_month' && arg1) {
            title = `Hot Leads - ${arg1}`; // arg1 is YYYY-MM
            // Trend uses UNFILTERED data, so we filter full callCenterData
            // But metrics doesn't expose full data easily? 
            // We can filter from metrics.filteredCalls IF the date range covers it.
            // BUT trend chart shows 6 months, which might be outside selected date range.
            // So we should use callCenterData from context.
            if (callCenterData) {
                rows = callCenterData.filter(r => {
                    const d = new Date(r.Date); // Simple parse, maybe incomplete
                    if (isNaN(d.getTime())) return false; // Improve parsing if needed
                    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                    return key === arg1 && (r.Stage || "").trim() === "Hot";
                });
            }
        }

        if (rows.length > 0) {
            keys = Object.keys(rows[0]).filter(k => !k.startsWith('_'));
        } else {
            keys = ["Date", "Client ID", "Student Name", "Phone Number", "Source", "Status", "Stage", "Rep"];
        }

        setModalTitle(title);
        setModalContent(rows);
        setModalKeys(keys);
        setIsModalOpen(true);
    };

    if (!context) return null;

    if (loading && (!callCenterData || callCenterData.length === 0)) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-[#94A3B8]">
                Loading Call Center Data...
            </div>
        );
    }

    if (!metrics) return null;

    const dayDiff = Math.max(1, (dateRange!.end.getTime() - dateRange!.start.getTime()) / (1000 * 60 * 60 * 24));

    return (
        <div className="h-full flex flex-col gap-3 p-3 overflow-hidden">
            {/* Tabs & KPIs Row - Compact */}
            <div className="flex-none flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <div className="flex space-x-1 bg-white/5 p-0.5 rounded-lg">
                        <button
                            onClick={() => setActiveTab('summary')}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${activeTab === 'summary'
                                ? 'bg-[#3B82F6] text-white shadow-lg'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            Summary
                        </button>
                        <button
                            onClick={() => setActiveTab('analytics')}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${activeTab === 'analytics'
                                ? 'bg-[#3B82F6] text-white shadow-lg'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            Analytics
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-3 h-[85px]">
                    <MetricCard
                        icon="📞" title="Leakage" value={`${metrics.leakage}`} subtitle="Leads Uncalled" color="#FF3B57"
                        onClick={() => handleOpenDetails('leakage')}
                    />
                    <MetricCard
                        icon="📊" title="Total Calls" value={metrics.totalCalls.toLocaleString()} subtitle="Selected Period" color="#E5E7EB"
                        onClick={() => handleOpenDetails('total')}
                    />
                    <MetricCard
                        icon="🔄" title="Reverted" value={metrics.reverted} subtitle="Active Again" color="#E5E7EB"
                        onClick={() => handleOpenDetails('reverted')}
                    />
                    <MetricCard
                        icon="🔥" title="Total Hot" value={metrics.hotLeads} subtitle="Stage = Hot" color="#FEBB2E"
                        onClick={() => handleOpenDetails('hot')}
                    />
                </div>
            </div>

            {/* Main Content Area - Fills remaining height */}
            <div className="flex-1 min-h-0 relative">
                {activeTab === 'summary' && (
                    <div className="h-full flex flex-col gap-3">
                        {/* Middle Row: Chart & Top Reps (Fixed Height or Ratio) */}
                        <div className="h-[45%] grid grid-cols-12 gap-3 shrink-0">
                            {/* Left: Status Breakdown (70%) */}
                            <div className="col-span-8 card bg-[#1e293b]/50 border border-white/5 rounded-xl p-3 flex flex-col min-h-0">
                                <h3 className="text-base font-bold text-white mb-2 shrink-0">Status Breakdown</h3>
                                <div className="flex-1 w-full min-h-0 relative">
                                    <RepStatusChart
                                        data={metrics.repStats}
                                        onBarClick={(rep, stage) => handleOpenDetails('rep_status', rep, stage)}
                                    />
                                </div>
                            </div>

                            {/* Right: Top Call Reps (30%) */}
                            <div className="col-span-4 card flex flex-col bg-[#1e293b]/50 border border-white/5 rounded-xl p-3 min-h-0">
                                <h3 className="text-base font-bold text-white mb-2 shrink-0">Top Call Reps</h3>
                                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                                    {metrics.repStats.slice(0, 5).map((rep, i) => (
                                        <div
                                            key={rep.name}
                                            onClick={() => handleOpenDetails('rep_summary', rep.name)}
                                            className="flex items-center justify-between p-2 bg-white/[0.03] rounded-lg border border-white/[0.05] cursor-pointer hover:bg-white/[0.05]"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '👤'}</span>
                                                <span className="font-bold text-[#E5E7EB] text-sm">{rep.name}</span>
                                            </div>
                                            <div className="font-black text-base text-[#E5E7EB]">{rep.total}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Row: Performance Table (Fills remaining) */}
                        <div className="flex-1 card flex flex-col bg-[#1e293b]/50 border border-white/5 rounded-xl p-0 min-h-0 overflow-hidden">
                            <div className="p-3 text-base font-bold text-white shrink-0 border-b border-white/5">Performance Summary</div>
                            <PerformanceSummaryTable
                                data={metrics.repStats}
                                dayDiff={dayDiff}
                                onRowClick={(rep) => handleOpenDetails('rep_summary', rep)}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="h-full grid grid-cols-2 gap-3 grid-rows-2">
                        {/* Loss Reasons */}
                        <div className="card bg-[#1e293b]/50 border border-white/5 rounded-xl p-3 flex flex-col min-h-0">
                            <h3 className="text-sm font-bold text-white mb-1 shrink-0">❌ Loss Reasons</h3>
                            <div className="flex-1 min-h-0 relative">
                                <LossReasonChart
                                    data={metrics.lossReasons}
                                    onSliceClick={(reason) => handleOpenDetails('loss_reason', reason)}
                                />
                            </div>
                        </div>

                        {/* Hot Leads by Source */}
                        <div className="card bg-[#1e293b]/50 border border-white/5 rounded-xl p-3 flex flex-col min-h-0">
                            <h3 className="text-sm font-bold text-white mb-1 shrink-0">🔥 Hot Leads by Source</h3>
                            <div className="flex-1 min-h-0 relative">
                                <SourcePerformanceChart
                                    data={metrics.hotBySource}
                                    onBarClick={(source) => handleOpenDetails('source_hot', source)}
                                />
                            </div>
                        </div>

                        {/* Hot Leads Trend */}
                        <div className="card bg-[#1e293b]/50 border border-white/5 rounded-xl p-3 flex flex-col min-h-0 col-span-2">
                            <h3 className="text-sm font-bold text-white mb-1 shrink-0">📈 Hot Leads Trend (Last 6 Months)</h3>
                            <div className="flex-1 min-h-0 relative">
                                <TrendChart
                                    data={metrics.trendData}
                                    onPointClick={(dateKey) => handleOpenDetails('trend_month', dateKey)}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Generic Modal for Drill Down */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalTitle}
            >
                <div className="overflow-x-auto max-h-[60vh]">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-white/10">
                                {modalKeys.map(k => (
                                    <th key={k} className="p-2 font-semibold text-slate-400">{k}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {modalContent.map((row, i) => (
                                <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                                    {modalKeys.map(k => (
                                        <td key={k} className="p-2 text-slate-200">
                                            {typeof row[k] === 'object' ? JSON.stringify(row[k]) : row[k]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {modalContent.length === 0 && (
                        <div className="p-4 text-center text-slate-500">No data found</div>
                    )}
                </div>
            </Modal>
        </div>
    );
}
