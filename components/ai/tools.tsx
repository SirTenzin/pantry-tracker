'use client';

import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { PantryChatbot } from '@/components/ai/pantry-chatbot';
import { PantryCamera } from '@/components/ai/pantry-camera';
import { usePantry } from '@/hooks/usePantry';
import { useSession } from "next-auth/react";

const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'AI Tools', link: '/dashboard/ai' }
];
  
export function AITools() {
    const { items, setItems, fetchItems } = usePantry();
    const { data: session } = useSession()

    if(items.length < 1) {
        fetchItems(btoa(session?.user?.email as string))
    }

    return (
        <PageContainer>
            <div className="space-y-4">
                <Breadcrumbs items={breadcrumbItems} />
                <h1 className="text-2xl font-bold">AI Tools</h1>
                <PantryChatbot items={items} />
                <PantryCamera />
            </div>
        </PageContainer>
    )
}