import { VisaGrant } from '@/utils/salesMetrics';

interface VisasGrantedListProps {
    grants: VisaGrant[];
}

export default function VisasGrantedList({ grants }: VisasGrantedListProps) {
    return (
        <div className="card flex flex-col h-full bg-[#1e293b]/50 border border-white/5 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/[0.05] flex justify-between items-center bg-[#22c55e]/5">
                <div>
                    <div className="text-[11px] text-[#94A3B8] uppercase tracking-wide">Visas Granted (In Period)</div>
                    <div className="text-2xl text-[#22c55e] font-bold leading-tight">{grants.length}</div>
                </div>
                <div className="text-2xl opacity-20">🏆</div>
            </div>
            <div className="flex-1 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-white/10">
                {grants.length > 0 ? (
                    grants.map((g, i) => (
                        <div key={i} className="px-4 py-3 border-b border-white/[0.05] flex justify-between items-center text-xs hover:bg-white/[0.02]">
                            <div>
                                <div className="font-semibold text-[#E5E7EB]">{g.name}</div>
                                <div className="text-[10px] text-[#94A3B8]">👤 {g.rep}</div>
                            </div>
                            <div className="text-[11px] text-[#94A3B8] bg-white/[0.05] px-1.5 py-0.5 rounded">
                                {new Date(g.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-5 text-center text-[#94A3B8] text-xs">No visas this period</div>
                )}
            </div>
        </div>
    );
}
