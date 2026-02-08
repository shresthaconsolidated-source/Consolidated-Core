import { useContext, useMemo, useState } from 'react';
import { DataContext } from '@/context/DataContext';
import MetricCard from '@/components/common/MetricCard';
import QualityRatioChart from '@/components/charts/QualityRatioChart';
import TargetGauge from '@/components/charts/TargetGauge';
import LeaderboardTable from '@/components/dashboards/marketing/LeaderboardTable';
import { calculateMarketingMetrics } from '@/utils/marketingMetrics';
import { normalizeSource } from '@/utils/dataProcessing';
import Modal from '@/components/common/Modal'; // Assuming generic Modal exists

export default function MarketingDashboard() {
    const context = useContext(DataContext);
    const { loading, marketingSpend, leads, callCenterData, dateRange, selectedSources } = context || {};

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalContent, setModalContent] = useState<any[]>([]);
    const [modalKeys, setModalKeys] = useState<string[]>([]);

    // DEBUG LOGS
    if (context && !loading) {
        console.log("MarketingDashboard Render:", {
            range: dateRange,
            spendCount: marketingSpend?.length,
            leadsCount: leads?.length,
            ccCount: callCenterData?.length
        });
    }

    const metrics = useMemo(() => {
        if (!context || !marketingSpend || !leads) return null;
        return calculateMarketingMetrics(
            marketingSpend,
            leads,
            dateRange!,
            selectedSources!,
            callCenterData // Pass CC data
        );
    }, [context, marketingSpend, leads, callCenterData, dateRange, selectedSources]);

    const handleOpenDetails = (type: string, filterSource?: string) => {
        if (!metrics) return;

        let title = "";
        let rows: any[] = [];
        let keys: string[] = [];

        if (type === 'spend') {
            title = "Expense Details";
            rows = metrics.filteredSpend || [];
            if (filterSource) {
                rows = rows.filter(r => normalizeSource(r.Source) === filterSource);
                title += ` - ${filterSource}`;
            }
            if (rows.length > 0) keys = Object.keys(rows[0]);
            else keys = ["Month", "Source", "Amount Spent (NPR)"]; // Default keys
        } else if (type === 'leads' || type === 'qualified' || type === 'junk') {
            title = type === 'leads' ? "Total Leads Details" : (type === 'qualified' ? "Qualified Leads" : "Junk Leads");
            rows = metrics.combinedLeads || [];

            if (type === 'qualified') {
                rows = rows.filter(r => {
                    // Logic from marketingMetrics.ts: Qualified = NOT Disqualified
                    const stage = (r['Stage'] || "").trim().toLowerCase();
                    const isDisqualified = stage === 'disqualified' || stage === 'unqualified';
                    return !isDisqualified;
                });
            } else if (type === 'junk') {
                rows = rows.filter(r => {
                    const stage = (r['Stage'] || "").trim().toLowerCase();
                    return stage === 'disqualified' || stage === 'unqualified';
                });
            }

            if (filterSource) {
                // Must normalize source to match what we passed in
                rows = rows.filter(r => normalizeSource(r.Source) === filterSource);
                title += ` - ${filterSource}`;
            }

            if (rows.length > 0) keys = Object.keys(rows[0]);
            else keys = ["Date", "Client ID", "Student Name", "Phone Number", "Source", "Status"];
        } else if (type === 'cpl') {
            // Show Spend vs Leads table?
            // Use Leaderboard data?
            title = "Cost Per Lead Analysis";
            rows = metrics.leaderboard;
            keys = ["src", "spend", "leads", "cost"];
        }

        setModalTitle(title);
        setModalContent(rows);
        setModalKeys(keys);
        setIsModalOpen(true);
    };

    if (!context) return null;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-[#94A3B8]">
                Loading Marketing Data...
            </div>
        );
    }

    if (!metrics) return null;

    return (
        <div className="p-6 space-y-6">
            {/* Top Metrics Grid */}
            <div className="grid grid-cols-4 gap-4">
                <MetricCard
                    icon="💰"
                    title="Total Ad Spend"
                    value={`NPR ${metrics.totalSpend.toLocaleString()}`}
                    subtitle="All Channels"
                    color="#22D3EE"
                    onClick={() => handleOpenDetails('spend')}
                />
                <MetricCard
                    icon="📊"
                    title="Total Leads"
                    value={metrics.totalLeads}
                    subtitle="Generated"
                    color="#39FF88"
                    onClick={() => handleOpenDetails('leads')}
                />
                <MetricCard
                    icon="✅"
                    title="Qualified Leads"
                    value={metrics.qualifiedLeads}
                    subtitle="High Quality"
                    color="#FEBB2E"
                    onClick={() => handleOpenDetails('qualified')}
                />
                <MetricCard
                    icon="💵"
                    title="Cost Per Lead"
                    value={`NPR ${Math.round(metrics.costPerLead)}`}
                    subtitle={`CPL (Qual: NPR ${Math.round(metrics.costPerQualLead)})`}
                    color="#FF3B57"
                    onClick={() => handleOpenDetails('cpl')}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
                {/* Quality Ratio Chart */}
                <div className="card flex flex-col h-full bg-[#1e293b]/50 border border-white/5 rounded-xl p-4">
                    <h3 className="text-lg font-bold text-white mb-1">Quality Ratio by Source</h3>
                    <p className="text-xs text-slate-400 mb-4">Qualified vs Junk Leads</p>
                    <div className="flex-1 w-full min-h-0 relative">
                        <QualityRatioChart
                            data={metrics.leaderboard}
                            openDetails={(type, label) => handleOpenDetails(type, label)}
                        />
                    </div>
                </div>

                {/* Lead Source Leaderboard */}
                <div className="card flex flex-col h-full bg-[#1e293b]/50 border border-white/5 rounded-xl p-4">
                    <h3 className="text-lg font-bold text-white mb-1">Lead Source Leaderboard</h3>
                    <p className="text-xs text-slate-400 mb-4">Spend vs Cost/Qual Lead</p>
                    <div className="flex-1 overflow-auto">
                        <LeaderboardTable
                            data={metrics.leaderboard}
                            onRowClick={(src) => handleOpenDetails('leads', src)}
                        />
                    </div>
                </div>
            </div>

            {/* Target Gauges */}
            <div className="card flex flex-row flex-wrap justify-around items-center py-6 bg-[#1e293b]/50 border border-white/5 rounded-xl gap-4">
                <TargetGauge
                    title="Monthly Target"
                    actual={metrics.targets.tMonth.actual}
                    target={metrics.targets.tMonth.target}
                    pct={metrics.targets.tMonth.pct}
                    color="#22D3EE"
                />
                <TargetGauge
                    title="Quarterly Target"
                    actual={metrics.targets.tQuarter.actual}
                    target={metrics.targets.tQuarter.target}
                    pct={metrics.targets.tQuarter.pct}
                    color="#A78BFA"
                />
                <TargetGauge
                    title="Yearly Target"
                    actual={metrics.targets.tYear.actual}
                    target={metrics.targets.tYear.target}
                    pct={metrics.targets.tYear.pct}
                    color="#F472B6"
                />
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
