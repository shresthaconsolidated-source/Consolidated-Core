import { useContext, useMemo, useState } from 'react';
import { DataContext } from '@/context/DataContext';
import RepOverviewCard from '@/components/dashboards/salesvisa/RepOverviewCard';
import StageProgressTable from '@/components/dashboards/salesvisa/StageProgressTable';
import VisasGrantedList from '@/components/dashboards/salesvisa/VisasGrantedList';
import SuccessRateCard from '@/components/dashboards/salesvisa/SuccessRateCard';
import SalesTrendChart from '@/components/dashboards/salesvisa/SalesTrendChart';
import { calculateSalesMetrics } from '@/utils/salesMetrics';
import Modal from '@/components/common/Modal';
import MetricCard from '@/components/common/MetricCard';

export default function SalesVisaDashboard() {
    const context = useContext(DataContext);
    const { loading, salesData, callCenterData, dateRange } = context || {};

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalContent, setModalContent] = useState<any[]>([]);
    const [modalKeys, setModalKeys] = useState<string[]>([]);

    const presalesHot = useMemo(() => {
        if (!callCenterData || !dateRange) return 0;
        return callCenterData.filter(r => (r.Stage || "").trim() === "Hot").length;
    }, [callCenterData, dateRange]);

    const metrics = useMemo(() => {
        if (!context || !salesData || salesData.length === 0 || !dateRange) return null;
        return calculateSalesMetrics(salesData, dateRange);
    }, [context, salesData, dateRange]);

    const handleStageClick = (stageName: string) => {
        if (!metrics) return;
        const stageData = metrics.stageStats.find(s => s.stage === stageName);
        if (stageData) {
            setModalTitle(`${stageName} - ${stageData.count} Files`);
            setModalContent(stageData.files);
            setModalKeys(['Client ID', 'Student Name', 'Sales Rep', 'Stage Start Date']);
            setIsModalOpen(true);
        }
    };

    const handleMetricClick = (type: string) => {
        if (!metrics) return;
        let title = "";
        let data: any[] = [];
        let keys: string[] = [];

        if (type === 'hot') {
            title = "Presales Hot Leads (Call Center)";
            // We need to fetch hot leads from CallCenterData, simplest is to filter again or pass if available
            // Since we only calc count above, let's filter here
            if (callCenterData) {
                data = callCenterData.filter(r => (r.Stage || "").trim() === "Hot").map(r => ({
                    Name: r["Student Name"],
                    Phone: r["Phone Number"],
                    Source: r.Source,
                    Rep: r.Rep
                }));
            }
            keys = ['Name', 'Phone', 'Source', 'Rep'];
        } else if (type === 'active') {
            title = "Total Active Files (In Process)";
            data = salesData?.filter(r => (r.Outcome || "").trim() === "In Process") || [];
            keys = ['Client ID', 'Student Name', 'Sales Rep', 'Current Stage'];
        } else if (type === 'completed') {
            title = "Completed Files (Approved/Rejected)";
            data = salesData?.filter(r => {
                const out = (r.Outcome || "").trim();
                return out === "Completed";
            }) || [];
            keys = ['Client ID', 'Student Name', 'Sales Rep', 'Visa Outcome'];
        } else if (type === 'lost') {
            title = "Lost Files";
            data = salesData?.filter(r => (r.Outcome || "").trim() === "Lost") || [];
            keys = ['Client ID', 'Student Name', 'Sales Rep', 'Loss Reason'];
        } else if (type === 'dropped') {
            title = "Lacked / Dropped Files";
            data = salesData?.filter(r => {
                const out = (r.Outcome || "").trim();
                return out === "Dropped" || out === "Lacked";
            }) || [];
            keys = ['Client ID', 'Student Name', 'Sales Rep', 'Status'];
        }

        if (data.length > 0 || type === 'hot') { // Allow hot even if 0 if needed, but usually has data
            setModalTitle(title);
            setModalContent(data);
            setModalKeys(keys);
            setIsModalOpen(true);
        }
    };

    if (!context) return null;

    if (loading && (!salesData || salesData.length === 0)) {
        return <div className="p-12 text-center text-[#94A3B8]">Loading Sales Data...</div>;
    }

    if (!metrics) return null;

    return (
        <div className="h-full flex flex-col gap-3 p-3 overflow-hidden">
            {/* Row 1: KPI Cards (Compact) - Fixed Height */}
            <div className="flex-none grid grid-cols-5 gap-3 h-[85px]">
                <MetricCard
                    icon="🔥" title="Presales Hot" value={presalesHot} subtitle="Leads" color="#FEBB2E"
                    onClick={() => handleMetricClick('hot')}
                />
                <MetricCard
                    icon="⏳" title="In Process" value={metrics.totalActive} subtitle="Active Files" color="#22D3EE"
                    onClick={() => handleMetricClick('active')}
                />
                <MetricCard
                    icon="✅" title="Completed" value={metrics.approvedCount + metrics.rejectedCount} subtitle="Decisions" color="#22c55e"
                    onClick={() => handleMetricClick('completed')}
                />
                <MetricCard
                    icon="❌" title="Lost" value={metrics.totalLost} subtitle="Withdrawn" color="#FF3B57"
                    onClick={() => handleMetricClick('lost')}
                />
                <MetricCard
                    icon="🚨" title="Dropped" value={metrics.totalDropped} subtitle="No Sales" color="#F43F5E"
                    onClick={() => handleMetricClick('dropped')}
                />
            </div>

            {/* Row 2: Main Content Grid - Fills remaining height */}
            <div className="flex-1 min-h-0 grid grid-cols-12 gap-4">

                {/* Col 1: Rep Overview (Left) - Scrollable List */}
                <div className="col-span-3 bg-[#1e293b]/50 border border-white/5 rounded-xl flex flex-col overflow-hidden">
                    <div className="p-3 border-b border-white/5 font-bold text-[#E5E7EB] text-sm flex justify-between">
                        <span>Sales Reps</span>
                        <span className="text-xs text-slate-500 font-normal self-center">{salesData?.length} files</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                        {metrics.repStats.map((rep) => (
                            <RepOverviewCard key={rep.name} stats={rep} onClick={() => console.log(rep.name)} />
                        ))}
                    </div>
                </div>

                {/* Col 2: Pipeline & Trend (Middle) - Stacked */}
                <div className="col-span-6 flex flex-col gap-4 min-h-0">
                    {/* Top: Stage Progress Table - Scrollable Body */}
                    <div className="flex-[3] min-h-0 overflow-hidden">
                        <StageProgressTable stages={metrics.stageStats} onStageClick={handleStageClick} />
                    </div>

                    {/* Bottom: Sales Trend Chart */}
                    <div className="flex-[2] min-h-0 bg-[#1e293b]/50 border border-white/5 rounded-xl p-3 flex flex-col">
                        <div className="font-bold text-[#E5E7EB] text-sm mb-2 shrink-0">Sales Velocity (Last 6 Months)</div>
                        <div className="flex-1 w-full min-h-0 relative">
                            <SalesTrendChart labels={metrics.trendData.labels} leads={metrics.trendData.leads} visas={metrics.trendData.visas} />
                        </div>
                    </div>
                </div>

                {/* Col 3: Results (Right) - Stacked */}
                <div className="col-span-3 flex flex-col gap-4 min-h-0">
                    {/* Top: Success Rate */}
                    <div className="flex-none">
                        <SuccessRateCard rate={metrics.successRate} approved={metrics.approvedCount} rejected={metrics.rejectedCount} />
                    </div>

                    {/* Bottom: Visas Granted List - Scrollable */}
                    <div className="flex-1 min-h-0 overflow-hidden">
                        <VisasGrantedList grants={metrics.grantedList} />
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalTitle}
            >
                <div className="overflow-x-auto max-h-[60vh]">
                    <p className="text-xs text-slate-400 mb-4">* Showing files currently in this stage.</p>
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-white/10 text-slate-400 text-xs uppercase">
                                <th className="p-2">Client ID</th>
                                <th className="p-2">Student Name</th>
                                <th className="p-2">Rep</th>
                                <th className="p-2">Stage Date</th>
                                <th className="p-2">Days</th>
                            </tr>
                        </thead>
                        <tbody>
                            {modalContent.map((row, i) => {
                                const days = Math.floor((new Date().getTime() - new Date(row['Stage Start Date'] || row.Date).getTime()) / (1000 * 60 * 60 * 24));
                                return (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="p-2 text-slate-300">{row['Client ID']}</td>
                                        <td className="p-2 text-slate-200 font-medium">{row['Student Name']}</td>
                                        <td className="p-2 text-slate-400">{row['Sales Rep']}</td>
                                        <td className="p-2 text-slate-400">{new Date(row['Stage Start Date'] || row.Date).toLocaleDateString()}</td>
                                        <td className={`p-2 font-bold ${days > 14 ? 'text-red-400' : 'text-slate-300'}`}>{days}d</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    {modalContent.length === 0 && (
                        <div className="p-4 text-center text-slate-500">No active files in this stage.</div>
                    )}
                </div>
            </Modal>
        </div>
    );
}
