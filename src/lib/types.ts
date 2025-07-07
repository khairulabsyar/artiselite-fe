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
  actor: ApiUser;
  verb: string;
  object_repr: string;
  timestamp: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  price: string;
  supplier: string;
}

export interface DashboardSummary {
  total_inventory_value: number;
  total_inventory_items: number;
  low_stock_alerts: number;
  total_inbound: number;
  total_outbound: number;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Supplier {
  id: number;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  tags: string; // Backend has tags as a string, not an array
  description: string;
  category: string; // Backend has category as a string, not a relation
  quantity: number;
  low_stock_threshold: number;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface TransactionVolume {
  date: string;
  inbound: number;
  outbound: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Payload for creating a new product.
 * Omits read-only fields to match backend requirements.
 */
export type CreateProductPayload = Omit<Product, 'id' | 'created_at' | 'updated_at'>;

/**
 * Payload for updating an existing product.
 * All fields are partial, but the product 'id' is required.
 */
export type UpdateProductPayload = Partial<CreateProductPayload> & {
  id: number;
};
