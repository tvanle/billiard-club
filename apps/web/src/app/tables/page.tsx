'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Filter, Table2, Edit, Trash2 } from 'lucide-react';
import { useTableStore } from '@/stores/tableStore';
import { useToast } from '@/components/Toast';
import { tablesApi } from '@/lib/api';
import TableCard from '@/components/TableCard';

export default function TablesPage() {
    const { tables, loading, fetchTables } = useTableStore();
    const { toast } = useToast();
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState<string>('ALL');
    const [filterStatus, setFilterStatus] = useState<string>('ALL');
    const [showAddModal, setShowAddModal] = useState(false);

    // Add table form state
    const [name, setName] = useState('');
    const [type, setType] = useState<string>('POOL');
    const [hourlyRate, setHourlyRate] = useState('');
    const [location, setLocation] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchTables();
    }, [fetchTables]);

    const filteredTables = tables.filter((table) => {
        const matchesSearch = table.name.toLowerCase().includes(search.toLowerCase());
        const matchesType = filterType === 'ALL' || table.type === filterType;
        const matchesStatus = filterStatus === 'ALL' || table.status === filterStatus;
        return matchesSearch && matchesType && matchesStatus;
    });

    const tablesByType = {
        POOL: filteredTables.filter((t) => t.type === 'POOL'),
        SNOOKER: filteredTables.filter((t) => t.type === 'SNOOKER'),
        CAROM: filteredTables.filter((t) => t.type === 'CAROM'),
    };

    const resetForm = () => {
        setName('');
        setType('POOL');
        setHourlyRate('');
        setLocation('');
    };

    const handleAddTable = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const result = await tablesApi.create({
                name,
                type,
                hourlyRate: Number(hourlyRate),
                location: location || undefined,
            });

            if (result.success) {
                toast('success', 'Thêm bàn thành công!');
                resetForm();
                setShowAddModal(false);
                fetchTables();
            } else {
                toast('error', `Lỗi: ${result.error || 'Không thể thêm bàn'}`);
            }
        } catch (error) {
            toast('error', `Lỗi: ${error instanceof Error ? error.message : 'Đã xảy ra lỗi không mong muốn'}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Quản lý bàn</h1>
                    <p className="text-text-secondary mt-1">Quản lý tất cả bàn billiard trong câu lạc bộ</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark
                     rounded-lg text-white font-medium transition-colors"
                >
                    <Plus size={18} />
                    Thêm bàn mới
                </button>
            </div>

            {/* Filters */}
            <div className="glass rounded-xl p-4">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Search */}
                    <div className="relative flex-1 min-w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm bàn..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 bg-surface-light border border-border rounded-lg
                       text-sm text-text-primary placeholder:text-text-muted
                       focus:outline-none focus:border-primary/50"
                        />
                    </div>

                    {/* Filter by type */}
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="h-10 px-4 bg-surface-light border border-border rounded-lg
                     text-sm text-text-primary focus:outline-none focus:border-primary/50"
                    >
                        <option value="ALL">Tất cả loại</option>
                        <option value="POOL">Pool</option>
                        <option value="SNOOKER">Snooker</option>
                        <option value="CAROM">Carom</option>
                    </select>

                    {/* Filter by status */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="h-10 px-4 bg-surface-light border border-border rounded-lg
                     text-sm text-text-primary focus:outline-none focus:border-primary/50"
                    >
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="AVAILABLE">Trống</option>
                        <option value="OCCUPIED">Đang sử dụng</option>
                        <option value="RESERVED">Đặt trước</option>
                        <option value="MAINTENANCE">Bảo trì</option>
                    </select>
                </div>
            </div>

            {/* Tables by type */}
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-40 bg-surface-light rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Pool */}
                    {tablesByType.POOL.length > 0 && (
                        <section>
                            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                                <span className="text-2xl">🎱</span> Pool ({tablesByType.POOL.length} bàn)
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {tablesByType.POOL.map((table) => (
                                    <TableCard key={table.id} table={table} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Snooker */}
                    {tablesByType.SNOOKER.length > 0 && (
                        <section>
                            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                                <span className="text-2xl">🔴</span> Snooker ({tablesByType.SNOOKER.length} bàn)
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {tablesByType.SNOOKER.map((table) => (
                                    <TableCard key={table.id} table={table} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Carom */}
                    {tablesByType.CAROM.length > 0 && (
                        <section>
                            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                                <span className="text-2xl">⚪</span> Carom ({tablesByType.CAROM.length} bàn)
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {tablesByType.CAROM.map((table) => (
                                    <TableCard key={table.id} table={table} />
                                ))}
                            </div>
                        </section>
                    )}

                    {filteredTables.length === 0 && (
                        <div className="text-center py-12">
                            <Table2 size={48} className="mx-auto text-text-muted mb-4" />
                            <p className="text-text-secondary">Không tìm thấy bàn nào</p>
                        </div>
                    )}
                </div>
            )}

            {/* Add Table Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-surface rounded-xl p-6 max-w-md w-full space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-text-primary">Thêm bàn mới</h2>
                            <button
                                onClick={() => {
                                    resetForm();
                                    setShowAddModal(false);
                                }}
                                className="p-2 rounded-lg hover:bg-surface-light transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <form className="space-y-4" onSubmit={handleAddTable}>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Tên bàn</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 bg-surface-light border border-border rounded-lg text-text-primary"
                                    placeholder="Ví dụ: Pool 06"
                                    required
                                    disabled={submitting}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Loại bàn</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full px-3 py-2 bg-surface-light border border-border rounded-lg text-text-primary"
                                    disabled={submitting}
                                >
                                    <option value="POOL">Pool</option>
                                    <option value="SNOOKER">Snooker</option>
                                    <option value="CAROM">Carom</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Giá theo giờ (VNĐ)</label>
                                <input
                                    type="number"
                                    value={hourlyRate}
                                    onChange={(e) => setHourlyRate(e.target.value)}
                                    className="w-full px-3 py-2 bg-surface-light border border-border rounded-lg text-text-primary"
                                    placeholder="50000"
                                    required
                                    disabled={submitting}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Vị trí</label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full px-3 py-2 bg-surface-light border border-border rounded-lg text-text-primary"
                                    placeholder="Ví dụ: Tầng 1, Khu A"
                                    disabled={submitting}
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        resetForm();
                                        setShowAddModal(false);
                                    }}
                                    className="flex-1 px-4 py-2 bg-surface-light hover:bg-surface-light/80 rounded-lg text-text-primary font-medium transition-colors"
                                    disabled={submitting}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Đang thêm...' : 'Thêm bàn'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
