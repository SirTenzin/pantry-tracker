import { create } from 'zustand';
import { client } from '@/lib/supabase';

type PantryItem = {
    id: number;
    name: string;
    quantity: number;
    owner: string;
}

interface PantryStore {
    items: PantryItem[];
    setItems: (items: PantryItem[]) => void;
    updateItem: (updatedItem: PantryItem) => Promise<void>;
    deleteItem: (itemId: number) => Promise<void>;
    fetchItems: (owner: string) => Promise<void>;
}

export const usePantry = create<PantryStore>((set) => ({
    items: [],
    setItems: (items) => set({ items }),
    updateItem: async (updatedItem) => {
        const { error } = await client.supabase
            .from('pantry_items')
            .update(updatedItem)
            .eq('id', updatedItem.id);
        
        if (!error) {
            set((state) => ({
                items: state.items.map(item => 
                    item.id === updatedItem.id ? updatedItem : item
                )
            }));
        } else {
            throw error;
        }
    },
    deleteItem: async (itemId) => {
        const { error } = await client.supabase
            .from('pantry_items')
            .delete()
            .eq('id', itemId);
        
        if (!error) {
            set((state) => ({
                items: state.items.filter(item => item.id !== itemId)
            }));
        } else {
            throw error;
        }
    },
    fetchItems: async (owner) => {
        const { data, error } = await client.supabase
            .from('pantry_items')
            .select('*')
            .eq("owner", owner);
        
        if (!error && data) {
            set({ items: data as PantryItem[] });
        } else {
            throw error;
        }
    }
}));