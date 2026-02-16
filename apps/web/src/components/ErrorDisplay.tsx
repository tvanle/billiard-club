import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorDisplayProps {
    message?: string;
    onRetry?: () => void;
}

export default function ErrorDisplay({ message = 'Failed to load data', onRetry }: ErrorDisplayProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
            <div className="glass rounded-2xl p-8 max-w-md w-full text-center">
                <div className="w-16 h-16 rounded-full bg-accent-red/20 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle size={32} className="text-accent-red" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Oops! Something went wrong</h3>
                <p className="text-sm text-text-muted mb-6">{message}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="btn-primary inline-flex items-center gap-2"
                    >
                        <RefreshCw size={16} />
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
}
