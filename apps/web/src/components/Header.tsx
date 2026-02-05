'use client';

import { Bell, Search, Moon, Sun } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
    const [searchQuery, setSearchQuery] = useState('');

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
                    <button className="relative p-2 rounded-lg hover:bg-surface-light transition-colors group">
                        <Bell size={20} className="text-text-secondary group-hover:text-text-primary transition-colors" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-accent-red rounded-full" />
                    </button>

                    {/* Theme toggle */}
                    <button className="p-2 rounded-lg hover:bg-surface-light transition-colors group">
                        <Moon size={20} className="text-text-secondary group-hover:text-text-primary transition-colors" />
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
