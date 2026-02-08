import { RepStats } from '@/utils/callCenterMetrics';

interface PerformanceSummaryTableProps {
    data: RepStats[];
    dayDiff: number;
    onRowClick?: (repName: string) => void;
}

export default function PerformanceSummaryTable({ data, dayDiff, onRowClick }: PerformanceSummaryTableProps) {
    return (
        <div className="flex-1 w-full overflow-hidden flex flex-col h-full">
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-[#1e293b] z-10">
                        <tr>
                            <th className="p-3 text-xs font-bold text-slate-400 border-b border-white/10">Rep Name</th>
                            <th className="p-3 text-xs font-bold text-slate-400 border-b border-white/10 text-right">Total Calls</th>
                            <th className="p-3 text-xs font-bold text-slate-400 border-b border-white/10 text-right">Avg/Day</th>
                            <th className="p-3 text-xs font-bold text-[#FEBB2E] border-b border-white/10 text-right">🔥 Hot</th>
                            <th className="p-3 text-xs font-bold text-[#28C840] border-b border-white/10 text-right">✅ Warm</th>
                            <th className="p-3 text-xs font-bold text-[#38BDF8] border-b border-white/10 text-right">❄️ Cold</th>
                            <th className="p-3 text-xs font-bold text-[#FF5F57] border-b border-white/10 text-right">❌ Lost</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-slate-200">
                        {data.map((rep) => (
                            <tr
                                key={rep.name}
                                onClick={() => onRowClick && onRowClick(rep.name)}
                                className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                            >
                                <td className="p-3 font-medium">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                                            {rep.name.charAt(0)}
                                        </div>
                                        {rep.name}
                                    </div>
                                </td>
                                <td className="p-3 text-right font-bold">{rep.total}</td>
                                <td className="p-3 text-right text-slate-400">
                                    {(rep.total / dayDiff).toFixed(1)}
                                </td>
                                <td className="p-3 text-right font-bold text-[#FEBB2E]">{rep.hot}</td>
                                <td className="p-3 text-right font-bold text-[#28C840]">{rep.warm}</td>
                                <td className="p-3 text-right font-bold text-[#38BDF8]">{rep.cold}</td>
                                <td className="p-3 text-right font-bold text-[#FF5F57]">{rep.lost}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
