'use client';

import { useEffect, useRef } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    ArcElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ChartConfiguration
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    ArcElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

interface ChartWrapperProps {
    type: 'bar' | 'line' | 'doughnut' | 'pie';
    data: any;
    options?: any;
    height?: number;
}

export default function ChartWrapper({ type, data, options, height = 300 }: ChartWrapperProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<ChartJS | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        // Destroy previous chart instance
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        // Create new chart
        const config: ChartConfiguration = {
            type,
            data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                ...options
            }
        };

        chartRef.current = new ChartJS(ctx, config);

        // Cleanup on unmount
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
                chartRef.current = null;
            }
        };
    }, [type, data, options]);

    return (
        <div style={{ height: `${height}px`, position: 'relative' }}>
            <canvas ref={canvasRef} />
        </div>
    );
}
