"use client";

import { useEffect, useState } from 'react';
import { client } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import PageContainer from '@/components/layout/page-container';
import { PantryInsights } from '@/components/pantry/pantry-insights';
import { useSession } from 'next-auth/react';
import { usePantry } from '@/hooks/usePantry';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

interface PantryItemType {
  id: number;
  name: string;
  quantity: number;
}

export default function Page() {
  const { items, setItems } = usePantry();
  const { data: session } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    fetchPantryItems();
  }, []);

  const fetchPantryItems = async () => {
    const { data, error }: any = await client.supabase.from('pantry_items').select('*').eq("owner", btoa(session?.user?.email as string));
    if (error) {
      toast({
        title: 'Error fetching pantry items',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      setItems(data);
    }
  };

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome back 👋
          </h2>
        </div>
        <PantryInsights items={items}/>
      </div>
    </PageContainer>
  );
}
