import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    message?: string;
    fullPage?: boolean;
}

export default function LoadingSpinner({ message = 'Loading...', fullPage = false }: LoadingSpinnerProps) {
    const containerClass = fullPage
        ? 'flex flex-col items-center justify-center min-h-screen'
        : 'flex flex-col items-center justify-center min-h-[400px] p-8';

    return (
        <div className={containerClass}>
            <Loader2 size={48} className="text-primary animate-spin mb-4" />
            <p className="text-text-muted text-sm">{message}</p>
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="glass rounded-xl p-5 animate-pulse">
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-bg-hover" />
                <div className="w-12 h-4 rounded bg-bg-hover" />
            </div>
            <div className="space-y-2">
                <div className="h-8 w-24 rounded bg-bg-hover" />
                <div className="h-4 w-32 rounded bg-bg-hover" />
                <div className="h-3 w-28 rounded bg-bg-hover" />
            </div>
        </div>
    );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="glass rounded-xl overflow-hidden">
            <div className="animate-pulse">
                <div className="h-12 bg-bg-hover border-b border-border" />
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="h-16 border-b border-border bg-bg-card" />
                ))}
            </div>
        </div>
    );
}
