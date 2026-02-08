import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface SourcePerformanceChartProps {
    data: Record<string, number>;
    onBarClick?: (source: string) => void;
}

export default function SourcePerformanceChart({ data, onBarClick }: SourcePerformanceChartProps) {
    const chartRef = useRef<Chart | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        const labels = Object.keys(data);
        const values = Object.values(data);

        if (chartRef.current) {
            chartRef.current.data.labels = labels;
            chartRef.current.data.datasets[0].data = values;
            chartRef.current.update();
        } else {
            chartRef.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels,
                    datasets: [{
                        label: 'Hot Leads',
                        data: values,
                        backgroundColor: '#FEBB2E',
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    animation: { duration: 500 },
                    scales: {
                        x: {
                            grid: { color: 'rgba(255,255,255,0.05)' },
                            ticks: { color: '#94A3B8', font: { family: 'Inter' } }
                        },
                        y: {
                            grid: { display: false },
                            ticks: { color: '#94A3B8', font: { family: 'Inter', size: 11 } }
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
                        const source = labels[index];
                        if (onBarClick) onBarClick(source);
                    }
                }
            });
        }
    }, [data, onBarClick]);

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
