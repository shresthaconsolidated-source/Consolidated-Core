import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: '#0F172A',
                stroke: 'rgba(148, 163, 184, 0.12)',
                stroke2: 'rgba(148, 163, 184, 0.18)',
                text: '#E5E7EB',
                muted2: '#94A3B8',
                cyan: '#22D3EE',
                good: '#39FF88',
                bad: '#FF3B57',
            },
        },
    },
    plugins: [],
};
export default config;
