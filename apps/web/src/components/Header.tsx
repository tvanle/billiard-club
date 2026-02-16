'use client';

import { Bell, Search, Moon, Sun } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isDark, setIsDark] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <header className="h-16 bg-surface/80 backdrop-blur-xl border-b border-border sticky top-0 z-40">
            <div className="h-full px-6 flex items-center justify-between">
                {/* Search */}
                <div className="relative w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm bàn, khách hàng, order..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 bg-surface-light border border-border rounded-lg
                     text-sm text-text-primary placeholder:text-text-muted
                     focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20
                     transition-all"
                    />
                    <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex
                        h-5 px-1.5 items-center gap-1 rounded border border-border
                        bg-surface text-[10px] font-medium text-text-muted">
                        ⌘K
                    </kbd>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    {/* Live indicator */}
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-accent-green/10 rounded-full">
                        <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
                        <span className="text-xs font-medium text-accent-green">Live</span>
                    </div>

                    {/* Current time */}
                    <div className="text-sm text-text-secondary">
                        <CurrentTime />
                    </div>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 rounded-lg hover:bg-surface-light transition-colors group"
                        >
                            <Bell size={20} className="text-text-secondary group-hover:text-text-primary transition-colors" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-accent-red rounded-full" />
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 top-12 w-80 bg-surface border border-border rounded-lg shadow-xl z-50 animate-slide-down">
                                <div className="p-4 border-b border-border">
                                    <h3 className="font-semibold text-text-primary">Thông báo</h3>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {/* Sample Notifications */}
                                    <div className="p-4 border-b border-border hover:bg-surface-light transition-colors cursor-pointer">
                                        <div className="flex items-start gap-3">
                                            <div className="w-2 h-2 rounded-full bg-accent-red mt-2" />
                                            <div className="flex-1">
                                                <p className="text-sm text-text-primary font-medium">Bàn Pool 03 cần thanh toán</p>
                                                <p className="text-xs text-text-muted mt-1">Phiên chơi đã kết thúc, chờ thanh toán</p>
                                                <p className="text-xs text-text-muted mt-1">5 phút trước</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 border-b border-border hover:bg-surface-light transition-colors cursor-pointer">
                                        <div className="flex items-start gap-3">
                                            <div className="w-2 h-2 rounded-full bg-accent-yellow mt-2" />
                                            <div className="flex-1">
                                                <p className="text-sm text-text-primary font-medium">Order mới từ bàn Snooker 02</p>
                                                <p className="text-xs text-text-muted mt-1">2x Trà đào, 1x Cà phê sữa</p>
                                                <p className="text-xs text-text-muted mt-1">10 phút trước</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 hover:bg-surface-light transition-colors cursor-pointer">
                                        <div className="flex items-start gap-3">
                                            <div className="w-2 h-2 rounded-full bg-accent-green mt-2" />
                                            <div className="flex-1">
                                                <p className="text-sm text-text-primary font-medium">Thanh toán thành công</p>
                                                <p className="text-xs text-text-muted mt-1">Bàn Pool 01 - 150,000đ</p>
                                                <p className="text-xs text-text-muted mt-1">30 phút trước</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 border-t border-border text-center">
                                    <button className="text-sm text-primary hover:text-primary-light font-medium">Xem tất cả thông báo</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Theme toggle */}
                    <button
                        onClick={() => {
                            const next = !isDark;
                            setIsDark(next);
                            if (next) {
                                document.documentElement.classList.remove('light');
                            } else {
                                document.documentElement.classList.add('light');
                            }
                        }}
                        className="p-2 rounded-lg hover:bg-surface-light transition-colors group"
                    >
                        {isDark ? (
                            <Moon size={20} className="text-text-secondary group-hover:text-text-primary transition-colors" />
                        ) : (
                            <Sun size={20} className="text-text-secondary group-hover:text-text-primary transition-colors" />
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
}

function CurrentTime() {
    const [time, setTime] = useState(new Date());

    // Update time every second
    if (typeof window !== 'undefined') {
        setTimeout(() => setTime(new Date()), 1000);
    }

    return (
        <span className="font-mono">
            {time.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
        </span>
    );
}
