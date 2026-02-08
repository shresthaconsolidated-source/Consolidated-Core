'use client';

interface MetricCardProps {
    icon?: string;
    title: string;
    value: string | number;
    subtitle?: string;
    color?: string;
    onClick?: () => void;
    trend?: {
        value: string | number;
        isPositive: boolean;
    };
}

export default function MetricCard({
    icon,
    title,
    value,
    subtitle,
    color = '#22D3EE',
    onClick,
    trend
}: MetricCardProps) {
    const bgColor = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.1)`;
    const borderColor = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.3)`;

    return (
        <div
            className={`card kpi ${onClick ? 'clickable' : ''} !p-3 !gap-1`}
            onClick={onClick}
            style={{
                background: bgColor,
                borderColor: borderColor,
                minWidth: '120px',
                flex: 1
            }}
        >
            <div className="kpi-icon flex items-center !text-[11px] !font-bold" style={{ color }}>
                {icon && <span className="mr-1.5">{icon}</span>}
                {title}
            </div>
            <div className="kpi-value !text-2xl" style={{ color }}>
                {value}
            </div>
            {subtitle && <div className="kpi-sub !text-[10px] opacity-80">{subtitle}</div>}
            {trend && (
                <div
                    className="kpi-trend !text-[10px] !mt-0"
                    style={{ color: trend.isPositive ? 'var(--good)' : 'var(--bad)' }}
                >
                    {trend.isPositive ? '▲' : '▼'} {trend.value}
                </div>
            )}
        </div>
    );
}
