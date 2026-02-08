import { CallCenterRow } from '@/types/dashboard';
import { normalizeSource, filterByDateRange, filterBySources, parseDateAny } from './dataProcessing';

export interface RepStats {
    name: string;
    total: number;
    hot: number;
    warm: number;
    cold: number;
    lost: number;
    ineligible: number;
}

export interface CallCenterMetrics {
    totalCalls: number;
    leakage: number;
    reverted: number;
    hotLeads: number;
    repStats: RepStats[];
    filteredCalls: CallCenterRow[];
    leakageLeads: CallCenterRow[];
    hotLeadsList: CallCenterRow[];
    // Analytics
    lostLeadsList: CallCenterRow[];
    lossReasons: Record<string, number>;
    hotBySource: Record<string, number>;
    trendKeys: string[];
    trendMap: Record<string, { count: number; label: string }>;
    trendData: { dateKey: string; label: string; count: number }[];
}

export function calculateCallCenterMetrics(
    data: CallCenterRow[],
    dateRange: { start: Date; end: Date },
    selectedSources: Set<string>
): CallCenterMetrics {
    // Filter by Date (using 'Date' field)
    const dateFiltered = filterByDateRange(data, dateRange.start, dateRange.end, 'Date');

    // Filter by Source (optional, but consistent with other dashboards)
    const filtered = filterBySources(dateFiltered, selectedSources, 'Source');

    let leakage = 0;
    const reverted = 0; // Placeholder
    let hotLeads = 0;

    const leakageLeads: CallCenterRow[] = [];
    const hotLeadsList: CallCenterRow[] = [];

    const reps: Record<string, RepStats> = {};

    filtered.forEach(row => {
        // Leakage: Status is New, Uncalled, Pending, or Empty
        const status = (row.Status || "").toLowerCase();
        if (["new", "uncalled", "pending", ""].includes(status)) {
            leakage++;
            leakageLeads.push(row);
        }

        // Hot Leads: Stage is Hot
        const stage = (row.Stage || "").trim();
        if (stage === "Hot") {
            hotLeads++;
            hotLeadsList.push(row);
        }

        // Rep Stats
        const repName = row.Rep || "Unknown";
        if (!reps[repName]) {
            reps[repName] = { name: repName, total: 0, hot: 0, warm: 0, cold: 0, lost: 0, ineligible: 0 };
        }

        reps[repName].total++;

        if (stage === "Hot") reps[repName].hot++;
        else if (stage === "Warm") reps[repName].warm++;
        else if (stage === "Cold") reps[repName].cold++;
        else if (stage === "Lost") reps[repName].lost++;
        else reps[repName].ineligible++;
    });

    // Convert reps object to array and sort by total calls
    const repStats = Object.values(reps).sort((a, b) => b.total - a.total);

    // --- ANALYTICS METRICS ---

    // 1. Loss Reasons (from dateFiltered data)
    // Condition: Stage = Lost OR Visa Outcome = Lost
    const lostLeadsList: CallCenterRow[] = [];
    const lossReasons: Record<string, number> = {};

    filtered.forEach(row => {
        const stage = (row.Stage || "").trim();
        const outcome = (row["Visa Outcome"] || "").trim();

        if (stage === 'Lost' || outcome === 'Lost') {
            lostLeadsList.push(row);
            const reason = row['Loss Reason'] || row.Status || 'Not Specified';
            lossReasons[reason] = (lossReasons[reason] || 0) + 1;
        }
    });

    // 2. Hot Leads by Source (from filtered data)
    const hotBySource: Record<string, number> = {};
    hotLeadsList.forEach(row => {
        const src = normalizeSource(row.Source);
        hotBySource[src] = (hotBySource[src] || 0) + 1;
    });

    // 3. Trends (Last 6 months from NOW, ignoring selected date range)
    // We use 'data' (unfiltered input)
    const now = new Date();
    const trendMap: Record<string, { count: number; label: string }> = {};
    const trendKeys: string[] = [];

    // Init last 6 months
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        trendMap[key] = { count: 0, label: d.toLocaleString('default', { month: 'short' }) };
        trendKeys.push(key);
    }

    data.forEach(row => {
        let dt = new Date(row.Date);
        if (isNaN(dt.getTime())) dt = parseDateAny(row.Date);
        if (!dt || isNaN(dt.getTime())) return;

        const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
        if (trendMap[key]) {
            const stage = (row.Stage || "").trim();
            if (stage === "Hot") {
                trendMap[key].count++;
            }
        }
    });

    return {
        totalCalls: filtered.length,
        leakage,
        reverted,
        hotLeads,
        repStats,
        filteredCalls: filtered,
        leakageLeads,
        hotLeadsList,
        // Analytics
        lostLeadsList,
        lossReasons,
        hotBySource,
        trendKeys, // To ensure order
        trendMap,  // Data
        // Helper to get array
        trendData: trendKeys.map(k => ({ dateKey: k, label: trendMap[k].label, count: trendMap[k].count }))
    };
}
