// Date parsing utilities
export function parseDateAny(val: any): Date | null {
    if (!val) return null;

    // Try standard formats first
    let d = new Date(val);
    if (!isNaN(d.getTime())) return d;

    // Try MM/DD/YYYY
    const match = String(val).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (match) {
        const [_, m, day, y] = match;
        d = new Date(parseInt(y), parseInt(m) - 1, parseInt(day));
        if (!isNaN(d.getTime())) return d;
    }

    return null;
}

export function toISODate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

// Source normalization
export function normalizeSource(src: string): string {
    if (!src) return "Unknown";
    const s = src.trim().toLowerCase();

    if (s.includes("facebook") || s.includes("fb")) return "Facebook";
    if (s.includes("tiktok")) return "TikTok";
    if (s.includes("walk") || s.includes("walkin")) return "Walk-in";
    if (s.includes("instagram") || s.includes("ig") || s.includes("insta")) return "Instagram";
    if (s.includes("google") || s.includes("search")) return "Google";
    if (s.includes("referral") || s.includes("refer")) return "Referral";
    if (s === "other" || s === "") return "Unknown";

    return src.trim();
}

// Currency formatting
export function formatNPR(val: number): string {
    if (val === 0) return "NPR 0";
    return `NPR ${Math.round(val).toLocaleString("en-US")}`;
}

// Filter data by date range
export function filterByDateRange<T extends Record<string, any>>(
    data: T[],
    start: Date,
    end: Date,
    dateField: string = 'Date'
): T[] {
    if (!data || !Array.isArray(data)) return [];
    return data.filter(row => {
        const dateVal = row[dateField];
        const d = parseDateAny(dateVal);
        return d && d >= start && d <= end;
    });
}

// Filter by selected sources
export function filterBySources<T extends Record<string, any>>(
    data: T[],
    selectedSources: Set<string>,
    sourceField: string = 'Source'
): T[] {
    if (!data || !Array.isArray(data)) return [];
    return data.filter(row => {
        const src = normalizeSource(row[sourceField]);
        return selectedSources.has(src);
    });
}
