'use client';

import { useState } from 'react';
import { Settings, Bell, Moon, Sun, Globe, Lock, Database, Palette } from 'lucide-react';

export default function SettingsPage() {
    const [darkMode, setDarkMode] = useState(true);
    const [notifications, setNotifications] = useState({
        newSession: true,
        orderReady: true,
        lowStock: false,
        dailyReport: true,
    });

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Cài đặt</h1>
                <p className="text-gray-400 mt-1">Tùy chỉnh hệ thống theo nhu cầu</p>
            </div>

            {/* Appearance */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Palette className="w-5 h-5 text-primary-400" />
                    <h2 className="text-xl font-semibold">Giao diện</h2>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            {darkMode ? <Moon className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
                            <div>
                                <p className="font-medium">Chế độ tối</p>
                                <p className="text-sm text-gray-400">Sử dụng giao diện tối cho mắt</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-primary-500' : 'bg-dark-700'
                                }`}
                        >
                            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'
                                }`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Globe className="w-5 h-5 text-green-400" />
                            <div>
                                <p className="font-medium">Ngôn ngữ</p>
                                <p className="text-sm text-gray-400">Chọn ngôn ngữ hiển thị</p>
                            </div>
                        </div>
                        <select className="bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                            <option value="vi">🇻🇳 Tiếng Việt</option>
                            <option value="en">🇺🇸 English</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Bell className="w-5 h-5 text-yellow-400" />
                    <h2 className="text-xl font-semibold">Thông báo</h2>
                </div>

                <div className="space-y-4">
                    {[
                        { key: 'newSession', label: 'Phiên mới', desc: 'Thông báo khi có phiên chơi mới' },
                        { key: 'orderReady', label: 'Order sẵn sàng', desc: 'Thông báo khi order đã hoàn thành' },
                        { key: 'lowStock', label: 'Hàng tồn thấp', desc: 'Cảnh báo khi sản phẩm sắp hết' },
                        { key: 'dailyReport', label: 'Báo cáo hàng ngày', desc: 'Gửi báo cáo doanh thu cuối ngày' },
                    ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-dark-800/50 rounded-lg">
                            <div>
                                <p className="font-medium">{item.label}</p>
                                <p className="text-sm text-gray-400">{item.desc}</p>
                            </div>
                            <button
                                onClick={() => setNotifications({
                                    ...notifications,
                                    [item.key]: !notifications[item.key as keyof typeof notifications]
                                })}
                                className={`w-12 h-6 rounded-full transition-colors ${notifications[item.key as keyof typeof notifications] ? 'bg-primary-500' : 'bg-dark-700'
                                    }`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0.5'
                                    }`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* System */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Database className="w-5 h-5 text-purple-400" />
                    <h2 className="text-xl font-semibold">Hệ thống</h2>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-dark-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">Giá bàn mặc định</p>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <div>
                                <label className="text-sm text-gray-400 block mb-1">Pool</label>
                                <input
                                    type="number"
                                    defaultValue={50000}
                                    className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 block mb-1">Snooker</label>
                                <input
                                    type="number"
                                    defaultValue={80000}
                                    className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 block mb-1">Carom</label>
                                <input
                                    type="number"
                                    defaultValue={70000}
                                    className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-dark-800/50 rounded-lg">
                        <p className="font-medium mb-2">Phiên bản</p>
                        <p className="text-sm text-gray-400">Billiard Club Manager v1.0.0</p>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors">
                    Lưu thay đổi
                </button>
            </div>
        </div>
    );
}
