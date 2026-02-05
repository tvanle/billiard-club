// API client for connecting to backend services via Gateway
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9001/api';

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });
        return await response.json();
    } catch (error) {
        return { success: false, error: 'Network error' };
    }
}

// ==================== AUTH ====================
export const authApi = {
    login: (email: string, password: string) =>
        fetchApi<{ user: any; token: string }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),
    register: (data: { email: string; password: string; name: string; phone?: string }) =>
        fetchApi<{ user: any; token: string }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    me: (token: string) =>
        fetchApi<any>('/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
        }),
};

// ==================== TABLES ====================
export const tablesApi = {
    getAll: (params?: { type?: string; status?: string }) => {
        const query = new URLSearchParams(params as any).toString();
        return fetchApi<any[]>(`/tables${query ? `?${query}` : ''}`);
    },
    getById: (id: string) => fetchApi<any>(`/tables/${id}`),
    create: (data: { name: string; type: string; hourlyRate: number; location?: string }) =>
        fetchApi<any>('/tables', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    update: (id: string, data: any) =>
        fetchApi<any>(`/tables/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
    updateStatus: (id: string, status: string) =>
        fetchApi<any>(`/tables/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        }),
    delete: (id: string) =>
        fetchApi<void>(`/tables/${id}`, { method: 'DELETE' }),
};

// ==================== SESSIONS ====================
export const sessionsApi = {
    getAll: (params?: { status?: string; tableId?: string }) => {
        const query = new URLSearchParams(params as any).toString();
        return fetchApi<any[]>(`/sessions${query ? `?${query}` : ''}`);
    },
    getById: (id: string) => fetchApi<any>(`/sessions/${id}`),
    getCost: (id: string) => fetchApi<any>(`/sessions/${id}/cost`),
    start: (data: { tableId: string; staffId: string; customerId?: string; hourlyRate?: number }) =>
        fetchApi<any>('/sessions', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    end: (id: string) =>
        fetchApi<any>(`/sessions/${id}/end`, { method: 'PATCH' }),
    cancel: (id: string) =>
        fetchApi<any>(`/sessions/${id}/cancel`, { method: 'PATCH' }),
};

// ==================== ORDERS ====================
export const ordersApi = {
    getAll: (params?: { sessionId?: string; tableId?: string; status?: string }) => {
        const query = new URLSearchParams(params as any).toString();
        return fetchApi<any[]>(`/orders${query ? `?${query}` : ''}`);
    },
    getById: (id: string) => fetchApi<any>(`/orders/${id}`),
    create: (data: { sessionId: string; tableId: string; items: { menuItemId: string; quantity: number }[] }) =>
        fetchApi<any>('/orders', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    updateStatus: (id: string, status: string) =>
        fetchApi<any>(`/orders/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        }),
    cancel: (id: string) =>
        fetchApi<any>(`/orders/${id}/cancel`, { method: 'PATCH' }),
};

// ==================== MENU ====================
export const menuApi = {
    getCategories: () => fetchApi<any[]>('/categories'),
    getItems: (categoryId?: string) => {
        const query = categoryId ? `?categoryId=${categoryId}` : '';
        return fetchApi<any[]>(`/menu-items${query}`);
    },
    createItem: (data: { categoryId: string; name: string; price: number; description?: string }) =>
        fetchApi<any>('/menu-items', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    toggleAvailability: (id: string) =>
        fetchApi<any>(`/menu-items/${id}/toggle`, { method: 'PATCH' }),
};

// ==================== EMPLOYEES ====================
export const employeesApi = {
    getAll: (params?: { status?: string; department?: string }) => {
        const query = new URLSearchParams(params as any).toString();
        return fetchApi<any[]>(`/employees${query ? `?${query}` : ''}`);
    },
    create: (data: any) =>
        fetchApi<any>('/employees', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    update: (id: string, data: any) =>
        fetchApi<any>(`/employees/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
    delete: (id: string) =>
        fetchApi<void>(`/employees/${id}`, { method: 'DELETE' }),
};

// ==================== CUSTOMERS ====================
export const customersApi = {
    getAll: (params?: { membershipLevel?: string }) => {
        const query = new URLSearchParams(params as any).toString();
        return fetchApi<any[]>(`/customers${query ? `?${query}` : ''}`);
    },
    create: (data: any) =>
        fetchApi<any>('/customers', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    update: (id: string, data: any) =>
        fetchApi<any>(`/customers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
    addPoints: (id: string, points: number, totalSpent: number) =>
        fetchApi<any>(`/customers/${id}/points`, {
            method: 'PATCH',
            body: JSON.stringify({ points, totalSpent }),
        }),
};

// ==================== PAYMENTS ====================
export const paymentsApi = {
    getAll: (params?: { status?: string; method?: string; date?: string }) => {
        const query = new URLSearchParams(params as any).toString();
        return fetchApi<any[]>(`/payments${query ? `?${query}` : ''}`);
    },
    getById: (id: string) => fetchApi<any>(`/payments/${id}`),
    create: (data: { sessionId: string; staffId: string; customerId?: string; method?: string; discount?: number }) =>
        fetchApi<any>('/payments', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    complete: (id: string, method?: string) =>
        fetchApi<any>(`/payments/${id}/complete`, {
            method: 'PATCH',
            body: JSON.stringify({ method }),
        }),
    refund: (id: string, notes?: string) =>
        fetchApi<any>(`/payments/${id}/refund`, {
            method: 'PATCH',
            body: JSON.stringify({ notes }),
        }),
    getInvoice: (paymentId: string) =>
        fetchApi<any>(`/payments/${paymentId}/invoice`),
};

// ==================== REPORTS ====================
export const reportsApi = {
    daily: (date?: string) => {
        const query = date ? `?date=${date}` : '';
        return fetchApi<any>(`/reports/daily${query}`);
    },
    monthly: (year?: number, month?: number) => {
        const params = new URLSearchParams();
        if (year) params.set('year', year.toString());
        if (month) params.set('month', month.toString());
        const query = params.toString();
        return fetchApi<any>(`/reports/monthly${query ? `?${query}` : ''}`);
    },
};
