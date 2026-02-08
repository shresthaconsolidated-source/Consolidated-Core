import { LeadRow, SpendRow, LeaderboardEntry, CallCenterRow } from '@/types/dashboard';
import { parseDateAny, normalizeSource, filterByDateRange, filterBySources } from './dataProcessing';

export interface MarketingMetrics {
    totalSpend: number;
    totalLeads: number;
    qualifiedLeads: number;
    junkLeads: number;
    costPerLead: number;
    costPerQualLead: number;
    leaderboard: LeaderboardEntry[];
    targets: any;
    combinedLeads: any[];
    filteredSpend: SpendRow[];
    trendData: {
        labels: string[];
        spend: number[];
    };
}

export function calculateMarketingMetrics(
    spendData: SpendRow[],
    leadsData: LeadRow[],
    dateRange: { start: Date; end: Date },
    selectedSources: Set<string>,
    callCenterData?: CallCenterRow[]
): MarketingMetrics {
    // DEBUG: Check keys
    if (spendData.length > 0) console.log("Spend Keys:", Object.keys(spendData[0]));
    if (leadsData.length > 0) console.log("Leads Keys:", Object.keys(leadsData[0]));

    // Filter data by date and source
    const filteredSpend = filterBySources(
        filterByDateRange(spendData, dateRange.start, dateRange.end, 'Month'),
        selectedSources
    );

    // Initial filter for Marketing Leads (by date)
    const marketingLeadsFiltered = filterBySources(
        filterByDateRange(leadsData, dateRange.start, dateRange.end, 'Date'),
        selectedSources
    );

    // Initial filter for Call Center Leads (by date)
    const callCenterFiltered = filterBySources(
        filterByDateRange(callCenterData || [], dateRange.start, dateRange.end, 'Date'),
        selectedSources
    );

    // LOGIC FROM INDEX.HTML (Lines 1303-1370)
    // 1. Marketing Leads
    // 2. Call Center Leads (only if Client ID unique)

    // Track unique Client IDs for "Total Leads" KPI
    // Note: index.html logic seemingly excludes leads without ID from the "Total Leads" count
    // but includes them in "Leaderboard" and "Table". We replicate this exactly.
    const clientIDs = new Set<string>();
    const bySourceCounts = new Map<string, number>(); // Tracks count for leaderboard (includes no-ID)
    const bySourceDisqualified = new Map<string, number>(); // Tracks disqualified for chart
    const combinedLeads: any[] = []; // For drill-down table

    let disconnectedLeadsCount = 0; // "Disqualified"
    let unknownSourceCount = 0;

    // Process Marketing Leads
    marketingLeadsFiltered.forEach(row => {
        const clientID = row['Client ID'] || row['ClientID'] || row['ID'];
        const src = normalizeSource(row.Source);
        const stage = (row['Stage'] || "").trim().toLowerCase();
        const isDisqualified = stage === 'disqualified' || stage === 'unqualified';
        const isUnknown = (src === 'Unknown' || src === 'Other');

        // Logic: specific handling for No ID vs ID
        if (clientID) {
            if (!clientIDs.has(clientID)) {
                clientIDs.add(clientID);
                // Count for leaderboard
                bySourceCounts.set(src, (bySourceCounts.get(src) || 0) + 1);
                combinedLeads.push({ ...row, _origin: 'Marketing' });

                if (isUnknown) unknownSourceCount++;
            }
        } else {
            // No Client ID -> Count for leaderboard/table, but NOT for KPI (per index.html)
            bySourceCounts.set(src, (bySourceCounts.get(src) || 0) + 1);
            combinedLeads.push({ ...row, _origin: 'Marketing' });
            if (isUnknown) unknownSourceCount++;
        }

        if (isDisqualified) {
            disconnectedLeadsCount++;
            bySourceDisqualified.set(src, (bySourceDisqualified.get(src) || 0) + 1);
        }
    });

    // Process Call Center Data (Merge)
    callCenterFiltered.forEach(row => {
        const clientID = row['Client ID'] || row['ClientID'] || row['ID'];
        const src = normalizeSource(row.Source || '');
        const stage = (row['Stage'] || "").trim().toLowerCase();
        const isDisqualified = stage === 'disqualified' || stage === 'unqualified';
        const isUnknown = (src === 'Unknown' || src === 'Other');

        if (clientID) {
            // Only add if NOT already in Marketing set
            if (!clientIDs.has(clientID)) {
                clientIDs.add(clientID);
                bySourceCounts.set(src, (bySourceCounts.get(src) || 0) + 1);
                combinedLeads.push({ ...row, _origin: 'Call Center' });

                if (isUnknown) unknownSourceCount++;
                if (isDisqualified) {
                    disconnectedLeadsCount++;
                    bySourceDisqualified.set(src, (bySourceDisqualified.get(src) || 0) + 1);
                }
            }
        }
        // index.html does NOT seem to handle Call Center rows without ID?
        // Line 1353: if (clientID && !clientIDsCurr.has(clientID))
        // So no-ID Call Center rows are IGNORED both for KPI and Leaderboard/Table.
    });

    // Calculate totals
    const totalSpend = filteredSpend.reduce((sum, row) => {
        const val = row['Amount Spent (NPR)'] || row['Amount Spent'] || row['Spend'] || 0;
        const num = typeof val === 'string' ? parseFloat(val.replace(/[^0-9.-]+/g, '')) : val;
        return sum + (isNaN(num) ? 0 : num);
    }, 0);

    const totalLeads = clientIDs.size; // Only unique IDs

    // Qualified = Total (per KPI logic) - Disqualified
    // Wait, index.html line 1374: qualifiedCurr = leadsCurr - disqualifiedCurr
    // leadsCurr is `clientIDs.size`.
    // disqualifiedCurr is counted from rows that match the filter.
    // So if a no-ID row is disqualified, it increments disqualifiedCurr.
    // But it didn't increment leadsCurr.
    // This could result in negative qualified leads if many no-ID rows are disqualified?
    // Let's check index.html again.
    // Line 1328: if (isDisqualified) disqualifiedCurr += 1; (Inside loop)
    // Yes, it counts disqualified even for no-ID rows.
    // We will replicate this logic.
    const qualifiedLeads = totalLeads - disconnectedLeadsCount;
    const junkLeads = disconnectedLeadsCount;

    // Use bySourceCounts for Leaderboard (includes no-ID marketing leads)
    const sourceMap = new Map<string, { spend: number; leads: number; qualLeads: number }>();

    // Init source map from bySourceCounts keys
    bySourceCounts.forEach((count, src) => {
        if (!sourceMap.has(src)) sourceMap.set(src, { spend: 0, leads: 0, qualLeads: 0 });
        sourceMap.get(src)!.leads = count;

        const disq = bySourceDisqualified.get(src) || 0;
        sourceMap.get(src)!.qualLeads = count - disq;
    });

    // Add Spend
    filteredSpend.forEach(row => {
        const src = normalizeSource(row.Source);
        if (!sourceMap.has(src)) sourceMap.set(src, { spend: 0, leads: 0, qualLeads: 0 });

        const val = row['Amount Spent (NPR)'] || row['Amount Spent'] || row['Spend'] || 0;
        const num = typeof val === 'string' ? parseFloat(val.replace(/[^0-9.-]+/g, '')) : val;
        sourceMap.get(src)!.spend += (isNaN(num) ? 0 : num);
    });

    // We don't have per-source qualified count easily with separate loops.
    // Logic in index.html (lines 1392-1397):
    // const leads = bySourceCurr.get(src) || 0;
    // const cost = leads > 0 ? (spend / leads) : 0;
    // It uses TOTAL leads (incl no-ID) for Cost Per Lead calculation explicitly.
    // My previous code calculated qualLeads per source. 
    // index.html leaderboard cols: Source, Spend, Cost/Qual Lead, Leads.
    // Wait! Header says "Cost/Qual Lead" (Line 1507).
    // Logic Line 1395: const cost = leads > 0 ? (spend / leads) : 0; -> This is Cost Per LEAD (Total), not Qualified?
    // User screenshot shows "COST/QUAL LEAD".
    // Does index.html implement it as output per *Qualified*?
    // Line 1395 is `spend / leads`.
    // So index.html says "Cost/Qual Lead" but calculates "Cost/Lead".
    // I will replicate the LOGIC (Cost/Lead), even if label is confusing.
    // Actually, I should probably stick to `spend / leads` to match numbers.

    // Also, qualLeads per source?
    // index.html doesn't seem to display qualified leads per source in the table.
    // It displays: Source, Spend, Cost, Leads.
    // So I don't need accurate per-source qualified count for the leaderboard.

    // Convert to leaderboard array
    const leaderboard: LeaderboardEntry[] = Array.from(sourceMap.entries())
        .map(([src, data]) => ({
            src,
            spend: data.spend,
            leads: data.leads,
            qualLeads: data.qualLeads,
            cost: data.leads > 0 ? data.spend / data.leads : 0
        }))
        .sort((a, b) => b.spend - a.spend);

    // Calculate targets (placeholder)
    const targets = {
        tMonth: { actual: qualifiedLeads, target: 100, pct: Math.min((qualifiedLeads / 100) * 100, 100) },
        tQuarter: { actual: qualifiedLeads, target: 300, pct: Math.min((qualifiedLeads / 300) * 100, 100) },
        tYear: { actual: qualifiedLeads, target: 1200, pct: Math.min((qualifiedLeads / 1200) * 100, 100) }
    };

    // Calculate Monthly Spend Trend
    const trendMap: Record<string, number> = {};
    const now = new Date();
    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        trendMap[key] = 0;
    }

    filteredSpend.forEach(row => {
        const d = parseDateAny(row.Month || row.Date);
        if (!d) return;
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (trendMap[key] !== undefined) { // Only count if in last 12 months range
            const val = row['Amount Spent (NPR)'] || row['Amount Spent'] || row['Spend'] || 0;
            const num = typeof val === 'string' ? parseFloat(val.replace(/[^0-9.-]+/g, '')) : val;
            trendMap[key] += (isNaN(num) ? 0 : num);
        }
    });

    const trendLabels = Object.keys(trendMap).sort();
    const trendData = {
        labels: trendLabels,
        spend: trendLabels.map(k => trendMap[k])
    };

    return {
        totalSpend,
        totalLeads, // KPI (Unique IDs)
        qualifiedLeads,
        junkLeads,
        costPerLead: totalLeads > 0 ? totalSpend / totalLeads : 0,
        costPerQualLead: qualifiedLeads > 0 ? totalSpend / qualifiedLeads : 0,
        leaderboard,
        targets,
        // Helper for modals
        combinedLeads,
        filteredSpend,
        trendData
    };
}
