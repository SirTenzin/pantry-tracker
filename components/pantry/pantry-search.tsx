import { Input } from '@/components/ui/input';

export function PantrySearch({ onSearch }: { onSearch: (value: string) => void }) {
  return (
    <Input
      placeholder="Search pantry items..."
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}