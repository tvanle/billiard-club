// Table Types
export enum TableType {
    POOL = 'POOL',
    SNOOKER = 'SNOOKER',
    CAROM = 'CAROM',
}

export enum TableStatus {
    AVAILABLE = 'AVAILABLE',
    OCCUPIED = 'OCCUPIED',
    RESERVED = 'RESERVED',
    MAINTENANCE = 'MAINTENANCE',
}

export interface Table {
    id: string;
    name: string;
    type: TableType;
    status: TableStatus;
    hourlyRate: number;
    location?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Session Types
export enum SessionStatus {
    ACTIVE = 'ACTIVE',
    PAUSED = 'PAUSED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export interface Session {
    id: string;
    tableId: string;
    customerId?: string;
    staffId: string;
    startTime: Date;
    endTime?: Date;
    status: SessionStatus;
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
}

// Order Types
export enum OrderStatus {
    PENDING = 'PENDING',
    PREPARING = 'PREPARING',
    READY = 'READY',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
}

export interface Category {
    id: string;
    name: string;
    description?: string;
    icon?: string;
}

export interface MenuItem {
    id: string;
    categoryId: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    available: boolean;
}

export interface OrderItem {
    id: string;
    orderId: string;
    menuItemId: string;
    quantity: number;
    unitPrice: number;
    note?: string;
}

export interface Order {
    id: string;
    sessionId: string;
    status: OrderStatus;
    items: OrderItem[];
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
}

// User Types
export enum UserRole {
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    STAFF = 'STAFF',
    CUSTOMER = 'CUSTOMER',
}

export enum EmployeeStatus {
    ACTIVE = 'ACTIVE',
    ON_LEAVE = 'ON_LEAVE',
    INACTIVE = 'INACTIVE',
}

export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    role: UserRole;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Employee extends User {
    employeeId: string;
    position: string;
    salary?: number;
    startDate: Date;
    status: EmployeeStatus;
    shift?: string;
}

export interface Customer extends User {
    membershipLevel?: 'STANDARD' | 'SILVER' | 'GOLD' | 'PLATINUM';
    loyaltyPoints: number;
    totalSpent: number;
}

// Payment Types
export enum PaymentMethod {
    CASH = 'CASH',
    CARD = 'CARD',
    TRANSFER = 'TRANSFER',
    MOMO = 'MOMO',
    ZALOPAY = 'ZALOPAY',
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
}

export interface Payment {
    id: string;
    sessionId: string;
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
    staffId: string;
    createdAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
