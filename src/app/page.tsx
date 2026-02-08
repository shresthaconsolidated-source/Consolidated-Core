'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MarketingDashboard from '@/components/dashboards/MarketingDashboard';
import CallCenterDashboard from '@/components/dashboards/CallCenterDashboard';
import SalesVisaDashboard from '@/components/dashboards/SalesVisaDashboard';
import CEODashboard from '@/components/dashboards/CEODashboard';

export type DashboardTab = 'ceoview' | 'marketing' | 'callcenter' | 'salesvisa';

export default function Home() {
    const [activeTab, setActiveTab] = useState<DashboardTab>('ceoview');

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar Navigation */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header with Date Picker */}
                <Header activeTab={activeTab} />

                {/* Dashboard Views - LAZY SWITCH PATTERN */}
                {/* All dashboards render simultaneously, visibility toggled with CSS */}
                <main className="flex-1 overflow-auto">
                    <div className={activeTab === 'ceoview' ? 'block' : 'hidden'}>
                        <CEODashboard />
                    </div>

                    <div className={activeTab === 'marketing' ? 'block' : 'hidden'}>
                        <MarketingDashboard />
                    </div>

                    <div className={activeTab === 'callcenter' ? 'block' : 'hidden'}>
                        <CallCenterDashboard />
                    </div>

                    <div className={activeTab === 'salesvisa' ? 'block' : 'hidden'}>
                        <SalesVisaDashboard />
                    </div>
                </main>
            </div>
        </div>
    );
}
