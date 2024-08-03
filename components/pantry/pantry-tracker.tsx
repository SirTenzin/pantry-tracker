'use client';

import { useState, useEffect } from 'react';
import { client } from '@/lib/supabase';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { PantryItem } from '@/components/pantry/pantry-item';
import { PantryItemForm } from '@/components/pantry/pantry-item-form';
import { PantrySearch } from '@/components/pantry/pantry-search';
import { PantryInsights } from '@/components/pantry/pantry-insights';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { useSession } from 'next-auth/react';
import { PantryItemIncrementer } from './pantry-increment';
import { usePantry } from '@/hooks/usePantry';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Pantry', link: '/dashboard/pantry' }
];

export default function PantryTracker() {
  const { data: session } = useSession()
  const { items, setItems, fetchItems } = usePantry();
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    if (session?.user?.email) {
      fetchItems(btoa(session.user.email));
    }
  }, [session]);

  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  const handleSearch = (searchTerm: string) => {
    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-2xl font-bold">Pantry Tracker</h1>
        <PantryItemForm onItemAdded={() => fetchItems(btoa(session?.user?.email as string))} />
        <PantrySearch onSearch={handleSearch} />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <PantryItemIncrementer itemId={item.id} />
                </TableCell>
                <TableCell>
                  <PantryItem itemId={item.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <PantryInsights items={items} />
      </div>
    </PageContainer>
  );
}