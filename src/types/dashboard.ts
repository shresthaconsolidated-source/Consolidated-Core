export interface LeadRow {
    Date: string;
    Source: string;
    'Lead Quality'?: string;
    [key: string]: any;
}

export interface SpendRow {
    Month: string;
    Source: string;
    Spend: number;
    [key: string]: any;
}

export interface LeaderboardEntry {
    src: string;
    spend: number;
    leads: number;
    qualLeads: number;
    cost: number;
}

export interface MarketingMetrics {
    totalSpend: number;
    totalLeads: number;
    qualifiedLeads: number;
    junkLeads: number;
    costPerLead: number;
    costPerQualLead: number;
    leaderboard: LeaderboardEntry[];
    targets: {
        tMonth: { actual: number; target: number; pct: number };
        tQuarter: { actual: number; target: number; pct: number };
        tYear: { actual: number; target: number; pct: number };
    };
    combinedLeads?: any[];
    filteredSpend?: SpendRow[];
}

export interface CallCenterRow {
    Date: string;
    Stage?: string;
    Status?: string;
    Source?: string;
    [key: string]: any;
}

export interface SalesRow {
    Date?: string;
    'Sales Assigned Date'?: string;
    'Stage Start Date'?: string;
    Status?: string;
    'Visa Status'?: string;
    Outcome?: string;
    'Visa Outcome'?: string;
    'Sales Rep'?: string;
    [key: string]: any;
}
