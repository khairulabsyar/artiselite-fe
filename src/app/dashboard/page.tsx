'use client';

import { Overview } from '@/components/dashboard/overview';
import { RecentSales } from '@/components/dashboard/recent-sales';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useDashboardActivity, useDashboardSummary, useDashboardTransactionVolume } from '@/hooks/use-dashboard';
import { Activity, CreditCard, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data: summary, isLoading: isLoadingSummary } = useDashboardSummary();
  const { data: activity, isLoading: isLoadingActivity } = useDashboardActivity();
  const { data: transactionVolume, isLoading: isLoadingTransactionVolume } = useDashboardTransactionVolume();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <div className="hidden md:block">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger
                value="analytics"
                disabled
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                disabled
              >
                Reports
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                disabled
              >
                Notifications
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="block md:hidden">
            <Select
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a tab" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Overview</SelectItem>
                <SelectItem
                  value="analytics"
                  disabled
                >
                  Analytics
                </SelectItem>
                <SelectItem
                  value="reports"
                  disabled
                >
                  Reports
                </SelectItem>
                <SelectItem
                  value="notifications"
                  disabled
                >
                  Notifications
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <TabsContent
            value="overview"
            className="space-y-4"
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    RM{isLoadingSummary || !summary ? '...' : summary.total_inventory_value}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isLoadingSummary || !summary ? '...' : summary.total_inventory_items} total items
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingSummary || !summary ? '...' : summary.low_stock_alerts}
                  </div>
                  <p className="text-xs text-muted-foreground">Items running low</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today&apos;s Inbound</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    +{isLoadingSummary || !summary ? '...' : summary.total_inbound}
                  </div>
                  <p className="text-xs text-muted-foreground">New items received</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today&apos;s Outbound</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    -{isLoadingSummary || !summary ? '...' : summary.total_outbound}
                  </div>
                  <p className="text-xs text-muted-foreground">Items shipped</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
              <Card className="col-span-1 lg:col-span-4">
                <CardHeader>
                  <CardTitle>Transaction Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  {isClient && !isLoadingTransactionVolume && transactionVolume && (
                    <Overview data={transactionVolume} />
                  )}
                </CardContent>
              </Card>
              <Card className="col-span-1 lg:col-span-3 flex flex-col">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest user actions in the system.</CardDescription>
                </CardHeader>
                <CardContent className="max-h-[350px] overflow-y-auto">
                  {isClient && !isLoadingActivity && activity && <RecentSales data={activity} />}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
