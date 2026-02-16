'use client';

import { useState, useEffect } from 'react';
import {
    Play,
    Square,
    Clock,
    DollarSign,
    Table2,
    User,
    Plus,
    Search,
    Timer,
} from 'lucide-react';
import { sessionsApi, Session, SessionStatus } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';

function formatDuration(startTime: string): string {
    const start = new Date(startTime);
    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / 1000);

    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function SessionTimer({ startTime }: { startTime: string }) {
    const [, setTick] = useState(0);

    // Update every second
    if (typeof window !== 'undefined') {
        setTimeout(() => setTick((t) => t + 1), 1000);
    }

    return (
        <span className="font-mono text-lg font-bold text-primary">
            {formatDuration(startTime)}
        </span>
    );
}

export default function SessionsPage() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('ALL');

    const fetchSessions = async () => {
        setLoading(true);
        setError(null);
        const res = await sessionsApi.getAll();
        if (res.success && res.data) {
            setSessions(res.data);
        } else {
            setError(res.error || 'Failed to fetch sessions');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleEndSession = async (sessionId: string) => {
        const res = await sessionsApi.end(sessionId);
        if (res.success) {
            await fetchSessions();
        } else {
            alert(res.error || 'Failed to end session');
        }
    };

    if (loading) return <LoadingSpinner message="Loading sessions..." />;
    if (error) return <ErrorDisplay message={error} onRetry={fetchSessions} />;

    const activeSessions = sessions.filter((s) => s.status === SessionStatus.ACTIVE);
    const totalRevenue = activeSessions.reduce((sum, s) => sum + (s.totalCost || 0), 0);

    const filteredSessions = sessions.filter((session) => {
        const matchesSearch =
            (session.tableName?.toLowerCase().includes(search.toLowerCase())) ||
            search === '';
        const matchesStatus = filterStatus === 'ALL' || session.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Quản lý phiên chơi</h1>
                    <p className="text-text-secondary mt-1">Theo dõi và quản lý các phiên chơi</p>
                </div>
                <button
                    className="flex items-center gap-2 px-4 py-2.5 bg-accent-green hover:bg-accent-green/80
                     rounded-lg text-white font-medium transition-colors"
                >
                    <Plus size={18} />
                    Bắt đầu phiên mới
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent-green/20 flex items-center justify-center">
                            <Play size={20} className="text-accent-green" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-text-primary">{activeSessions.length}</p>
                            <p className="text-sm text-text-muted">Phiên đang hoạt động</p>
                        </div>
                    </div>
                </div>
                <div className="glass rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <Clock size={20} className="text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-text-primary">24</p>
                            <p className="text-sm text-text-muted">Phiên hôm nay</p>
                        </div>
                    </div>
                </div>
                <div className="glass rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent-yellow/20 flex items-center justify-center">
                            <DollarSign size={20} className="text-accent-yellow" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-text-primary">
                                {totalRevenue.toLocaleString('vi-VN')}đ
                            </p>
                            <p className="text-sm text-text-muted">Doanh thu chờ thanh toán</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="glass rounded-xl p-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm phiên..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 bg-surface-light border border-border rounded-lg
                       text-sm text-text-primary placeholder:text-text-muted
                       focus:outline-none focus:border-primary/50"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="h-10 px-4 bg-surface-light border border-border rounded-lg
                     text-sm text-text-primary focus:outline-none focus:border-primary/50"
                    >
                        <option value="ALL">Tất cả</option>
                        <option value="ACTIVE">Đang hoạt động</option>
                        <option value="COMPLETED">Đã kết thúc</option>
                    </select>
                </div>
            </div>

            {/* Active sessions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSessions.map((session) => (
                    <div key={session.id} className="glass rounded-xl p-5 border-2 border-accent-green/30 hover:border-accent-green transition-colors">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-accent-green/20 flex items-center justify-center">
                                    <Table2 size={24} className="text-accent-green" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-primary">{session.tableName || 'Unknown Table'}</h3>
                                    <p className="text-xs text-text-muted">Table #{session.tableId}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 bg-accent-green/20 rounded-full">
                                <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
                                <span className="text-xs font-medium text-accent-green">Live</span>
                            </div>
                        </div>

                        {/* Timer */}
                        <div className="bg-surface-light rounded-lg p-3 mb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Timer size={16} className="text-text-muted" />
                                    <span className="text-sm text-text-muted">Thời gian</span>
                                </div>
                                <SessionTimer startTime={session.startTime} />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                                <User size={14} className="text-text-muted" />
                                <span className="text-text-secondary">Staff: </span>
                                <span className="text-text-primary">{session.staffId}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <DollarSign size={14} className="text-text-muted" />
                                <span className="text-text-secondary">Giá: </span>
                                <span className="text-text-primary">{session.hourlyRate.toLocaleString('vi-VN')}đ/giờ</span>
                            </div>
                        </div>

                        {/* Current cost */}
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                            <span className="text-sm text-text-muted">Tạm tính</span>
                            <span className="text-xl font-bold text-accent-green">
                                {(session.totalCost || 0).toLocaleString('vi-VN')}đ
                            </span>
                        </div>

                        {/* Action */}
                        <button
                            onClick={() => handleEndSession(session.id)}
                            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5
                             bg-accent-red/20 hover:bg-accent-red/40 text-accent-red
                             rounded-lg font-medium transition-colors"
                        >
                            <Square size={16} />
                            Kết thúc phiên
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
