'use client';

import { fetcher } from '@/lib/api';
import { Category, CreateProductPayload, Product, Supplier, UpdateProductPayload } from '@/lib/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// NOTE: For write operations (POST, PATCH), the backend expects category and supplier IDs,
// not the full nested objects. These payload types are defined in types.ts.

/**
 * Fetches a list of all products.
 */
export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => fetcher('/api/products/'),
  });
}

/**
 * Fetches a list of all categories.
 */
export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => fetcher('/api/categories/'),
  });
}

/**
 * Fetches a list of all suppliers.
 */
export function useSuppliers() {
  return useQuery<Supplier[]>({
    queryKey: ['suppliers'],
    queryFn: () => fetcher('/api/suppliers/'),
  });
}

/**
 * A mutation hook for creating a new product.
 */
export function useAddProduct() {
  const queryClient = useQueryClient();
  return useMutation<Product, Error, CreateProductPayload>({
    mutationFn: (newProduct) =>
      fetcher('/api/products/', {
        method: 'POST',
        body: JSON.stringify(newProduct),
        headers: { 'Content-Type': 'application/json' },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

/**
 * Alias for useAddProduct to match component usage
 */
export const useCreateInventoryItem = useAddProduct;

/**
 * A mutation hook for updating an existing product.
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation<Product, Error, UpdateProductPayload>({
    mutationFn: (product) =>
      fetcher(`/api/products/${product.id}/`, {
        method: 'PATCH',
        body: JSON.stringify(product),
        headers: { 'Content-Type': 'application/json' },
      }),
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      // Immediately update the specific product in the cache
      queryClient.setQueryData(['products', { id: updatedProduct.id }], updatedProduct);
    },
  });
}

/**
 * Alias for useUpdateProduct to match component usage
 */
export const useUpdateInventoryItem = useUpdateProduct;

/**
 * A mutation hook for deleting a product.
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) =>
      fetcher(`/api/products/${id}/`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      // Force an immediate refetch of the products list
      queryClient.invalidateQueries({ queryKey: ['products'], refetchType: 'all' });
    },
  });
}

/**
 * Alias for useDeleteProduct to match component usage
 */
export const useDeleteInventoryItem = useDeleteProduct;
