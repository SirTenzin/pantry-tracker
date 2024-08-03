import PageContainer from '@/components/layout/page-container';
import { AITools } from '@/components/ai/tools';

export default function AIPage() {
  return (
    <PageContainer scrollable>
      <div className="flex-grow overflow-y-auto">
        <div className="space-y-4 p-4">
          <AITools />
        </div>
      </div>
    </PageContainer>
  );
}