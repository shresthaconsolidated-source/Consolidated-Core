'use client';

import { DashboardTab } from '@/app/page';

const dashboardTitles: Record<DashboardTab, string> = {
    ceoview: 'CEO View',
    marketing: 'Marketing Dashboard',
    callcenter: 'Call Center',
    salesvisa: 'Sales & Visa'
};

interface HeaderProps {
    activeTab: DashboardTab;
}

export default function Header({ activeTab }: HeaderProps) {
    return (
        <div className="h-[54px] flex items-center justify-between px-[18px] bg-white/[0.03] backdrop-blur-[10px] border-b border-white/[0.05]">
            {/* Mac-style Traffic Lights */}
            <div className="flex gap-2 items-center">
                <span className="w-3 h-3 rounded-full bg-[#FF5F57]"></span>
                <span className="w-3 h-3 rounded-full bg-[#FEBB2E]"></span>
                <span className="w-3 h-3 rounded-full bg-[#28C840]"></span>
            </div>

            {/* Brand & Dashboard Title */}
            <div className="flex flex-col">
                <div className="text-[11px] font-bold text-[#E5E7EB] leading-[1.1]">
                    Consolidated Core
                </div>
                <div className="text-[7px] text-[#6B7280] mt-[1px] leading-[1]">
                    The Operating System for Nepal's Education Consultancies
                </div>
                <div className="text-[13px] text-[#60A5FA] mt-1 font-bold">
                    {dashboardTitles[activeTab]}
                </div>
            </div>

            {/* Placeholder for future actions */}
            <div className="flex gap-[10px] opacity-80">
                <div className="w-3 h-3"></div>
                <div className="w-3 h-3"></div>
                <div className="w-3 h-3"></div>
            </div>
        </div>
    );
}
