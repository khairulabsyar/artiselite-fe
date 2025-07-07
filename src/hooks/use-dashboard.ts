'use client';

import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/api';
import { ActivityLog, DashboardSummary, TransactionVolume } from '@/lib/types';

export function useDashboardSummary() {
  return useQuery<DashboardSummary>({
    queryKey: ['dashboardSummary'],
    queryFn: () => fetcher<DashboardSummary>('/api/dashboard/summary'),
  });
}

export function useDashboardActivity() {
  return useQuery<ActivityLog[]>({
    queryKey: ['dashboardActivity'],
    queryFn: () => fetcher<ActivityLog[]>('/api/dashboard/activity'),
  });
}

export function useDashboardTransactionVolume() {
  return useQuery<TransactionVolume[]>({
    queryKey: ['dashboardTransactionVolume'],
    queryFn: () => fetcher<TransactionVolume[]>('/api/dashboard/transaction-volume'),
  });
}
