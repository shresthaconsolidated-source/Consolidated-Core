'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { parseCSV } from '@/utils/csvParser';

// API Endpoints (from original dashboard)
// API Endpoints (verified from index.html)
const MARKETING_SPEND_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT_6sdL4MsE0nUKfC_IyV0lbk9D81bYT3Z58ZPzk2HBE0MZX_pVjpQdMF_gKfJS_0tY6uDTHUvg8OIQ/pub?gid=1245492023&single=true&output=csv";
const LEADS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT_6sdL4MsE0nUKfC_IyV0lbk9D81bYT3Z58ZPzk2HBE0MZX_pVjpQdMF_gKfJS_0tY6uDTHUvg8OIQ/pub?gid=0&single=true&output=csv";
const CALL_CENTER_API = "https://script.google.com/macros/s/AKfycbw3z6vZdTbsS0MrVeGeDirN62h0LWkdfXsNAfHbKTIlD10MIRFcUPCmxYDnKYy9uSiBUw/exec";
const SALES_VISA_API = "https://script.google.com/macros/s/AKfycbzfcR-Run4kf3yDiJbjTKKMT2a8hvnyQodR3MXtArhhnsB5nQ5EFIXVeH89Vb1Ek2HHUQ/exec";

export interface DateRange {
    start: Date;
    end: Date;
}

export interface DataContextType {
    marketingSpend: any[];
    leads: any[];
    callCenterData: any[];
    salesData: any[];
    dateRange: DateRange;
    setDateRange: (range: DateRange) => void;
    selectedSources: Set<string>;
    toggleSource: (source: string) => void;
    loading: boolean;
    error: string | null;
    refetchData: () => Promise<void>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
    const [marketingSpend, setMarketingSpend] = useState<any[]>([]);
    const [leads, setLeads] = useState<any[]>([]);
    const [callCenterData, setCallCenterData] = useState<any[]>([]);
    const [salesData, setSalesData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Source Filter State
    const [selectedSources, setSelectedSources] = useState<Set<string>>(new Set());

    // Default date range: Current Year (Jan 1 to Current Month End)
    // Adjusted to ensure we capture data if it's earlier in the year
    const [dateRange, setDateRange] = useState<DateRange>(() => {
        const now = new Date();
        // Default to "All Time" (e.g., from Jan 1, 2023 to End of Current Year)
        const start = new Date(2023, 0, 1);
        const end = new Date(now.getFullYear(), 11, 31);
        return { start, end };
    });

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            // 1. Fetch Marketing CSVs (Parallel)
            try {
                const [spendData, leadsData] = await Promise.all([
                    parseCSV(MARKETING_SPEND_CSV),
                    parseCSV(LEADS_CSV)
                ]);
                setMarketingSpend(spendData);
                setLeads(leadsData);

                // Initialize Source Filter if empty
                if (selectedSources.size === 0) {
                    const sources = new Set<string>();
                    const normalize = (s: string) => {
                        if (!s) return "Unknown";
                        const lower = s.trim().toLowerCase();
                        if (lower.includes("facebook") || lower.includes("fb")) return "Facebook";
                        if (lower.includes("tiktok")) return "TikTok";
                        if (lower.includes("walk")) return "Walk-in";
                        if (lower.includes("instagram")) return "Instagram";
                        if (lower.includes("google")) return "Google";
                        if (lower.includes("referral")) return "Referral";
                        if (lower === "other" || lower === "") return "Unknown";
                        return s.trim();
                    };

                    spendData.forEach((r: any) => sources.add(normalize(r.Source)));
                    leadsData.forEach((r: any) => sources.add(normalize(r.Source)));
                    ["Facebook", "TikTok", "Walk-in", "Instagram", "Google", "Referral", "Unknown"].forEach(s => sources.add(s));
                    setSelectedSources(sources);
                }
            } catch (e) {
                console.error("Failed to load Marketing CSVs", e);
            }

            // 2. Fetch Call Center Data
            try {
                // Check cache first
                const cachedCC = localStorage.getItem('callCenterData');
                let ccArray = [];
                if (cachedCC) {
                    ccArray = JSON.parse(cachedCC);
                    setCallCenterData(ccArray); // Optimistic update
                }

                // Fetch fresh
                const ccResponse = await fetch(CALL_CENTER_API);
                if (ccResponse.ok) {
                    const ccData = await ccResponse.json();
                    ccArray = ccData.data || ccData.result || ccData;
                    setCallCenterData(ccArray);
                    localStorage.setItem('callCenterData', JSON.stringify(ccArray));
                }
            } catch (e) {
                console.error("Failed to load Call Center API", e);
            }

            // 3. Fetch Sales & Visa Data
            try {
                const salesResponse = await fetch(SALES_VISA_API + `?t=${Date.now()}`);
                if (salesResponse.ok) {
                    const salesJson = await salesResponse.json();
                    const salesArray = Array.isArray(salesJson) ? salesJson : (salesJson.sales || []);
                    setSalesData(salesArray);
                }
            } catch (e) {
                console.error("Failed to load Sales API", e);
            }

        } catch (err) {
            console.error('General Data fetch error:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on mount
    useEffect(() => {
        fetchData();
    }, []);

    const toggleSource = (source: string) => {
        const newSelected = new Set(selectedSources);
        if (newSelected.has(source)) {
            newSelected.delete(source);
        } else {
            newSelected.add(source);
        }
        setSelectedSources(newSelected);
    };

    const value: DataContextType = {
        marketingSpend,
        leads,
        callCenterData,
        salesData,
        dateRange,
        setDateRange,
        selectedSources,
        toggleSource,
        loading,
        error,
        refetchData: fetchData
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
}
