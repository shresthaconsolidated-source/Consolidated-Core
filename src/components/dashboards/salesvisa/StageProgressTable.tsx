import { StageStats } from '@/utils/salesMetrics';

interface StageProgressTableProps {
    stages: StageStats[];
    onStageClick: (stage: string) => void;
}

export default function StageProgressTable({ stages, onStageClick }: StageProgressTableProps) {
    return (
        <div className="flex flex-col h-full overflow-hidden bg-[#1e293b]/50 border border-white/5 rounded-xl">
            <div className="p-4 border-b border-white/[0.05] font-bold bg-white/[0.02] text-[#E5E7EB] shrink-0">
                Stage Progress & Aging
            </div>
            <div className="grid grid-cols-[1.5fr_0.8fr_0.8fr_1fr] px-4 py-2 text-[11px] text-[#94A3B8] border-b border-white/[0.05] uppercase tracking-wide font-semibold shrink-0">
                <div>Status</div>
                <div>Files</div>
                <div>Target</div>
                <div>Overdue</div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {stages.map((s) => {
                    const isOverdue = s.overdue > 0;
                    return (
                        <div
                            key={s.stage}
                            onClick={() => onStageClick(s.stage)}
                            className={`grid grid-cols-[1.5fr_0.8fr_0.8fr_1fr] px-4 py-3 border-b border-white/[0.05] items-center text-xs cursor-pointer hover:bg-white/[0.02] transition-colors ${isOverdue ? 'bg-[#FF3B57]/5' : ''}`}
                        >
                            <div className="font-semibold text-[#E5E7EB] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }}></span>
                                {s.stage}
                            </div>
                            <div className="font-bold text-[#E5E7EB]">{s.count}</div>
                            <div className="text-[#94A3B8]">&lt; {s.target}d</div>
                            <div className={`flex items-center gap-1 font-bold ${isOverdue ? 'text-[#FF3B57]' : 'text-[#94A3B8]'}`}>
                                {s.overdue} {isOverdue && '⚠️'}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
