import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Keyframes,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    ChartData,
    ChartOptions
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

interface GrowthChartProps {
    labels: string[];
    spend: number[];
    visas: number[];
}

export function GrowthTrendChart({ labels, spend, visas }: GrowthChartProps) {
    const data: ChartData<'bar' | 'line'> = {
        labels,
        datasets: [
            {
                type: 'line' as const,
                label: 'Visas Granted',
                data: visas,
                borderColor: '#22c55e',
                backgroundColor: '#22c55e',
                borderWidth: 2,
                yAxisID: 'y1',
                tension: 0.4,
            },
            {
                type: 'bar' as const,
                label: 'Marketing Spend (NPR)',
                data: spend,
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: '#3b82f6',
                borderWidth: 1,
                yAxisID: 'y',
            },
        ],
    };

    const options: ChartOptions<'bar' | 'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#cbd5e1' }
            },
            title: {
                display: false,
            },
        },
        scales: {
            x: {
                ticks: { color: '#94a3b8' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                ticks: { color: '#94a3b8' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                title: { display: true, text: 'Spend (NPR)', color: '#94a3b8' }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: { drawOnChartArea: false },
                ticks: { color: '#22c55e' },
                title: { display: true, text: 'Visas', color: '#22c55e' }
            },
        },
    };

    return <Bar data={data} options={options} />;
}

interface SourceChartProps {
    labels: string[];
    data: number[];
}

export function SourcePerformanceChart({ labels, data }: SourceChartProps) {
    const chartData: ChartData<'pie'> = {
        labels,
        datasets: [
            {
                data,
                backgroundColor: [
                    '#3b82f6',
                    '#ef4444',
                    '#10b981',
                    '#f59e0b',
                    '#8b5cf6',
                    '#ec4899',
                    '#6366f1',
                    '#14b8a6',
                ],
                borderWidth: 1,
                borderColor: '#1e293b'
            },
        ],
    };

    const options: ChartOptions<'pie'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: { color: '#cbd5e1' }
            }
        }
    };

    return <Pie data={chartData} options={options} />;
}
