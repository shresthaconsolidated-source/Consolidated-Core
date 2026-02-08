import Papa from 'papaparse';

export async function parseCSV(url: string): Promise<any[]> {
    try {
        console.log(`fetching CSV: ${url}`);
        const response = await fetch(url, { cache: 'no-store', mode: 'cors' });

        if (!response.ok) {
            console.error(`CSV Fetch Failed: ${response.status} ${response.statusText}`);
            throw new Error(`Failed to fetch CSV: ${response.statusText}`);
        }

        const csvText = await response.text();
        console.log(`CSV Fetched. Length: ${csvText.length}. Sample: ${csvText.substring(0, 50)}...`);

        if (csvText.trim().startsWith("<!DOCTYPE html") || csvText.includes("<html")) {
            console.error("CSV returned HTML instead of data. Check permissions.");
            return [];
        }

        return new Promise((resolve, reject) => {
            Papa.parse(csvText, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: (results) => {
                    // Check if parsing worked or if it's empty
                    if (results.data && results.data.length > 0) {
                        console.log(`Parsed ${results.data.length} rows.`);
                        // DEBUG: Log keys of first row
                        console.log(`First row keys: ${Object.keys((results.data[0] as any))}`);
                        resolve(results.data);
                    } else {
                        console.warn("Parsed CSV is empty.");
                        resolve([]);
                    }
                },
                error: (error: any) => {
                    console.error("Papa Parse Error:", error);
                    reject(error);
                }
            });
        });
    } catch (err) {
        console.error("CSV Load Error:", err);
        return [];
    }
}
