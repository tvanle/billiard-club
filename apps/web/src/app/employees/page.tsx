'use client';

import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    MoreVertical,
    Phone,
    Mail,
    Calendar,
    UserCheck,
    Clock,
    DollarSign,
    Edit,
    Trash2,
    Eye,
} from 'lucide-react';
import { employeesApi, Employee, EmployeeStatus, UserRole } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';

const statusColors = {
    ACTIVE: 'bg-accent-green/20 text-accent-green border-accent-green/50',
    ON_LEAVE: 'bg-accent-yellow/20 text-accent-yellow border-accent-yellow/50',
    INACTIVE: 'bg-accent-red/20 text-accent-red border-accent-red/50',
};

const statusLabels = {
    ACTIVE: 'Đang làm việc',
    ON_LEAVE: 'Nghỉ phép',
    INACTIVE: 'Đã nghỉ',
};

const roleColors = {
    ADMIN: 'bg-primary/20 text-primary',
    MANAGER: 'bg-accent-blue/20 text-accent-blue',
    STAFF: 'bg-surface-light text-text-secondary',
};

const roleLabels = {
    ADMIN: 'Admin',
    MANAGER: 'Quản lý',
    STAFF: 'Nhân viên',
};

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<(Employee & { user?: any })[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('ALL');
    const [filterRole, setFilterRole] = useState<string>('ALL');
    const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [viewEmployee, setViewEmployee] = useState<any>(null);

    const fetchEmployees = async () => {
        setLoading(true);
        setError(null);
        const res = await employeesApi.getAll();
        if (res.success && res.data) {
            setEmployees(res.data);
        } else {
            setError(res.error || 'Failed to fetch employees');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    if (loading) return <LoadingSpinner message="Loading employees..." />;
    if (error) return <ErrorDisplay message={error} onRetry={fetchEmployees} />;

    const filteredEmployees = employees.filter((emp) => {
        const matchesSearch =
            emp.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
            emp.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
            emp.user?.phone?.includes(search) ||
            search === '';
        const matchesStatus = filterStatus === 'ALL' || emp.status === filterStatus;
        const matchesRole = filterRole === 'ALL' || emp.user?.role === filterRole;
        return matchesSearch && matchesStatus && matchesRole;
    });

    const stats = {
        total: employees.length,
        active: employees.filter((e) => e.status === EmployeeStatus.ACTIVE).length,
        onLeave: employees.filter((e) => e.status === EmployeeStatus.ON_LEAVE).length,
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Quản lý nhân viên</h1>
                    <p className="text-text-secondary mt-1">Quản lý thông tin và lịch làm việc của nhân viên</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark
                     rounded-lg text-white font-medium transition-colors"
                >
                    <Plus size={18} />
                    Thêm nhân viên
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <UserCheck size={20} className="text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
                            <p className="text-sm text-text-muted">Tổng nhân viên</p>
                        </div>
                    </div>
                </div>
                <div className="glass rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent-green/20 flex items-center justify-center">
                            <Clock size={20} className="text-accent-green" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-text-primary">{stats.active}</p>
                            <p className="text-sm text-text-muted">Đang làm việc</p>
                        </div>
                    </div>
                </div>
                <div className="glass rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent-yellow/20 flex items-center justify-center">
                            <Calendar size={20} className="text-accent-yellow" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-text-primary">{stats.onLeave}</p>
                            <p className="text-sm text-text-muted">Nghỉ phép</p>
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
                            placeholder="Tìm kiếm nhân viên..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 bg-surface-light border border-border rounded-lg
                       text-sm text-text-primary placeholder:text-text-muted
                       focus:outline-none focus:border-primary/50"
                        />
                    </div>

                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="h-10 px-4 bg-surface-light border border-border rounded-lg
                     text-sm text-text-primary focus:outline-none focus:border-primary/50"
                    >
                        <option value="ALL">Tất cả chức vụ</option>
                        <option value="MANAGER">Quản lý</option>
                        <option value="STAFF">Nhân viên</option>
                    </select>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="h-10 px-4 bg-surface-light border border-border rounded-lg
                     text-sm text-text-primary focus:outline-none focus:border-primary/50"
                    >
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="ACTIVE">Đang làm việc</option>
                        <option value="ON_LEAVE">Nghỉ phép</option>
                        <option value="INACTIVE">Đã nghỉ</option>
                    </select>
                </div>
            </div>

            {/* Employee table */}
            <div className="glass rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">Nhân viên</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">Liên hệ</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">Chức vụ</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">Ca làm việc</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">Trạng thái</th>
                            <th className="text-right px-6 py-4 text-sm font-semibold text-text-secondary">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map((employee) => (
                            <tr
                                key={employee.id}
                                className="border-b border-border/50 hover:bg-surface-light/50 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent-blue
                                  flex items-center justify-center text-white font-semibold">
                                            {employee.user?.name?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-text-primary">{employee.user?.name || 'Unknown'}</p>
                                            <p className="text-xs text-text-muted">{employee.position || 'N/A'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                                            <Mail size={12} />
                                            {employee.user?.email || 'N/A'}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                                            <Phone size={12} />
                                            {employee.user?.phone || 'N/A'}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${roleColors[(employee.user?.role || 'STAFF') as keyof typeof roleColors]}`}>
                                        {roleLabels[(employee.user?.role || 'STAFF') as keyof typeof roleLabels]}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm text-text-secondary">{employee.shift || 'N/A'}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded border text-xs font-medium ${statusColors[employee.status as keyof typeof statusColors]}`}>
                                        {statusLabels[employee.status as keyof typeof statusLabels]}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => {
                                                setViewEmployee(employee);
                                                setShowViewModal(true);
                                            }}
                                            className="p-2 rounded-lg hover:bg-surface-light transition-colors"
                                        >
                                            <Eye size={16} className="text-text-muted hover:text-text-primary" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setViewEmployee(employee);
                                                setShowEditModal(true);
                                            }}
                                            className="p-2 rounded-lg hover:bg-surface-light transition-colors"
                                        >
                                            <Edit size={16} className="text-text-muted hover:text-primary" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm(`Xóa nhân viên ${employee.user?.name}?`)) {
                                                    alert('Chức năng đang phát triển. API: DELETE /employees/' + employee.id);
                                                }
                                            }}
                                            className="p-2 rounded-lg hover:bg-surface-light transition-colors"
                                        >
                                            <Trash2 size={16} className="text-text-muted hover:text-accent-red" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Employee Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-surface rounded-xl p-6 max-w-2xl w-full space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between sticky top-0 bg-surface pb-4">
                            <h2 className="text-xl font-bold text-text-primary">Thêm nhân viên mới</h2>
                            <button onClick={() => setShowAddModal(false)} className="p-2 rounded-lg hover:bg-surface-light">✕</button>
                        </div>

                        <form className="space-y-4" onSubmit={(e) => {
                            e.preventDefault();
                            alert('Chức năng đang phát triển. API: POST /employees');
                            setShowAddModal(false);
                        }}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">Họ tên *</label>
                                    <input type="text" className="w-full px-3 py-2 bg-surface-light border border-border rounded-lg text-text-primary" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">Email *</label>
                                    <input type="email" className="w-full px-3 py-2 bg-surface-light border border-border rounded-lg text-text-primary" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">Số điện thoại *</label>
                                    <input type="tel" className="w-full px-3 py-2 bg-surface-light border border-border rounded-lg text-text-primary" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">Chức vụ *</label>
                                    <input type="text" className="w-full px-3 py-2 bg-surface-light border border-border rounded-lg text-text-primary" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">Phòng ban</label>
                                    <input type="text" className="w-full px-3 py-2 bg-surface-light border border-border rounded-lg text-text-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">Lương (VNĐ)</label>
                                    <input type="number" className="w-full px-3 py-2 bg-surface-light border border-border rounded-lg text-text-primary" />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 bg-surface-light hover:bg-surface-light/80 rounded-lg text-text-primary font-medium">Hủy</button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg text-white font-medium">Thêm nhân viên</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Employee Modal */}
            {showViewModal && viewEmployee && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-surface rounded-xl p-6 max-w-lg w-full space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-text-primary">Thông tin nhân viên</h2>
                            <button onClick={() => setShowViewModal(false)} className="p-2 rounded-lg hover:bg-surface-light">✕</button>
                        </div>
                        <div className="space-y-3">
                            <div><span className="text-text-secondary">Họ tên:</span> <span className="text-text-primary font-medium">{viewEmployee.user?.name}</span></div>
                            <div><span className="text-text-secondary">Email:</span> <span className="text-text-primary">{viewEmployee.user?.email}</span></div>
                            <div><span className="text-text-secondary">Điện thoại:</span> <span className="text-text-primary">{viewEmployee.user?.phone}</span></div>
                            <div><span className="text-text-secondary">Chức vụ:</span> <span className="text-text-primary">{viewEmployee.position}</span></div>
                            <div><span className="text-text-secondary">Phòng ban:</span> <span className="text-text-primary">{viewEmployee.department}</span></div>
                            <div><span className="text-text-secondary">Lương:</span> <span className="text-accent-green font-medium">{viewEmployee.salary?.toLocaleString('vi-VN')}đ</span></div>
                            <div><span className="text-text-secondary">Ca làm:</span> <span className="text-text-primary">{viewEmployee.shift}</span></div>
                        </div>
                        <button onClick={() => setShowViewModal(false)} className="w-full px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg text-white font-medium">Đóng</button>
                    </div>
                </div>
            )}

            {/* Edit Employee Modal */}
            {showEditModal && viewEmployee && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-surface rounded-xl p-6 max-w-lg w-full space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-text-primary">Chỉnh sửa nhân viên</h2>
                            <button onClick={() => setShowEditModal(false)} className="p-2 rounded-lg hover:bg-surface-light">✕</button>
                        </div>
                        <form className="space-y-4" onSubmit={(e) => {
                            e.preventDefault();
                            alert('Chức năng đang phát triển. API: PUT /employees/' + viewEmployee.id);
                            setShowEditModal(false);
                        }}>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Chức vụ</label>
                                <input type="text" defaultValue={viewEmployee.position} className="w-full px-3 py-2 bg-surface-light border border-border rounded-lg text-text-primary" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Phòng ban</label>
                                <input type="text" defaultValue={viewEmployee.department} className="w-full px-3 py-2 bg-surface-light border border-border rounded-lg text-text-primary" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Lương (VNĐ)</label>
                                <input type="number" defaultValue={viewEmployee.salary} className="w-full px-3 py-2 bg-surface-light border border-border rounded-lg text-text-primary" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 bg-surface-light hover:bg-surface-light/80 rounded-lg text-text-primary font-medium">Hủy</button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg text-white font-medium">Lưu thay đổi</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
