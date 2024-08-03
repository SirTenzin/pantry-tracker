import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const client: { 
    supabase: ReturnType<typeof createClient>,
    delete: (params: { name: string, quantity: number, owner: string, id: number }) => Promise<boolean>
} = {
    supabase: createClient(supabaseUrl, supabaseAnonKey),
    delete: async (item: { name: string, quantity: number, owner: string, id: number }): Promise<boolean> => {
        const { error } = await client.supabase.from('pantry_items').delete().eq('id', item.id);
        if (error) {
            throw new Error(error.message);
        } else {
            return true     
        }
    }
};