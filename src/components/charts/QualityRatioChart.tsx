import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface QualityRatioChartProps {
    data: {
        src: string;
        leads: number;
        qualLeads: number;
    }[];
    openDetails: (type: string, label: string) => void;
}

export default function QualityRatioChart({ data, openDetails }: QualityRatioChartProps) {
    const chartRef = useRef<Chart | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        const labels = data.map(d => d.src);
        const satData = data.map(d => d.qualLeads);
        const junkData = data.map(d => d.leads - d.qualLeads);

        if (chartRef.current) {
            chartRef.current.data.labels = labels;
            chartRef.current.data.datasets[0].data = satData;
            chartRef.current.data.datasets[1].data = junkData;
            chartRef.current.update();
        } else {
            chartRef.current = new Chart(ctx, {
                type: "bar",
                data: {
                    labels,
                    datasets: [
                        {
                            label: "Qualified",
                            data: satData,
                            backgroundColor: "rgba(57,255,136,.85)",
                            borderRadius: 4,
                            stack: "s"
                        },
                        {
                            label: "Junk",
                            data: junkData,
                            backgroundColor: "rgba(255,59,87,.85)",
                            borderRadius: 4,
                            stack: "s"
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: { duration: 500 },
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    onHover: (event, chartElement) => {
                        if (event.native && event.native.target) {
                            (event.native.target as HTMLElement).style.cursor = chartElement[0] ? 'pointer' : 'default';
                        }
                    },
                    onClick: (e, elements, chart) => {
                        if (!elements || elements.length === 0) return;
                        const { index, datasetIndex } = elements[0];
                        const label = chart.data.labels?.[index] as string;
                        // dataset 0 = Qualified, 1 = Junk
                        const type = datasetIndex === 0 ? 'qualified' : 'junk';
                        if (label) openDetails(type, label);
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: "#e2e8f0",
                                boxWidth: 12,
                                boxHeight: 12,
                                font: { family: 'Inter', weight: 'bold' },
                                usePointStyle: true
                            }
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
                    },
                    scales: {
                        x: {
                            stacked: true,
                            ticks: { color: "#e2e8f0", font: { family: 'Inter', weight: 'bold', size: 11 } },
                            grid: { display: false }
                        },
                        y: {
                            stacked: true,
                            ticks: { color: "#94a3b8", font: { family: 'Inter', size: 11 } },
                            grid: { color: "rgba(255,255,255,0.05)" },
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }, [data, openDetails]);

    useEffect(() => {
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
                chartRef.current = null;
            }
        };
    }, []);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <canvas ref={canvasRef} />
        </div>
    );
}
