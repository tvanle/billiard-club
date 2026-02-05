import { create } from 'zustand';
import { api, Table } from '@/lib/api';

interface TableStore {
    tables: Table[];
    loading: boolean;
    error: string | null;
    fetchTables: () => Promise<void>;
    updateTableStatus: (id: string, status: Table['status']) => Promise<void>;
    addTable: (table: Table) => void;
    updateTable: (table: Table) => void;
    removeTable: (id: string) => void;
}

export const useTableStore = create<TableStore>((set, get) => ({
    tables: [],
    loading: false,
    error: null,

    fetchTables: async () => {
        set({ loading: true, error: null });
        const res = await api.getTables();
        if (res.success && res.data) {
            set({ tables: res.data, loading: false });
        } else {
            set({ error: res.error || 'Failed to fetch tables', loading: false });
        }
    },

    updateTableStatus: async (id: string, status: Table['status']) => {
        const res = await api.updateTableStatus(id, status);
        if (res.success && res.data) {
            set({
                tables: get().tables.map((t) => (t.id === id ? res.data! : t)),
            });
        }
    },

    addTable: (table: Table) => {
        set({ tables: [...get().tables, table] });
    },

    updateTable: (table: Table) => {
        set({
            tables: get().tables.map((t) => (t.id === table.id ? table : t)),
        });
    },

    removeTable: (id: string) => {
        set({ tables: get().tables.filter((t) => t.id !== id) });
    },
}));
