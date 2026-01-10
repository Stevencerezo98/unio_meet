
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminForm } from './AdminForm';
import { SystemApiManager } from './SystemApiManager';
import type { LandingContent } from '@/lib/landing-content';

export function AdminTabs({ content }: { content: LandingContent }) {
  return (
    <Tabs defaultValue="landing">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="landing">Contenido del Landing</TabsTrigger>
        <TabsTrigger value="system">Sistema y API Nativa</TabsTrigger>
      </TabsList>
      <TabsContent value="landing">
        <AdminForm content={content} />
      </TabsContent>
      <TabsContent value="system">
        <SystemApiManager />
      </TabsContent>
    </Tabs>
  );
}
