'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetcher } from '@/lib/api';
import { ApiUser } from '@/lib/types';

export function useUser() {
  return useQuery<ApiUser>({ 
    queryKey: ['user', 'me'], 
    queryFn: () => fetcher<ApiUser>('/api/users/me'),
    retry: false,
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => fetcher('/api/auth/logout', { method: 'POST' }),
    onSuccess: () => {
      queryClient.clear(); // Clear all query cache on logout
      router.push('/login');
    },
  });
}
