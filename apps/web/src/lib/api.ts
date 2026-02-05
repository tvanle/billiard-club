const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

export interface Table {
    id: string;
    name: string;
    type: 'POOL' | 'SNOOKER' | 'CAROM';
    status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE';
    hourlyRate: number;
    location?: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            const res = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });
            return await res.json();
        } catch (error) {
            return { success: false, error: 'Network error' };
        }
    }

    // Tables
    async getTables(): Promise<ApiResponse<Table[]>> {
        return this.request<Table[]>('/tables');
    }

    async getTable(id: string): Promise<ApiResponse<Table>> {
        return this.request<Table>(`/tables/${id}`);
    }

    async createTable(data: Partial<Table>): Promise<ApiResponse<Table>> {
        return this.request<Table>('/tables', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateTable(id: string, data: Partial<Table>): Promise<ApiResponse<Table>> {
        return this.request<Table>(`/tables/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async updateTableStatus(
        id: string,
        status: Table['status']
    ): Promise<ApiResponse<Table>> {
        return this.request<Table>(`/tables/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
    }

    async deleteTable(id: string): Promise<ApiResponse<void>> {
        return this.request<void>(`/tables/${id}`, {
            method: 'DELETE',
        });
    }
}

export const api = new ApiClient(API_URL);
