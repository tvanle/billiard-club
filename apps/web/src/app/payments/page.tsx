'use client';

import { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Receipt, TrendingUp, Clock, CheckCircle, XCircle, Wallet } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import { paymentsApi, Payment, PaymentMethod, PaymentStatus } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';

const methodIcons: Record<PaymentMethod, string> = {
    CASH: '💵',
    CARD: '💳',
    TRANSFER: '🏦',
    MOMO: '📱',
    ZALOPAY: '📲',
};

const methodLabels: Record<PaymentMethod, string> = {
    CASH: 'Tiền mặt',
    CARD: 'Thẻ',
    TRANSFER: 'Chuyển khoản',
    MOMO: 'MoMo',
    ZALOPAY: 'ZaloPay',
};

const statusConfig: Record<PaymentStatus, { label: string; color: string; icon: any }> = {
    PENDING: { label: 'Chờ thanh toán', color: 'text-yellow-400 bg-yellow-400/10', icon: Clock },
    COMPLETED: { label: 'Hoàn thành', color: 'text-green-400 bg-green-400/10', icon: CheckCircle },
    FAILED: { label: 'Thất bại', color: 'text-red-400 bg-red-400/10', icon: XCircle },
    REFUNDED: { label: 'Hoàn tiền', color: 'text-purple-400 bg-purple-400/10', icon: Receipt },
};

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<PaymentStatus | 'ALL'>('ALL');
    const [methodFilter, setMethodFilter] = useState<PaymentMethod | 'ALL'>('ALL');

    const fetchPayments = async () => {
        setLoading(true);
        setError(null);
        const res = await paymentsApi.getAll();
        if (res.success && res.data) {
            setPayments(res.data);
        } else {
            setError(res.error || 'Failed to fetch payments');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const handleCompletePayment = async (paymentId: string) => {
        const res = await paymentsApi.complete(paymentId);
        if (res.success) {
            await fetchPayments();
        } else {
            alert(res.error || 'Failed to complete payment');
        }
    };

    if (loading) return <LoadingSpinner message="Loading payments..." />;
    if (error) return <ErrorDisplay message={error} onRetry={fetchPayments} />;

    const filteredPayments = payments.filter((payment) => {
        if (filter !== 'ALL' && payment.status !== filter) return false;
        if (methodFilter !== 'ALL' && payment.method !== methodFilter) return false;
        return true;
    });

    const totalRevenue = payments.filter(p => p.status === PaymentStatus.COMPLETED).reduce((sum, p) => sum + p.totalAmount, 0);
    const pendingAmount = payments.filter(p => p.status === PaymentStatus.PENDING).reduce((sum, p) => sum + p.totalAmount, 0);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Thanh toán</h1>
                    <p className="text-gray-400 mt-1">Quản lý thanh toán và hóa đơn</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatsCard
                    title="Doanh thu hôm nay"
                    value={formatCurrency(totalRevenue)}
                    icon={DollarSign}
                    color="green"
                    trend={{ value: 15, isPositive: true }}
                />
                <StatsCard
                    title="Đang chờ"
                    value={formatCurrency(pendingAmount)}
                    icon={Clock}
                    color="yellow"
                />
                <StatsCard
                    title="Giao dịch"
                    value={payments.length.toString()}
                    icon={Receipt}
                    color="blue"
                />
                <StatsCard
                    title="Tiền mặt"
                    value={formatCurrency(payments.filter(p => p.method === PaymentMethod.CASH && p.status === PaymentStatus.COMPLETED).reduce((s, p) => s + p.totalAmount, 0))}
                    icon={Wallet}
                    color="purple"
                />
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as PaymentStatus | 'ALL')}
                    className="bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="PENDING">Chờ thanh toán</option>
                    <option value="COMPLETED">Hoàn thành</option>
                    <option value="REFUNDED">Hoàn tiền</option>
                </select>
                <select
                    value={methodFilter}
                    onChange={(e) => setMethodFilter(e.target.value as PaymentMethod | 'ALL')}
                    className="bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="ALL">Tất cả phương thức</option>
                    <option value="CASH">Tiền mặt</option>
                    <option value="CARD">Thẻ</option>
                    <option value="TRANSFER">Chuyển khoản</option>
                    <option value="MOMO">MoMo</option>
                    <option value="ZALOPAY">ZaloPay</option>
                </select>
            </div>

            {/* Payments Table */}
            <div className="glass-card overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-dark-700">
                            <th className="text-left py-4 px-6 font-medium text-gray-400">Bàn / Khách</th>
                            <th className="text-right py-4 px-6 font-medium text-gray-400">Tiền bàn</th>
                            <th className="text-right py-4 px-6 font-medium text-gray-400">Tiền order</th>
                            <th className="text-right py-4 px-6 font-medium text-gray-400">Giảm giá</th>
                            <th className="text-right py-4 px-6 font-medium text-gray-400">Tổng</th>
                            <th className="text-center py-4 px-6 font-medium text-gray-400">Phương thức</th>
                            <th className="text-center py-4 px-6 font-medium text-gray-400">Trạng thái</th>
                            <th className="text-right py-4 px-6 font-medium text-gray-400">Thời gian</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPayments.map((payment) => {
                            const StatusIcon = statusConfig[payment.status].icon;
                            return (
                                <tr key={payment.id} className="border-b border-dark-700/50 hover:bg-dark-700/30 transition-colors">
                                    <td className="py-4 px-6">
                                        <div>
                                            <p className="font-medium">{payment.tableName}</p>
                                            <p className="text-sm text-gray-400">{payment.customerName}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-right">{formatCurrency(payment.sessionAmount)}</td>
                                    <td className="py-4 px-6 text-right">{formatCurrency(payment.orderAmount)}</td>
                                    <td className="py-4 px-6 text-right text-red-400">
                                        {payment.discount > 0 ? `-${formatCurrency(payment.discount)}` : '-'}
                                    </td>
                                    <td className="py-4 px-6 text-right font-semibold text-green-400">
                                        {formatCurrency(payment.totalAmount)}
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-dark-700 rounded-full text-sm">
                                            {methodIcons[payment.method]} {methodLabels[payment.method]}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${statusConfig[payment.status].color}`}>
                                            <StatusIcon className="w-4 h-4" />
                                            {statusConfig[payment.status].label}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right text-gray-400 text-sm">
                                        {payment.createdAt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
