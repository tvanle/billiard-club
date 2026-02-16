'use client';

import { useState, useEffect } from 'react';
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
import { menuApi, ordersApi, Category, MenuItem, Order, OrderStatus } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';

// Icon mapping for categories
const iconMap: Record<string, any> = {
    Coffee,
    Beer,
    Pizza,
    ChefHat,
};

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
    const [categories, setCategories] = useState<Category[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [cart, setCart] = useState<{ itemId: string; quantity: number }[]>([]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [categoriesRes, itemsRes, ordersRes] = await Promise.all([
                menuApi.getCategories(),
                menuApi.getItems(),
                ordersApi.getAll(),
            ]);

            if (!categoriesRes.success) throw new Error(categoriesRes.error || 'Failed to fetch categories');
            if (!itemsRes.success) throw new Error(itemsRes.error || 'Failed to fetch menu items');
            if (!ordersRes.success) throw new Error(ordersRes.error || 'Failed to fetch orders');

            setCategories(categoriesRes.data || []);
            setMenuItems(itemsRes.data || []);
            setOrders(ordersRes.data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateOrder = async (tableId: string, sessionId?: string) => {
        if (cart.length === 0) {
            alert('Giỏ hàng trống!');
            return;
        }

        const items = cart.map(c => ({
            menuItemId: c.itemId,
            quantity: c.quantity,
        }));

        const res = await ordersApi.create({
            tableId: tableId || 'default-table',
            sessionId: sessionId || 'default-session',
            items,
        });

        if (res.success) {
            setCart([]);
            await fetchData();
        } else {
            alert(res.error || 'Failed to create order');
        }
    };

    const handleUpdateOrderStatus = async (orderId: string, status: string) => {
        const res = await ordersApi.updateStatus(orderId, status);
        if (res.success) {
            await fetchData();
        } else {
            alert(res.error || 'Failed to update order status');
        }
    };

    if (loading) return <LoadingSpinner message="Loading menu and orders..." />;
    if (error) return <ErrorDisplay message={error} onRetry={fetchData} />;

    const filteredItems = menuItems.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = !selectedCategory || item.categoryId === selectedCategory;
        return matchesSearch && matchesCategory && item.isAvailable;
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
                            {categories.map((cat) => {
                                const IconComponent = cat.icon ? iconMap[cat.icon] || Coffee : Coffee;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                                ${selectedCategory === cat.id ? 'bg-primary text-white' : 'bg-surface-light text-text-secondary hover:bg-border'}`}
                                    >
                                        <IconComponent size={16} />
                                        {cat.name}
                                    </button>
                                );
                            })}
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
                            <button
                                onClick={() => handleCreateOrder('demo-table')}
                                className="w-full mt-4 px-4 py-2.5 bg-primary hover:bg-primary-dark
                               rounded-lg text-white font-medium transition-colors"
                            >
                                Tạo order
                            </button>
                        </div>
                    )}

                    {/* Active orders */}
                    <div className="glass rounded-xl p-4">
                        <h3 className="font-semibold text-text-primary mb-3">Orders đang xử lý</h3>
                        <div className="space-y-3">
                            {orders.filter(o => o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED).map((order) => {
                                const config = statusConfig[order.status as keyof typeof statusConfig];
                                const StatusIcon = config.icon;
                                return (
                                    <div key={order.id} className="bg-surface-light rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Table2 size={14} className="text-text-muted" />
                                                <span className="text-sm font-medium text-text-primary">{order.tableName || `Table ${order.tableId}`}</span>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded border text-xs font-medium ${config.color}`}>
                                                {config.label}
                                            </span>
                                        </div>
                                        <div className="space-y-1">
                                            {order.items?.map((item, i) => (
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
                                                {order.totalPrice.toLocaleString('vi-VN')}đ
                                            </span>
                                        </div>
                                        {order.status === OrderStatus.PENDING && (
                                            <button
                                                onClick={() => handleUpdateOrderStatus(order.id, OrderStatus.PREPARING)}
                                                className="w-full mt-2 px-3 py-1.5 bg-accent-blue/20 hover:bg-accent-blue/40
                                                    text-accent-blue text-xs rounded transition-colors"
                                            >
                                                Bắt đầu chuẩn bị
                                            </button>
                                        )}
                                        {order.status === OrderStatus.PREPARING && (
                                            <button
                                                onClick={() => handleUpdateOrderStatus(order.id, OrderStatus.READY)}
                                                className="w-full mt-2 px-3 py-1.5 bg-accent-green/20 hover:bg-accent-green/40
                                                    text-accent-green text-xs rounded transition-colors"
                                            >
                                                Đánh dấu sẵn sàng
                                            </button>
                                        )}
                                        {order.status === OrderStatus.READY && (
                                            <button
                                                onClick={() => handleUpdateOrderStatus(order.id, OrderStatus.DELIVERED)}
                                                className="w-full mt-2 px-3 py-1.5 bg-primary/20 hover:bg-primary/40
                                                    text-primary text-xs rounded transition-colors"
                                            >
                                                Đã phục vụ
                                            </button>
                                        )}
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
