'use client';

import { useEffect } from 'react';
import {
    Table2,
    Clock,
    DollarSign,
    TrendingUp,
    Play,
    Users,
    ShoppingBag,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react';
import { useTableStore } from '@/stores/tableStore';
import TableCard from '@/components/TableCard';
import StatsCard from '@/components/StatsCard';

export default function DashboardPage() {
    const { tables, loading, fetchTables } = useTableStore();

    useEffect(() => {
        fetchTables();
    }, [fetchTables]);

    const availableTables = tables.filter((t) => t.status === 'AVAILABLE').length;
    const occupiedTables = tables.filter((t) => t.status === 'OCCUPIED').length;
    const totalTables = tables.length;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
                <p className="text-text-secondary mt-1">Tổng quan hoạt động câu lạc bộ</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Bàn đang sử dụng"
                    value={`${occupiedTables}/${totalTables}`}
                    subtitle={`${Math.round((occupiedTables / totalTables) * 100) || 0}% công suất`}
                    icon={Table2}
                    trend={{ value: 12, isUp: true }}
                    color="primary"
                />
                <StatsCard
                    title="Phiên hoạt động"
                    value="12"
                    subtitle="Đang chơi"
                    icon={Clock}
                    trend={{ value: 5, isUp: true }}
                    color="green"
                />
                <StatsCard
                    title="Doanh thu hôm nay"
                    value="4.2M"
                    subtitle="VNĐ"
                    icon={DollarSign}
                    trend={{ value: 8, isUp: true }}
                    color="yellow"
                />
                <StatsCard
                    title="Order đang xử lý"
                    value="8"
                    subtitle="Chờ phục vụ"
                    icon={ShoppingBag}
                    trend={{ value: 3, isUp: false }}
                    color="blue"
                />
            </div>

            {/* Tables section */}
            <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-text-primary">Sơ đồ bàn</h2>
                        <p className="text-sm text-text-muted mt-1">Trạng thái các bàn trong câu lạc bộ</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-table-available" />
                            <span className="text-xs text-text-secondary">Trống ({availableTables})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-table-occupied" />
                            <span className="text-xs text-text-secondary">Đang sử dụng ({occupiedTables})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-table-reserved" />
                            <span className="text-xs text-text-secondary">Đặt trước</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-table-maintenance" />
                            <span className="text-xs text-text-secondary">Bảo trì</span>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-40 bg-surface-light rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {tables.map((table) => (
                            <TableCard key={table.id} table={table} />
                        ))}
                    </div>
                )}
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Recent sessions */}
                <div className="glass rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Phiên gần đây</h3>
                    <div className="space-y-3">
                        {[
                            { table: 'Pool 01', customer: 'Nguyễn Văn A', duration: '2:30', amount: '125.000đ' },
                            { table: 'Snooker 02', customer: 'Trần Văn B', duration: '1:45', amount: '140.000đ' },
                            { table: 'Pool 03', customer: 'Lê Văn C', duration: '3:00', amount: '150.000đ' },
                        ].map((session, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-surface-light rounded-lg hover:bg-border/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                        <Play size={16} className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-text-primary">{session.table}</p>
                                        <p className="text-xs text-text-muted">{session.customer}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-accent-green">{session.amount}</p>
                                    <p className="text-xs text-text-muted">{session.duration}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Today summary */}
                <div className="glass rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Tổng kết hôm nay</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-text-secondary">Tổng phiên chơi</span>
                            <span className="text-text-primary font-semibold">24 phiên</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-text-secondary">Tổng thời gian</span>
                            <span className="text-text-primary font-semibold">48 giờ</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-text-secondary">Doanh thu bàn</span>
                            <span className="text-accent-green font-semibold">3.200.000đ</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-text-secondary">Doanh thu order</span>
                            <span className="text-accent-green font-semibold">1.000.000đ</span>
                        </div>
                        <div className="h-px bg-border my-2" />
                        <div className="flex items-center justify-between">
                            <span className="text-text-primary font-semibold">Tổng doanh thu</span>
                            <span className="text-xl font-bold text-accent-green">4.200.000đ</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
