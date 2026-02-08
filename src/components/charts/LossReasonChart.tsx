import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface LossReasonChartProps {
    data: Record<string, number>;
    onSliceClick?: (reason: string) => void;
}

export default function LossReasonChart({ data, onSliceClick }: LossReasonChartProps) {
    const chartRef = useRef<Chart | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        const labels = Object.keys(data).length > 0 ? Object.keys(data) : ['No Lost Leads'];
        const values = Object.keys(data).length > 0 ? Object.values(data) : [1];
        const colors = ['#FF3B57', '#FF6B81', '#FF8A9B', '#FFA9B5', '#FFC8CF', '#FFD4D9'];

        if (chartRef.current) {
            chartRef.current.data.labels = labels;
            chartRef.current.data.datasets[0].data = values;
            chartRef.current.data.datasets[0].backgroundColor = colors;
            chartRef.current.update();
        } else {
            chartRef.current = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels,
                    datasets: [{
                        data: values,
                        backgroundColor: colors,
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '60%',
                    animation: { animateScale: true, animateRotate: true },
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: { color: '#94A3B8', boxWidth: 10, padding: 8, font: { size: 10, family: 'Inter' } }
                        }
                    },
                    onClick: (e, activeEls) => {
                        if (!activeEls || activeEls.length === 0) return;
                        const { index } = activeEls[0];
                        const reason = labels[index];
                        if (onSliceClick && reason !== 'No Lost Leads') onSliceClick(reason);
                    }
                }
            });
        }
    }, [data, onSliceClick]);

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
