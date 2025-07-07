'use client';

import { ApiUser, ActivityLog } from '@/lib/types';

interface RecentSalesProps {
  data: ActivityLog[];
}

const getActorName = (actor: ApiUser | string | null): string => {
  if (actor === null) {
    return 'System';
  }
  if (typeof actor === 'string') {
    return actor;
  }
  return actor.username;
};

export function RecentSales({ data }: RecentSalesProps) {
  return (
    <div className="space-y-8">
      {data.map((activity) => (
        <div key={activity.id} className="flex items-center">
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{getActorName(activity.actor)}</p>
            <p className="text-sm text-muted-foreground">{activity.object_repr}</p>
          </div>
          <div className="ml-auto font-medium">{new Date(activity.timestamp).toLocaleTimeString()}</div>
        </div>
      ))}
    </div>
  );
}
