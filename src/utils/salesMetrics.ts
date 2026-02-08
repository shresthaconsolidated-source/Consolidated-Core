import { SalesRow } from '@/types/dashboard';
import { filterByDateRange, parseDateAny } from './dataProcessing';

export interface RepSalesStats {
    name: string;
    active: number;
    completed: number; // In period
    approved: number;  // In period
    rejected: number;  // In period
    diffCompleted: number;
    diffApproved: number;
    diffRejected: number;
}

export interface StageStats {
    stage: string;
    count: number;
    overdue: number;
    target: number;
    color: string;
    files: SalesRow[]; // Added for drill-down
}

export interface VisaGrant {
    name: string;
    rep: string;
    source: string;
    date: string;
}

export interface SalesMetrics {
    repStats: RepSalesStats[];
    stageStats: StageStats[];
    grantedList: VisaGrant[];
    successRate: number;
    approvedCount: number;
    rejectedCount: number;
    trendData: {
        labels: string[];
        leads: number[];
        visas: number[];
    };
    totalActive: number;
    totalLost: number;
    totalDropped: number;
}

const STAGE_TARGETS: Record<string, number> = {
    "Offer Pending": 3,
    "GTE Review": 5,
    "COE Request": 4,
    "Visa Lodged": 7
};

function getColorForStage(s: string): string {
    if (s.includes("Offer")) return "#facc15";
    if (s.includes("GTE")) return "#3b82f6";
    if (s.includes("COE")) return "#8b5cf6";
    if (s.includes("Visa")) return "#ec4899";
    return "#94a3b8";
}

