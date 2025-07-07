export interface ApiUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  date_joined: string;
}

export interface ActivityLog {
  id: number;
  actor: ApiUser | string | null;
  action: number;
  timestamp: string;
  object_repr: string;
  changes_dict: object;
}
