import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import PantryTracker from '@/components/pantry/pantry-tracker';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Pantry', link: '/dashboard/pantry' }
];

export default function PantryPage() {
  return (
    <PageContainer scrollable>
      <div className="flex-grow overflow-y-auto">
        <div className="space-y-4 p-4">
          <PantryTracker />
        </div>
      </div>
    </PageContainer>
  );
}