import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { RepStats } from '@/utils/callCenterMetrics';

interface RepStatusChartProps {
    data: RepStats[];
    onBarClick?: (repName: string, status: string) => void;
}

export default function RepStatusChart({ data, onBarClick }: RepStatusChartProps) {
    const chartRef = useRef<Chart | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        const labels = data.map(r => r.name);
        const dataHot = data.map(r => r.hot);
        const dataWarm = data.map(r => r.warm);
        const dataCold = data.map(r => r.cold);
        const dataLost = data.map(r => r.lost);

        if (chartRef.current) {
            // Update existing chart
            chartRef.current.data.labels = labels;
            chartRef.current.data.datasets[0].data = dataHot;
            chartRef.current.data.datasets[1].data = dataWarm;
            chartRef.current.data.datasets[2].data = dataCold;
            chartRef.current.data.datasets[3].data = dataLost;
            chartRef.current.update();
        } else {
            // Create new chart
            chartRef.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels,
                    datasets: [
                        { label: 'Hot', data: dataHot, backgroundColor: '#FEBB2E' },
                        { label: 'Warm', data: dataWarm, backgroundColor: '#28C840' },
                        { label: 'Cold', data: dataCold, backgroundColor: '#38BDF8' },
                        { label: 'Lost', data: dataLost, backgroundColor: '#FF5F57' },
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: 500
                    },
                    scales: {
                        x: {
                            stacked: true,
                            grid: { display: false },
                            ticks: { color: '#94A3B8', font: { family: 'Inter', size: 11 } }
                        },
                        y: {
                            stacked: true,
                            grid: { color: "rgba(255,255,255,0.05)" },
                            ticks: { color: '#94A3B8' }
                        }
                    },
                    onClick: (e, activeEls) => {
                        if (!activeEls || activeEls.length === 0) return;
                        const { datasetIndex, index } = activeEls[0];
                        const label = labels[index];
                        // Map dataset index to status string: 0=Hot, 1=Warm, 2=Cold, 3=Lost
                        const stageMap = ["Hot", "Warm", "Cold", "Lost"];
                        const stage = stageMap[datasetIndex];

                        if (label && stage && onBarClick) {
                            onBarClick(label, stage);
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: { color: '#94A3B8', usePointStyle: true, boxWidth: 8 }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            titleColor: '#e2e8f0',
                            bodyColor: '#e2e8f0',
                            padding: 10,
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderWidth: 1,
                            displayColors: true,
                            usePointStyle: true,
                        }
                    }
                }
            });
        }

        // No cleanup destroy here strictly, or only on unmount?
        // If we destroy, we lose animation. 
        // Best to only destroy on component unmount.
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
