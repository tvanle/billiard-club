import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string;
    subtitle: string;
    icon: LucideIcon;
    trend?: {
        value: number;
        isUp: boolean;
    };
    color: 'primary' | 'green' | 'yellow' | 'blue' | 'red';
}

const colorClasses = {
    primary: {
        bg: 'bg-primary/20',
        text: 'text-primary',
        icon: 'text-primary',
    },
    green: {
        bg: 'bg-accent-green/20',
        text: 'text-accent-green',
        icon: 'text-accent-green',
    },
    yellow: {
        bg: 'bg-accent-yellow/20',
        text: 'text-accent-yellow',
        icon: 'text-accent-yellow',
    },
    blue: {
        bg: 'bg-accent-blue/20',
        text: 'text-accent-blue',
        icon: 'text-accent-blue',
    },
    red: {
        bg: 'bg-accent-red/20',
        text: 'text-accent-red',
        icon: 'text-accent-red',
    },
};

export default function StatsCard({ title, value, subtitle, icon: Icon, trend, color }: StatsCardProps) {
    const colors = colorClasses[color];

    return (
        <div className="glass rounded-xl p-5 hover:border-primary/30 transition-all duration-300 group">
            <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center 
                        group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={24} className={colors.icon} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-medium
                          ${trend.isUp ? 'text-accent-green' : 'text-accent-red'}`}>
                        {trend.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {trend.value}%
                    </div>
                )}
            </div>
            <div className="mt-4">
                <p className="text-2xl font-bold text-text-primary">{value}</p>
                <p className="text-sm text-text-muted mt-1">{title}</p>
                <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>
            </div>
        </div>
    );
}
