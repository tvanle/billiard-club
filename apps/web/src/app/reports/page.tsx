'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import { reportsApi, DailyReport } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';

interface DailyData {
    date: string;
    revenue: number;
    sessions: number;
    orders: number;
}

const topTables = [
    { name: 'Pool 01', revenue: 2500000, sessions: 45 },
    { name: 'Snooker 02', revenue: 2100000, sessions: 28 },
    { name: 'Pool 03', revenue: 1800000, sessions: 38 },
    { name: 'Carom 01', revenue: 1500000, sessions: 22 },
    { name: 'Pool 02', revenue: 1200000, sessions: 25 },
];

const topMenuItems = [
    { name: 'Cà phê sữa', quantity: 120, revenue: 3000000 },
    { name: 'Heineken', quantity: 85, revenue: 2550000 },
    { name: 'Red Bull', quantity: 78, revenue: 1950000 },
    { name: 'Khoai tây chiên', quantity: 45, revenue: 1575000 },
    { name: 'Trà đào', quantity: 42, revenue: 1260000 },
];

export default function ReportsPage() {
    const [reportData, setReportData] = useState<DailyData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');

    const fetchReports = async () => {
        setLoading(true);
        setError(null);
        const res = await reportsApi.daily();
        if (res.success && res.data) {
            // Map API response to chart format
            const mapped: DailyData = {
                date: new Date(res.data.date).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' }),
                revenue: res.data.totalRevenue,
                sessions: res.data.totalSessions,
                orders: res.data.totalOrders,
            };
            setReportData([mapped]);
        } else {
            setError(res.error || 'Failed to fetch reports');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchReports();
    }, [period]);

    if (loading) return <LoadingSpinner message="Loading reports..." />;
    if (error) return <ErrorDisplay message={error} onRetry={fetchReports} />;

    const totalRevenue = reportData.reduce((sum, d) => sum + d.revenue, 0);
    const totalSessions = reportData.reduce((sum, d) => sum + d.sessions, 0);
    const totalOrders = reportData.reduce((sum, d) => sum + d.orders, 0);
    const avgRevenue = reportData.length > 0 ? totalRevenue / reportData.length : 0;

    const maxRevenue = reportData.length > 0 ? Math.max(...reportData.map(d => d.revenue)) : 1;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Báo cáo</h1>
                    <p className="text-gray-400 mt-1">Phân tích doanh thu và hoạt động</p>
                </div>
                <div className="flex gap-2">
                    {(['day', 'week', 'month'] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-2 rounded-lg transition-colors ${period === p ? 'bg-primary-500 text-white' : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
                                }`}
                        >
                            {p === 'day' ? 'Hôm nay' : p === 'week' ? '7 ngày' : '30 ngày'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatsCard
                    title="Tổng doanh thu"
                    value={formatCurrency(totalRevenue)}
                    icon={DollarSign}
                    color="green"
                    trend={{ value: 12, isPositive: true }}
                />
                <StatsCard
                    title="Tổng phiên"
                    value={totalSessions.toString()}
                    icon={Calendar}
                    color="blue"
                    trend={{ value: 8, isPositive: true }}
                />
                <StatsCard
                    title="Tổng order"
                    value={totalOrders.toString()}
                    icon={BarChart3}
                    color="purple"
                    trend={{ value: 5, isPositive: true }}
                />
                <StatsCard
                    title="TB/ngày"
                    value={formatCurrency(avgRevenue)}
                    icon={TrendingUp}
                    color="yellow"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 glass-card p-6">
                    <h3 className="text-lg font-semibold mb-4">Doanh thu theo ngày</h3>
                    <div className="h-64 flex items-end gap-2">
                        {reportData.map((day, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full flex flex-col items-center">
                                    <span className="text-xs text-gray-400 mb-1">
                                        {(day.revenue / 1000000).toFixed(1)}M
                                    </span>
                                    <div
                                        className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg transition-all hover:from-primary-400 hover:to-primary-300"
                                        style={{ height: `${(day.revenue / maxRevenue) * 180}px` }}
                                    />
                                </div>
                                <span className="text-xs text-gray-400">{day.date}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Revenue Breakdown */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold mb-4">Phân bổ doanh thu</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-400">Tiền bàn</span>
                                <span className="font-medium">65%</span>
                            </div>
                            <div className="h-3 bg-dark-700 rounded-full overflow-hidden">
                                <div className="h-full w-[65%] bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-400">Đồ uống</span>
                                <span className="font-medium">25%</span>
                            </div>
                            <div className="h-3 bg-dark-700 rounded-full overflow-hidden">
                                <div className="h-full w-[25%] bg-gradient-to-r from-green-500 to-green-400 rounded-full" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-400">Đồ ăn</span>
                                <span className="font-medium">10%</span>
                            </div>
                            <div className="h-3 bg-dark-700 rounded-full overflow-hidden">
                                <div className="h-full w-[10%] bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rankings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Tables */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold mb-4">🏆 Top bàn doanh thu</h3>
                    <div className="space-y-3">
                        {topTables.map((table, index) => (
                            <div key={table.name} className="flex items-center gap-4 p-3 bg-dark-800/50 rounded-lg">
                                <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                                        index === 1 ? 'bg-gray-300/20 text-gray-300' :
                                            index === 2 ? 'bg-orange-500/20 text-orange-400' :
                                                'bg-dark-700 text-gray-400'
                                    }`}>
                                    {index + 1}
                                </span>
                                <div className="flex-1">
                                    <p className="font-medium">{table.name}</p>
                                    <p className="text-sm text-gray-400">{table.sessions} phiên</p>
                                </div>
                                <p className="font-semibold text-green-400">{formatCurrency(table.revenue)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Menu Items */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold mb-4">🔥 Top món bán chạy</h3>
                    <div className="space-y-3">
                        {topMenuItems.map((item, index) => (
                            <div key={item.name} className="flex items-center gap-4 p-3 bg-dark-800/50 rounded-lg">
                                <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                                        index === 1 ? 'bg-gray-300/20 text-gray-300' :
                                            index === 2 ? 'bg-orange-500/20 text-orange-400' :
                                                'bg-dark-700 text-gray-400'
                                    }`}>
                                    {index + 1}
                                </span>
                                <div className="flex-1">
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-400">{item.quantity} đã bán</p>
                                </div>
                                <p className="font-semibold text-green-400">{formatCurrency(item.revenue)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
