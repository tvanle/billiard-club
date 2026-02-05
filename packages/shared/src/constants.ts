// Default hourly rates by table type (VND)
export const DEFAULT_HOURLY_RATES = {
    POOL: 50000,
    SNOOKER: 80000,
    CAROM: 60000,
} as const;

// API Routes
export const API_ROUTES = {
    // Table Service
    TABLES: '/api/tables',

    // Session Service
    SESSIONS: '/api/sessions',

    // Order Service
    ORDERS: '/api/orders',
    MENU_ITEMS: '/api/menu-items',
    CATEGORIES: '/api/categories',

    // User Service
    USERS: '/api/users',
    EMPLOYEES: '/api/employees',
    CUSTOMERS: '/api/customers',
    AUTH: '/api/auth',

    // Payment Service
    PAYMENTS: '/api/payments',
} as const;

// Pagination defaults
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
} as const;

// Real-time events
export const SOCKET_EVENTS = {
    // Table events
    TABLE_STATUS_CHANGED: 'table:status:changed',
    TABLE_CREATED: 'table:created',
    TABLE_UPDATED: 'table:updated',
    TABLE_DELETED: 'table:deleted',

    // Session events
    SESSION_STARTED: 'session:started',
    SESSION_ENDED: 'session:ended',
    SESSION_UPDATED: 'session:updated',

    // Order events
    ORDER_CREATED: 'order:created',
    ORDER_STATUS_CHANGED: 'order:status:changed',

    // General
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    ERROR: 'error',
} as const;