function calculateAging(dateStr: string): number {
    if (!dateStr) return 0;
    const start = parseDateAny(dateStr);
    if (!start) return 0;
    const now = new Date();
    return Math.max(0, Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
}

export function calculateSalesMetrics(
    data: SalesRow[],
    dateRange: { start: Date; end: Date }
): SalesMetrics {
    // 1. Filter data for CURRENT period
    if (!data || data.length === 0) {
        return {
            repStats: [],
            stageStats: [],
            grantedList: [],
            successRate: 0,
            approvedCount: 0,
            rejectedCount: 0,
            trendData: { labels: [], leads: [], visas: [] },
            totalActive: 0,
            totalLost: 0,
            totalDropped: 0
        };
    }

    const dateField = 'Status Date' in data[0] ? 'Status Date' : 'Date';
    const currentData = filterByDateRange(data, dateRange.start, dateRange.end, dateField);

    // 2. Rep Stats (Active is All Time, others are In Period)
    const repMap: Record<string, RepSalesStats> = {};

    // Calculate All-Time Active first
    data.forEach(row => {
        const rep = row['Sales Rep'] || "Unknown";
        if (!repMap[rep]) {
            repMap[rep] = { name: rep, active: 0, completed: 0, approved: 0, rejected: 0, diffCompleted: 0, diffApproved: 0, diffRejected: 0 };
        }

        // Active Logic: Outcome "In Process" OR Outcome "Completed" but Visa Outcome "Pending"?
        // Looking at data: Only "In Process" seems to be truly active. 
        // "Completed" usually means decision made (Approved/Rejected) or just done.
        // Let's use: Active = Outcome is "In Process" OR (Outcome is "Completed" AND Visa Outcome is empty/Pending)
        const outcome = (row.Outcome || "").trim().toLowerCase();
        const visaOutcome = (row['Visa Outcome'] || "").trim().toLowerCase();
        const status = (row.Status || "").trim().toLowerCase();

        // Revised Active Logic based on data inspection:
        // Rows with Outcome="In Process" have stages like "Offer Pending", "GTE Review". These are ACTIVE.
        // Rows with Outcome="Completed" have "Visa Outcome"="Approved"/"Rejected". These are DONE.
        // Rows with Outcome="Lost" or "Reverted". These are DEAD.

        if (outcome === "in process" || visaOutcome === "pending") {
            repMap[rep].active++;
        }
    });

    // Calculate In-Period Stats (Completed, Approved, Rejected)
    const grantedList: VisaGrant[] = [];
    let approvedCount = 0;
    let rejectedCount = 0;

    currentData.forEach(row => {
        const rep = row['Sales Rep'] || "Unknown";
        // Ensure rep exists in map if only appearing in current period
        if (!repMap[rep]) {
            repMap[rep] = { name: rep, active: 0, completed: 0, approved: 0, rejected: 0, diffCompleted: 0, diffApproved: 0, diffRejected: 0 };
        }

        const visaOutcome = (row['Visa Outcome'] || "").trim().toLowerCase();

        // Check for "Approved"
        if (visaOutcome === "approved" || visaOutcome === "granted") {
            repMap[rep].completed++;
            repMap[rep].approved++;
            approvedCount++;
            grantedList.push({
                name: row['Student Name'] || "Unknown",
                rep: rep,
                source: row.Source || "Unknown",
                date: row.Date || ""
            });
        }
        // Check for "Rejected"
        else if (visaOutcome === "rejected" || visaOutcome === "refused") {
            repMap[rep].completed++;
            repMap[rep].rejected++;
            rejectedCount++;
        }
    });

    // 3. Stage Stats (All Time / Snapshot)
    // Stages are active files.
    const stageMap: Record<string, StageStats> = {};
    Object.keys(STAGE_TARGETS).forEach(stage => {
        stageMap[stage] = { stage, count: 0, overdue: 0, target: STAGE_TARGETS[stage], color: getColorForStage(stage), files: [] };
    });

    data.forEach(row => {
        // Only count Active files for Stage Stats?
        // Usually yes.
        const outcome = (row.Outcome || "").trim().toLowerCase();
        if (outcome !== "in process") return;

        const currentStageRaw = (row['Current Stage'] || row.Stage || "").trim();

        // Find matching stage key (case-insensitive)
        const stageKey = Object.keys(stageMap).find(k => k.toLowerCase() === currentStageRaw.toLowerCase());

        if (stageKey && stageMap[stageKey]) {
            stageMap[stageKey].count++;
            stageMap[stageKey].files.push(row); // Add row to files list
            const dateVal = row['Stage Start Date'] || row.Date || "";
            if (calculateAging(dateVal) > stageMap[stageKey].target) {
                stageMap[stageKey].overdue++;
            }
        }
    });

    const stageStats = Object.values(stageMap);
    const repStats = Object.values(repMap).sort((a, b) => b.active - a.active);

    // 4. Trend Data (Monthly)
    // Group by Month: New Leads (Active) vs Visas (Granted)
    const trendMap: Record<string, { leads: number; visas: number }> = {};

    let totalActive = 0;
    let totalLost = 0;
    let totalDropped = 0;

    data.forEach(row => {
        const d = parseDateAny(row.Date);
        if (!d) return;
        const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (!trendMap[k]) trendMap[k] = { leads: 0, visas: 0 };

        trendMap[k].leads++;

        const visaOutcome = (row['Visa Outcome'] || "").trim().toLowerCase();
        if (visaOutcome === "approved" || visaOutcome === "granted") {
            trendMap[k].visas++;
        }

        // Summary Counts (All Time)
        const outline = (row.Outcome || "").trim().toLowerCase();
        if (outline === "in process") totalActive++;
        if (outline === "lost") totalLost++;
        if (outline === "dropped" || outline === "lacked") totalDropped++;
    });

    const sortedKeys = Object.keys(trendMap).sort().slice(-12); // Last 12 months
    const trendData = {
        labels: sortedKeys,
        leads: sortedKeys.map(k => trendMap[k].leads),
        visas: sortedKeys.map(k => trendMap[k].visas)
    };

    const totalDecided = approvedCount + rejectedCount;
    const successRate = totalDecided > 0 ? Math.round((approvedCount / totalDecided) * 100) : 0;

    return {
        repStats,
        stageStats,
        grantedList,
        successRate,
        approvedCount,
        rejectedCount,
        trendData,
        totalActive,
        totalLost,
        totalDropped
    };
}
