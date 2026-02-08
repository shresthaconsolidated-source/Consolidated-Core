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
            className={`card kpi ${onClick ? 'clickable' : ''}`}
            onClick={onClick}
            style={{
                background: bgColor,
                borderColor: borderColor,
                minWidth: '140px',
                flex: 1
            }}
        >
            <div className="kpi-icon" style={{ color }}>
                {icon && <span className="mr-1.5">{icon}</span>}
                {title}
            </div>
            <div className="kpi-value" style={{ color }}>
                {value}
            </div>
            {subtitle && <div className="kpi-sub">{subtitle}</div>}
            {trend && (
                <div
                    className="kpi-trend"
                    style={{ color: trend.isPositive ? 'var(--good)' : 'var(--bad)' }}
                >
                    {trend.isPositive ? '▲' : '▼'} {trend.value}
                </div>
            )}
        </div>
    );
}
