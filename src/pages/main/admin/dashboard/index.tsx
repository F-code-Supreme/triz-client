import { useState } from 'react';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  RevenueSection,
  ChatForumSection,
  mockDashboardData,
  GameSection,
} from '@/features/dashboard';
import { AdminLayout } from '@/layouts/admin-layout';

const AdminDashboardPage = () => {
  const dashboardData = mockDashboardData;
  const [activeTab, setActiveTab] = useState('revenue');

  return (
    <AdminLayout meta={{ title: 'Admin Dashboard' }}>
      <div className="space-y-8 p-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to the admin panel.</p>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-end">
            <TabsList>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="games">Games</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="revenue" className="mt-6">
            <RevenueSection data={dashboardData.revenue} />
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <ChatForumSection chat={dashboardData.chat} />
          </TabsContent>

          <TabsContent value="games" className="mt-6">
            <GameSection data={dashboardData.games} />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
