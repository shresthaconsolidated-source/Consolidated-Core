import { LeaderboardEntry } from '@/types/dashboard';
import { formatNPR } from '@/utils/dataProcessing';

interface LeaderboardTableProps {
    data: LeaderboardEntry[];
    onRowClick: (src: string) => void;
}

export default function LeaderboardTable({ data, onRowClick }: LeaderboardTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/[0.1]">
                        <th className="py-2 px-3 text-xs font-semibold text-[#94A3B8] uppercase">Source</th>
                        <th className="py-2 px-3 text-xs font-semibold text-[#94A3B8] uppercase">Spend</th>
                        <th className="py-2 px-3 text-xs font-semibold text-[#94A3B8] uppercase">Cost/Qual Lead</th>
                        <th className="py-2 px-3 text-xs font-semibold text-[#94A3B8] uppercase text-right">Leads</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, i) => {
                        const isStrong = row.src === 'Facebook'; // Highlight key sources if needed
                        return (
                            <tr
                                key={row.src}
                                onClick={() => onRowClick(row.src)}
                                className={`border-b border-white/[0.05] hover:bg-white/[0.02] cursor-pointer ${isStrong ? 'font-bold bg-white/[0.02]' : ''}`}
                            >
                                <td className="py-3 px-3 text-sm text-[#E5E7EB]">{row.src}</td>
                                <td className="py-3 px-3 text-sm text-[#94A3B8] font-mono">{formatNPR(row.spend)}</td>
                                <td className="py-3 px-3 text-sm text-[#FEBB2E] font-bold font-mono">{formatNPR(row.cost)}</td>
                                <td className="py-3 px-3 text-sm text-[#E5E7EB] font-bold text-right">{row.leads.toLocaleString()}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
