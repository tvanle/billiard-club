'use client';

import { AlertTriangle, Trash2, LogOut } from 'lucide-react';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
    onCancel: () => void;
}

const variantStyles = {
    danger: {
        icon: Trash2,
        iconBg: 'bg-accent-red/20',
        iconColor: 'text-accent-red',
        button: 'bg-accent-red hover:bg-accent-red/80',
    },
    warning: {
        icon: AlertTriangle,
        iconBg: 'bg-accent-yellow/20',
        iconColor: 'text-accent-yellow',
        button: 'bg-accent-yellow hover:bg-accent-yellow/80 text-black',
    },
    info: {
        icon: LogOut,
        iconBg: 'bg-primary/20',
        iconColor: 'text-primary',
        button: 'bg-primary hover:bg-primary-dark',
    },
};

export default function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel = 'Xác nhận',
    cancelLabel = 'Hủy',
    variant = 'danger',
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    if (!open) return null;

    const style = variantStyles[variant];
    const Icon = style.icon;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-surface rounded-xl p-6 max-w-sm w-full space-y-4 animate-slide-up shadow-2xl border border-border">
                <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full ${style.iconBg} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={22} className={style.iconColor} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-text-primary">{title}</h3>
                        <p className="text-sm text-text-secondary mt-1">{message}</p>
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2.5 bg-surface-light hover:bg-surface-light/80 rounded-lg text-text-primary font-medium transition-colors border border-border"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 px-4 py-2.5 rounded-lg text-white font-medium transition-colors ${style.button}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
