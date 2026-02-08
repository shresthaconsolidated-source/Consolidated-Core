import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface TrendChartProps {
    data: { dateKey: string; label: string; count: number }[];
    onPointClick?: (dateKey: string) => void;
}

export default function TrendChart({ data, onPointClick }: TrendChartProps) {
    const chartRef = useRef<Chart | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        const labels = data.map(d => d.label);
        const counts = data.map(d => d.count);
        const keys = data.map(d => d.dateKey);

        if (chartRef.current) {
            chartRef.current.data.labels = labels;
            chartRef.current.data.datasets[0].data = counts;
            chartRef.current.update();
        } else {
            chartRef.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels,
                    datasets: [{
                        label: 'Hot Leads',
                        data: counts,
                        borderColor: '#FEBB2E',
                        backgroundColor: 'rgba(254, 187, 46, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#FEBB2E',
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: { duration: 750 },
                    scales: {
                        x: {
                            grid: { color: 'rgba(255,255,255,0.05)' },
                            ticks: { color: '#94A3B8', font: { family: 'Inter' } }
                        },
                        y: {
                            grid: { color: 'rgba(255,255,255,0.05)' },
                            ticks: { color: '#94A3B8', font: { family: 'Inter' } },
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            titleColor: '#e2e8f0',
                            bodyColor: '#e2e8f0',
                            padding: 10,
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderWidth: 1
                        }
                    },
                    onClick: (e, activeEls) => {
                        if (!activeEls || activeEls.length === 0) return;
                        const { index } = activeEls[0];
                        const key = keys[index];
                        if (onPointClick) onPointClick(key);
                    }
                }
            });
        }
    }, [data, onPointClick]);

    useEffect(() => {
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
                chartRef.current = null;
            }
        };
    }, []);

    return <canvas ref={canvasRef} />;
}
