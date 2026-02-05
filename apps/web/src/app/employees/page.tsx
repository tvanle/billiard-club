'use client';

import { useState } from 'react';
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

// Mock data for employees
const mockEmployees = [
    {
        id: '1',
        name: 'Nguyễn Văn An',
        email: 'an.nguyen@billiard.club',
        phone: '0901234567',
        role: 'MANAGER',
        position: 'Quản lý ca',
        status: 'ACTIVE',
        avatar: null,
        startDate: '2024-01-15',
        shift: 'Ca sáng (6:00 - 14:00)',
        salary: 12000000,
    },
    {
        id: '2',
        name: 'Trần Thị Bình',
        email: 'binh.tran@billiard.club',
        phone: '0912345678',
        role: 'STAFF',
        position: 'Nhân viên phục vụ',
        status: 'ACTIVE',
        avatar: null,
        startDate: '2024-02-01',
        shift: 'Ca chiều (14:00 - 22:00)',
        salary: 8000000,
    },
    {
        id: '3',
        name: 'Lê Văn Cường',
        email: 'cuong.le@billiard.club',
        phone: '0923456789',
        role: 'STAFF',
        position: 'Nhân viên thu ngân',
        status: 'ACTIVE',
        avatar: null,
        startDate: '2024-03-10',
        shift: 'Ca tối (22:00 - 6:00)',
        salary: 9000000,
    },
    {
        id: '4',
        name: 'Phạm Thị Dung',
        email: 'dung.pham@billiard.club',
        phone: '0934567890',
        role: 'STAFF',
        position: 'Nhân viên bar',
        status: 'ON_LEAVE',
        avatar: null,
        startDate: '2024-01-20',
        shift: 'Ca sáng (6:00 - 14:00)',
        salary: 7500000,
    },
    {
        id: '5',
        name: 'Hoàng Văn Em',
        email: 'em.hoang@billiard.club',
        phone: '0945678901',
        role: 'STAFF',
        position: 'Kỹ thuật viên',
        status: 'ACTIVE',
        avatar: null,
        startDate: '2023-12-01',
        shift: 'Ca chiều (14:00 - 22:00)',
        salary: 10000000,
    },
];

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
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('ALL');
    const [filterRole, setFilterRole] = useState<string>('ALL');
    const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

    const filteredEmployees = mockEmployees.filter((emp) => {
        const matchesSearch =
            emp.name.toLowerCase().includes(search.toLowerCase()) ||
            emp.email.toLowerCase().includes(search.toLowerCase()) ||
            emp.phone.includes(search);
        const matchesStatus = filterStatus === 'ALL' || emp.status === filterStatus;
        const matchesRole = filterRole === 'ALL' || emp.role === filterRole;
        return matchesSearch && matchesStatus && matchesRole;
    });

    const stats = {
        total: mockEmployees.length,
        active: mockEmployees.filter((e) => e.status === 'ACTIVE').length,
        onLeave: mockEmployees.filter((e) => e.status === 'ON_LEAVE').length,
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
                                            {employee.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-text-primary">{employee.name}</p>
                                            <p className="text-xs text-text-muted">{employee.position}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                                            <Mail size={12} />
                                            {employee.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                                            <Phone size={12} />
                                            {employee.phone}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${roleColors[employee.role as keyof typeof roleColors]}`}>
                                        {roleLabels[employee.role as keyof typeof roleLabels]}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm text-text-secondary">{employee.shift}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded border text-xs font-medium ${statusColors[employee.status as keyof typeof statusColors]}`}>
                                        {statusLabels[employee.status as keyof typeof statusLabels]}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 rounded-lg hover:bg-surface-light transition-colors">
                                            <Eye size={16} className="text-text-muted hover:text-text-primary" />
                                        </button>
                                        <button className="p-2 rounded-lg hover:bg-surface-light transition-colors">
                                            <Edit size={16} className="text-text-muted hover:text-primary" />
                                        </button>
                                        <button className="p-2 rounded-lg hover:bg-surface-light transition-colors">
                                            <Trash2 size={16} className="text-text-muted hover:text-accent-red" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
