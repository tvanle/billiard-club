'use client';

import { useState } from 'react';
import {
    Plus,
    Search,
    Coffee,
    Beer,
    Pizza,
    ChefHat,
    Clock,
    CheckCircle,
    XCircle,
    Loader,
    Table2,
} from 'lucide-react';

// Mock menu categories
const categories = [
    { id: '1', name: 'Đồ uống', icon: Coffee },
    { id: '2', name: 'Bia', icon: Beer },
    { id: '3', name: 'Snacks', icon: Pizza },
    { id: '4', name: 'Món ăn', icon: ChefHat },
];

// Mock menu items
const menuItems = [
    { id: '1', categoryId: '1', name: 'Cà phê đen', price: 20000, available: true },
    { id: '2', categoryId: '1', name: 'Cà phê sữa', price: 25000, available: true },
    { id: '3', categoryId: '1', name: 'Trà đào', price: 30000, available: true },
    { id: '4', categoryId: '1', name: 'Nước suối', price: 10000, available: true },
    { id: '5', categoryId: '2', name: 'Tiger', price: 25000, available: true },
    { id: '6', categoryId: '2', name: 'Heineken', price: 30000, available: true },
    { id: '7', categoryId: '2', name: 'Saigon', price: 20000, available: true },
    { id: '8', categoryId: '3', name: 'Đậu phộng', price: 15000, available: true },
    { id: '9', categoryId: '3', name: 'Khoai tây chiên', price: 35000, available: true },
    { id: '10', categoryId: '4', name: 'Mì xào', price: 45000, available: true },
];

// Mock orders
const mockOrders = [
    {
        id: '1',
        tableName: 'Pool 01',
        items: [
            { name: 'Cà phê đen', quantity: 2, price: 20000 },
            { name: 'Đậu phộng', quantity: 1, price: 15000 },
        ],
        status: 'PENDING',
        totalAmount: 55000,
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
        id: '2',
        tableName: 'Snooker 01',
        items: [
            { name: 'Tiger', quantity: 4, price: 25000 },
            { name: 'Khoai tây chiên', quantity: 1, price: 35000 },
        ],
        status: 'PREPARING',
        totalAmount: 135000,
        createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
    {
        id: '3',
        tableName: 'Pool 03',
        items: [
            { name: 'Trà đào', quantity: 2, price: 30000 },
        ],
        status: 'READY',
        totalAmount: 60000,
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
];

const statusConfig = {
    PENDING: {
        label: 'Chờ xác nhận',
        color: 'bg-accent-yellow/20 text-accent-yellow border-accent-yellow/50',
        icon: Clock,
    },
    PREPARING: {
        label: 'Đang chuẩn bị',
        color: 'bg-accent-blue/20 text-accent-blue border-accent-blue/50',
        icon: Loader,
    },
    READY: {
        label: 'Sẵn sàng',
        color: 'bg-accent-green/20 text-accent-green border-accent-green/50',
        icon: CheckCircle,
    },
    DELIVERED: {
        label: 'Đã phục vụ',
        color: 'bg-primary/20 text-primary border-primary/50',
        icon: CheckCircle,
    },
    CANCELLED: {
        label: 'Đã hủy',
        color: 'bg-accent-red/20 text-accent-red border-accent-red/50',
        icon: XCircle,
    },
};

export default function OrdersPage() {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [cart, setCart] = useState<{ itemId: string; quantity: number }[]>([]);

    const filteredItems = menuItems.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = !selectedCategory || item.categoryId === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const addToCart = (itemId: string) => {
        setCart((prev) => {
            const existing = prev.find((c) => c.itemId === itemId);
            if (existing) {
                return prev.map((c) =>
                    c.itemId === itemId ? { ...c, quantity: c.quantity + 1 } : c
                );
            }
            return [...prev, { itemId, quantity: 1 }];
        });
    };

    const cartTotal = cart.reduce((sum, c) => {
        const item = menuItems.find((m) => m.id === c.itemId);
        return sum + (item?.price || 0) * c.quantity;
    }, 0);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Quản lý Order</h1>
                    <p className="text-text-secondary mt-1">POS và quản lý đơn hàng</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Menu & POS */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Categories */}
                    <div className="glass rounded-xl p-4">
                        <div className="flex items-center gap-3 overflow-x-auto pb-2">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                          ${!selectedCategory ? 'bg-primary text-white' : 'bg-surface-light text-text-secondary hover:bg-border'}`}
                            >
                                Tất cả
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                            ${selectedCategory === cat.id ? 'bg-primary text-white' : 'bg-surface-light text-text-secondary hover:bg-border'}`}
                                >
                                    <cat.icon size={16} />
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm món..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 bg-surface border border-border rounded-lg
                       text-sm text-text-primary placeholder:text-text-muted
                       focus:outline-none focus:border-primary/50"
                        />
                    </div>

                    {/* Menu items grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {filteredItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => addToCart(item.id)}
                                className="glass rounded-xl p-4 text-left hover:border-primary/50 transition-all
                         hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <h4 className="font-medium text-text-primary">{item.name}</h4>
                                <p className="text-lg font-bold text-accent-green mt-2">
                                    {item.price.toLocaleString('vi-VN')}đ
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Current orders */}
                <div className="space-y-4">
                    {/* Cart */}
                    {cart.length > 0 && (
                        <div className="glass rounded-xl p-4">
                            <h3 className="font-semibold text-text-primary mb-3">Đơn hiện tại</h3>
                            <div className="space-y-2 mb-4">
                                {cart.map((c) => {
                                    const item = menuItems.find((m) => m.id === c.itemId);
                                    return (
                                        <div key={c.itemId} className="flex items-center justify-between text-sm">
                                            <span className="text-text-secondary">
                                                {item?.name} x{c.quantity}
                                            </span>
                                            <span className="text-text-primary">
                                                {((item?.price || 0) * c.quantity).toLocaleString('vi-VN')}đ
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-border">
                                <span className="font-semibold text-text-primary">Tổng</span>
                                <span className="font-bold text-accent-green">
                                    {cartTotal.toLocaleString('vi-VN')}đ
                                </span>
                            </div>
                            <button className="w-full mt-4 px-4 py-2.5 bg-primary hover:bg-primary-dark
                               rounded-lg text-white font-medium transition-colors">
                                Tạo order
                            </button>
                        </div>
                    )}

                    {/* Active orders */}
                    <div className="glass rounded-xl p-4">
                        <h3 className="font-semibold text-text-primary mb-3">Orders đang xử lý</h3>
                        <div className="space-y-3">
                            {mockOrders.map((order) => {
                                const config = statusConfig[order.status as keyof typeof statusConfig];
                                const StatusIcon = config.icon;
                                return (
                                    <div key={order.id} className="bg-surface-light rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Table2 size={14} className="text-text-muted" />
                                                <span className="text-sm font-medium text-text-primary">{order.tableName}</span>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded border text-xs font-medium ${config.color}`}>
                                                {config.label}
                                            </span>
                                        </div>
                                        <div className="space-y-1">
                                            {order.items.map((item, i) => (
                                                <p key={i} className="text-xs text-text-muted">
                                                    {item.name} x{item.quantity}
                                                </p>
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                                            <span className="text-xs text-text-muted">
                                                {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span className="text-sm font-bold text-text-primary">
                                                {order.totalAmount.toLocaleString('vi-VN')}đ
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
