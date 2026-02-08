import { RepSalesStats } from '@/utils/salesMetrics';

interface RepOverviewCardProps {
    stats: RepSalesStats;
    onClick: () => void;
}

export default function RepOverviewCard({ stats, onClick }: RepOverviewCardProps) {
    const diffComp = stats.diffCompleted;
    const diffApp = stats.diffApproved;
    const diffRej = stats.diffRejected;

    const fmtDiff = (n: number) => n > 0 ? `+${n}` : (n < 0 ? `${n}` : "0");
    const colorDiff = (n: number) => n > 0 ? "text-[#28C840]" : (n < 0 ? "text-[#FF3B57]" : "text-[#94A3B8]");

    return (
        <div
            onClick={onClick}
            className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05] cursor-pointer hover:bg-white/[0.05] transition-all"
        >
            <div className="font-bold mb-2 text-sm text-[#E5E7EB]">{stats.name}</div>

            {/* Active (All Time) */}
            <div className="flex justify-between items-end mb-2">
                <div className="text-2xl text-[#3b82f6] font-bold leading-none">{stats.active}</div>
                <div className="text-right">
                    <div className="text-[10px] text-[#94A3B8] uppercase tracking-wide">Total Active</div>
                    <div className="text-[10px] text-[#94A3B8]">Files Handling</div>
                </div>
            </div>

            {/* Completed (In Period) */}
            <div className="flex justify-between items-end mb-2 pb-2 border-b border-white/[0.1]">
                <div className="text-2xl text-[#22c55e] font-bold leading-none">{stats.completed}</div>
                <div className="text-right">
                    <div className="text-[10px] text-[#94A3B8] uppercase tracking-wide">Completed</div>
                    <div className={`text-[10px] font-semibold ${colorDiff(diffComp)}`}>
                        {fmtDiff(diffComp)} <span className="text-[#94A3B8] font-normal">vs Prev</span>
                    </div>
                </div>
            </div>

            {/* Visas (In Period) */}
            <div className="space-y-0.5 text-[11px]">
                <div className="text-[#E5E7EB] flex justify-between">
                    <span>Visa Granted:</span>
                    <span>
                        <span className="text-[#22c55e] font-bold">{stats.approved}</span>
                        <span className="opacity-50 text-[10px] ml-1">({fmtDiff(diffApp)})</span>
                    </span>
                </div>
                <div className="text-[#E5E7EB] flex justify-between">
                    <span>Visa Rejected:</span>
                    <span>
                        <span className="text-[#FF3B57] font-bold">{stats.rejected}</span>
                        <span className="opacity-50 text-[10px] ml-1">({fmtDiff(diffRej)})</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
