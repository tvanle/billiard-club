'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ConfirmDialog from '@/components/ConfirmDialog';
import {
    LayoutDashboard,
    Table2,
    Clock,
    ShoppingBag,
    Users,
    CreditCard,
    BarChart3,
    Settings,
    LogOut,
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Quản lý bàn', href: '/tables', icon: Table2 },
    { name: 'Phiên chơi', href: '/sessions', icon: Clock },
    { name: 'Order', href: '/orders', icon: ShoppingBag },
    { name: 'Nhân viên', href: '/employees', icon: Users },
    { name: 'Thanh toán', href: '/payments', icon: CreditCard },
    { name: 'Báo cáo', href: '/reports', icon: BarChart3 },
    { name: 'Cài đặt', href: '/settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [showLogout, setShowLogout] = useState(false);

    return (
        <aside className="fixed left-0 top-0 h-full w-64 bg-surface border-r border-border flex flex-col">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent-green flex items-center justify-center">
                        <span className="text-xl">🎱</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-text-primary">Billiard Club</h1>
                        <p className="text-xs text-text-muted">Management System</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200 group
                ${isActive
                                    ? 'bg-primary/20 text-primary-light shadow-glow'
                                    : 'text-text-secondary hover:bg-surface-light hover:text-text-primary'
                                }
              `}
                        >
                            <item.icon
                                size={20}
                                className={`transition-transform group-hover:scale-110 ${isActive ? 'text-primary' : ''}`}
                            />
                            {item.name}
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User section */}
            <div className="p-4 border-t border-border">
                <div
                    onClick={() => setShowLogout(true)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-light transition-colors cursor-pointer"
                >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center text-white font-semibold">
                        AD
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">Admin</p>
                        <p className="text-xs text-text-muted truncate">admin@billiard.club</p>
                    </div>
                    <LogOut size={18} className="text-text-muted hover:text-accent-red transition-colors" />
                </div>
            </div>

            <ConfirmDialog
                open={showLogout}
                title="Đăng xuất"
                message="Bạn có chắc muốn đăng xuất khỏi hệ thống?"
                variant="info"
                confirmLabel="Đăng xuất"
                onConfirm={() => {
                    setShowLogout(false);
                    // TODO: implement real logout
                    window.location.href = '/';
                }}
                onCancel={() => setShowLogout(false)}
            />
        </aside>
    );
}
