import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface TargetGaugeProps {
    title: string;
    actual: number;
    target: number;
    pct: number;
    color?: string;
}

export default function TargetGauge({ title, actual, target, pct, color = "rgba(34,211,238,.9)" }: TargetGaugeProps) {
    const chartRef = useRef<Chart | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        if (chartRef.current) {
            chartRef.current.destroy();
        }

        const val = Math.min(Math.max(pct, 0), 100); // Clamp between 0-100 for visual

        chartRef.current = new Chart(ctx, {
            type: "doughnut",
            data: {
                datasets: [{
                    data: [val, 100 - val],
                    backgroundColor: [color, "rgba(148,163,184,.18)"],
                    borderWidth: 0,
                }]
            },
            options: {
                cutout: "75%",
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [pct, color]);

    return (
        <div className="flex flex-col items-center flex-1">
            <div className="text-sm font-bold text-[#E5E7EB] mb-1">{title}</div>
            <div className="text-xs text-[#94A3B8] mb-3">{actual} / {target}</div>
            <div className="relative w-[120px] h-[80px]">
                <canvas ref={canvasRef} />
                <div className="absolute inset-0 flex items-center justify-center top-[-15%]">
                    <span className="text-xl font-black text-white">{Math.round(pct)}%</span>
                </div>
            </div>
        </div>
    );
}
