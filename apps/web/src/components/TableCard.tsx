'use client';

import { Play, Clock, MoreVertical, Wrench } from 'lucide-react';
import { Table } from '@/lib/api';
import { useTableStore } from '@/stores/tableStore';
import { useState } from 'react';

interface TableCardProps {
    table: Table;
}

const statusConfig = {
    AVAILABLE: {
        label: 'Trống',
        bgClass: 'bg-table-available/10 border-table-available/30 hover:border-table-available',
        dotClass: 'bg-table-available',
        textClass: 'text-table-available',
    },
    OCCUPIED: {
        label: 'Đang sử dụng',
        bgClass: 'bg-table-occupied/10 border-table-occupied/30 hover:border-table-occupied',
        dotClass: 'bg-table-occupied animate-pulse',
        textClass: 'text-table-occupied',
    },
    RESERVED: {
        label: 'Đặt trước',
        bgClass: 'bg-table-reserved/10 border-table-reserved/30 hover:border-table-reserved',
        dotClass: 'bg-table-reserved',
        textClass: 'text-table-reserved',
    },
    MAINTENANCE: {
        label: 'Bảo trì',
        bgClass: 'bg-table-maintenance/10 border-table-maintenance/30 hover:border-table-maintenance',
        dotClass: 'bg-table-maintenance',
        textClass: 'text-table-maintenance',
    },
};

const typeIcons: Record<string, string> = {
    POOL: '🎱',
    SNOOKER: '🔴',
    CAROM: '⚪',
};

export default function TableCard({ table }: TableCardProps) {
    const { updateTableStatus } = useTableStore();
    const [showMenu, setShowMenu] = useState(false);
    const config = statusConfig[table.status];

    const handleStatusChange = async (status: Table['status']) => {
        await updateTableStatus(table.id, status);
        setShowMenu(false);
    };

    return (
        <div
            className={`
        relative rounded-xl border-2 p-4 transition-all duration-300 cursor-pointer
        ${config.bgClass}
        hover:shadow-lg hover:scale-[1.02]
      `}
        >
            {/* Status dot */}
            <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${config.dotClass}`} />

            {/* Table icon */}
            <div className="text-3xl mb-3">{typeIcons[table.type]}</div>

            {/* Table info */}
            <h3 className="text-lg font-bold text-text-primary">{table.name}</h3>
            <p className="text-xs text-text-muted mt-1">{table.type}</p>

            {/* Status */}
            <div className={`text-xs font-medium mt-2 ${config.textClass}`}>
                {config.label}
            </div>

            {/* Rate */}
            <div className="mt-3 pt-3 border-t border-border/50">
                <p className="text-xs text-text-muted">
                    {table.hourlyRate.toLocaleString('vi-VN')}đ/giờ
                </p>
            </div>

            {/* Quick actions */}
            {table.status === 'AVAILABLE' && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange('OCCUPIED');
                    }}
                    className="absolute bottom-3 right-3 w-8 h-8 rounded-lg bg-accent-green/20 
                     flex items-center justify-center hover:bg-accent-green/40 transition-colors"
                >
                    <Play size={14} className="text-accent-green" />
                </button>
            )}

            {table.status === 'OCCUPIED' && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange('AVAILABLE');
                    }}
                    className="absolute bottom-3 right-3 w-8 h-8 rounded-lg bg-accent-red/20 
                     flex items-center justify-center hover:bg-accent-red/40 transition-colors"
                >
                    <Clock size={14} className="text-accent-red" />
                </button>
            )}

            {/* Location */}
            {table.location && (
                <p className="text-xs text-text-muted mt-2 truncate">{table.location}</p>
            )}
        </div>
    );
}
