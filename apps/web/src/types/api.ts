// TypeScript type definitions for API responses

// ==================== ENUMS ====================

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

export enum SessionStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF',
  CUSTOMER = 'CUSTOMER',
}

export enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  RESIGNED = 'RESIGNED',
}

export enum Shift {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING',
  NIGHT = 'NIGHT',
}

export enum MembershipLevel {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  VIP = 'VIP',
}

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

// ==================== TABLE SERVICE ====================

export interface Table {
  id: string;
  name: string;
  type: TableType;
  status: TableStatus;
  hourlyRate: number;
  location?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== SESSION SERVICE ====================

export interface Session {
  id: string;
  tableId: string;
  tableName?: string;
  customerId?: string;
  staffId: string;
  startTime: string;
  endTime?: string;
  pausedTime: number;
  hourlyRate: number;
  totalCost?: number;
  status: SessionStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== ORDER SERVICE ====================

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  items?: MenuItem[];
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  category?: Category;
  name: string;
  description?: string;
  price: number;
  image?: string;
  isAvailable: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  sessionId?: string;
  tableId: string;
  tableName?: string;
  staffId?: string;
  status: OrderStatus;
  totalPrice: number;
  notes?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  createdAt: string;
}

// ==================== USER SERVICE ====================

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  employee?: Employee;
  customer?: Customer;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  userId: string;
  user?: User;
  employeeId: string;
  department?: string;
  position?: string;
  salary?: number;
  shift?: Shift;
  status: EmployeeStatus;
  hireDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  userId: string;
  user?: User;
  membershipLevel: MembershipLevel;
  points: number;
  totalSpent: number;
  visitCount: number;
  createdAt: string;
  updatedAt: string;
}

// ==================== PAYMENT SERVICE ====================

export interface Payment {
  id: string;
  sessionId: string;
  staffId: string;
  customerId?: string;
  sessionAmount: number;
  orderAmount: number;
  discount: number;
  totalAmount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  notes?: string;
  invoice?: Invoice;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  paymentId: string;
  invoiceNumber: string;
  customerName?: string;
  customerPhone?: string;
  items: any; // JSON type
  subtotal: number;
  discount: number;
  total: number;
  createdAt: string;
}

export interface DailyReport {
  id: string;
  date: string;
  totalRevenue: number;
  sessionRevenue: number;
  orderRevenue: number;
  totalSessions: number;
  totalOrders: number;
  averageSession: number;
  topTable?: string;
  topMenuItem?: string;
  createdAt: string;
}

// ==================== API RESPONSE ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
