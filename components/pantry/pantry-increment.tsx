import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { usePantry } from '@/hooks/usePantry';

export function PantryItemIncrementer({ itemId }: { itemId: number }) {
  const { updateItem, items } = usePantry();
  const item = items.find(i => i.id === itemId);
  const { toast } = useToast();

  const handleIncrement = async (increment: number) => {
    if (!item) return;
    try {
      const updatedItem = { ...item, quantity: item.quantity + increment };
      await updateItem(updatedItem);
      toast({
        title: 'Item updated',
        description: 'The pantry item quantity has been updated successfully.'
      });
    } catch (error: Error | any) {
      toast({
        title: 'Error updating item',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  if (!item) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <Button variant="outline" className="rounded-full w-1" onClick={() => handleIncrement(-1)}>-</Button>
      <div>{item.quantity}</div>
      <Button variant="outline" className="rounded-full w-1" onClick={() => handleIncrement(1)}>+</Button>
    </div>
  );
}