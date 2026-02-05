/**
 * Format currency in VND
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
}

/**
 * Calculate session duration in minutes
 */
export function calculateDuration(startTime: Date, endTime?: Date): number {
    const end = endTime || new Date();
    return Math.ceil((end.getTime() - new Date(startTime).getTime()) / (1000 * 60));
}

/**
 * Calculate session cost based on duration and hourly rate
 */
export function calculateSessionCost(
    startTime: Date,
    hourlyRate: number,
    endTime?: Date
): number {
    const durationMinutes = calculateDuration(startTime, endTime);
    return Math.ceil((durationMinutes / 60) * hourlyRate);
}

/**
 * Format duration as HH:MM:SS
 */
export function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Generate unique ID
 */
export function generateId(): string {
    return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Format date to Vietnamese locale
 */
export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
}
