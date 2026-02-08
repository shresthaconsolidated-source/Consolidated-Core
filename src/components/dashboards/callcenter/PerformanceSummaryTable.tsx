import { RepStats } from '@/utils/callCenterMetrics';

interface PerformanceSummaryTableProps {
    data: RepStats[];
    dayDiff: number;
    onRowClick?: (repName: string) => void;
}

export default function PerformanceSummaryTable({ data, dayDiff, onRowClick }: PerformanceSummaryTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/[0.1]">
                        <th className="py-3 px-4 text-xs font-semibold text-[#94A3B8] uppercase">Rep Name</th>
                        <th className="py-3 px-4 text-xs font-semibold text-[#94A3B8] uppercase">Total Calls</th>
                        <th className="py-3 px-4 text-xs font-semibold text-[#94A3B8] uppercase">Avg/Day</th>
                        <th className="py-3 px-4 text-xs font-semibold text-[#FEBB2E] uppercase">🔥 Hot</th>
                        <th className="py-3 px-4 text-xs font-semibold text-[#28C840] uppercase">✅ Warm</th>
                        <th className="py-3 px-4 text-xs font-semibold text-[#38BDF8] uppercase">❄️ Cold</th>
                        <th className="py-3 px-4 text-xs font-semibold text-[#FF5F57] uppercase">❌ Lost</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr
                            key={row.name}
                            onClick={() => onRowClick && onRowClick(row.name)}
                            className="border-b border-white/[0.05] hover:bg-white/[0.02] cursor-pointer"
                        >
                            <td className="py-3 px-4 text-sm text-[#E5E7EB] font-bold">{row.name}</td>
                            <td className="py-3 px-4 text-sm text-[#E5E7EB] font-mono">{row.total}</td>
                            <td className="py-3 px-4 text-sm text-[#94A3B8] font-mono">{(row.total / dayDiff).toFixed(1)}</td>
                            <td className="py-3 px-4 text-sm text-[#FEBB2E] font-bold font-mono">{row.hot}</td>
                            <td className="py-3 px-4 text-sm text-[#28C840] font-bold font-mono">{row.warm}</td>
                            <td className="py-3 px-4 text-sm text-[#38BDF8] font-bold font-mono">{row.cold}</td>
                            <td className="py-3 px-4 text-sm text-[#FF5F57] font-bold font-mono">{row.lost}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
