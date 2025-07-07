'use client';

import { Overview } from '@/components/dashboard/overview';
import { RecentSales } from '@/components/dashboard/recent-sales';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { ActivityLog, ApiUser } from '@/lib/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Activity, CreditCard, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Define the structure for the API responses
interface SummaryData {
  total_inventory_value: number;
  total_inventory_items: number;
  low_stock_alerts: number;
  total_inbound: number;
  total_outbound: number;
}

interface TransactionVolume {
  date: string;
  inbound: number;
  outbound: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data: user, isLoading: isLoadingUser } = useQuery<ApiUser>({
    queryKey: ['user', 'me'],
    queryFn: () => fetch('/api/users/me').then((res) => res.json()),
    enabled: isClient,
  });

  const { data: summary, isLoading: isLoadingSummary } = useQuery<SummaryData>({
    queryKey: ['dashboardSummary'],
    queryFn: () => fetch('/api/dashboard/summary').then((res) => res.json()),
    enabled: isClient,
  });

  const { data: activity, isLoading: isLoadingActivity } = useQuery<ActivityLog[]>({
    queryKey: ['dashboardActivity'],
    queryFn: () => fetch('/api/dashboard/activity').then((res) => res.json()),
    enabled: isClient,
  });

  const { data: transactionVolume, isLoading: isLoadingTransactionVolume } = useQuery<TransactionVolume[]>({
    queryKey: ['dashboardTransactionVolume'],
    queryFn: () => fetch('/api/dashboard/transaction-volume').then((res) => res.json()),
    enabled: isClient,
  });

  const handleLogout = useMutation({
    mutationFn: () => fetch('/api/auth/logout', { method: 'POST' }),
    onSuccess: () => {
      router.push('/login');
    },
  });

  const getUserDisplayName = () => {
    if (!user) return 'Guest';
    return user.first_name || user.username;
  };

  return (
    <>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            {isLoadingUser ? <Skeleton className="h-8 w-48" /> : `Welcome, ${getUserDisplayName()}!`}
          </h2>
          <div className="flex items-center space-x-2">
            <Button onClick={() => handleLogout.mutate()}>Logout</Button>
          </div>
        </div>
        <Tabs
          defaultValue="overview"
          className="space-y-4"
        >
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
                  <p className="text-xs text-muted-foreground">
                    Value: ${isLoadingSummary || !summary ? '...' : summary.total_inventory_items}
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
                <CardContent className="pl-2">
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
