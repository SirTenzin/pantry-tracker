import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { useSession } from 'next-auth/react';
import { usePantry } from '@/hooks/usePantry';

export function PantryItem({ itemId }: { itemId: number }) {
  const [isEditing, setIsEditing] = useState(false);
  const { updateItem, deleteItem, fetchItems, items } = usePantry();
  const item = items.find(i => i.id === itemId);
  const [editedItem, setEditedItem] = useState(item);
  const { toast } = useToast();
  const { data: session } = useSession();

  useEffect(() => {
    setEditedItem(item);
  }, [item]);

  const handleUpdate = async () => {
    if (!editedItem) return;
    try {
      await updateItem(editedItem);
      setIsEditing(false);
      toast({
        title: 'Item updated',
        description: 'The pantry item has been updated successfully.'
      });
    } catch (error: Error | any) {
      toast({
        title: 'Error updating item',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async () => {
    if (!item) return;
    try {
      await deleteItem(item.id);
      toast({
        title: 'Item deleted',
        description: 'The pantry item has been deleted successfully.'
      });
    } catch (error: Error | any) {
      toast({
        title: 'Error deleting item',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  if (!item) return null;

  return (
    <>
      <div className="flex items-center space-x-2">
        <Button onClick={() => setIsEditing(true)}>Edit</Button>
        <Button variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
      </div>
      {isEditing && (
        <Dialog open={isEditing} onOpenChange={(open) => {
          setIsEditing(open);
          if (open) {
            fetchItems(btoa(session?.user?.email as string));
          }
        }}>
          <DialogContent>
            <DialogHeader>Edit Item</DialogHeader>
            <div className="space-y-2">
              <Input
                value={editedItem?.name || ''}
                onChange={(e) =>
                  setEditedItem(prev => prev ? { ...prev, name: e.target.value } : undefined)
                }
              />
              <Input
                type="number"
                value={editedItem?.quantity || 0}
                onChange={(e) =>
                  setEditedItem(prev => prev ? { ...prev, quantity: parseInt(e.target.value) } : undefined)
                }
              />
            </div>
            <DialogFooter>
              <Button onClick={handleUpdate}>Save</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}