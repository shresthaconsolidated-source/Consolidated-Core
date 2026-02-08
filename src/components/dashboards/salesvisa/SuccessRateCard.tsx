interface SuccessRateCardProps {
    rate: number;
    approved: number;
    rejected: number;
}

export default function SuccessRateCard({ rate, approved, rejected }: SuccessRateCardProps) {
    return (
        <div className="card flex flex-col h-[300px] bg-[#1e293b]/50 border border-white/5 rounded-xl p-6 justify-center">
            <div className="text-xs text-[#94A3B8] uppercase tracking-wide text-center">Visa Success Rate</div>
            <div className="flex items-baseline justify-center gap-2 mt-2 mb-6">
                <div className="text-5xl text-[#E5E7EB] font-bold">{rate}%</div>
                <div className="text-xs text-[#94A3B8]">of decisions</div>
            </div>
            <div className="flex gap-3">
                <div className="flex-1 bg-[#22c55e]/10 p-3 rounded-lg text-center border border-[#22c55e]/20">
                    <div className="text-lg font-bold text-[#22c55e]">{approved}</div>
                    <div className="text-[10px] text-[#94A3B8] uppercase">Granted</div>
                </div>
                <div className="flex-1 bg-[#FF3B57]/10 p-3 rounded-lg text-center border border-[#FF3B57]/20">
                    <div className="text-lg font-bold text-[#FF3B57]">{rejected}</div>
                    <div className="text-[10px] text-[#94A3B8] uppercase">Rejected</div>
                </div>
            </div>
        </div>
    );
}
