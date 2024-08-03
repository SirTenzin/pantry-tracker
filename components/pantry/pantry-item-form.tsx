import { FormEvent, useState } from 'react';
import { client } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';

export function PantryItemForm({ onItemAdded }: { onItemAdded: () => void }) {
  const { toast } = useToast();
  const { data: session } = useSession();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const newItem = {
      name: formData.get('name') as string,
      quantity: parseInt(formData.get('quantity') as string, 10),
      owner: btoa(session?.user?.email as string)
    };

    const { error } = await client.supabase.from('pantry_items').insert(newItem);

    if (error) {
      toast({
        title: 'Error adding item',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      onItemAdded();
      toast({
        title: 'Item added',
        description: 'The new pantry item has been added successfully.'
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a new pantry item</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className='grid grid-cols-3 gap-4'>
            <Input
              name="name"
              placeholder="Item name"
              required
            />
            <Input
              name="quantity"
              type="number"
              defaultValue={1}
              placeholder="Quantity"
              required
            />
          <Button type="submit">Add</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}