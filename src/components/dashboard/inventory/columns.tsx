'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronsUpDown, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { EditItemForm } from './edit-item-form';
import { useDeleteInventoryItem } from '@/hooks/use-inventory';

const ActionsCell = ({ item }: { item: Product }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteItemMutation = useDeleteInventoryItem();

  // Handle delete action with proper feedback and dialog closing
  const handleDelete = async () => {
    try {
      await deleteItemMutation.mutateAsync(item.id);
      // Close the dialog after successful deletion
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting item:', error);
      // Keep dialog open if there's an error
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>Edit item</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-red-600">Delete item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <EditItemForm item={item} onFinished={() => setIsEditDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteItemMutation.isPending}>
              {deleteItemMutation.isPending ? 'Deleting...' : 'Continue'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'sku',
    header: 'SKU',
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Name
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
  },
  {
    id: 'stockStatus',
    header: () => <div>Stock Status</div>,
    cell: ({ row }) => {
      const quantity = row.original.quantity;
      const threshold = row.original.low_stock_threshold;
      
      if (quantity <= 0) {
        return <Badge variant="destructive">Out of Stock</Badge>;
      } else if (quantity <= threshold) {
        return <Badge variant="secondary" className="bg-amber-500 hover:bg-amber-600">Low Stock</Badge>;
      } else {
        return <Badge variant="secondary" className="bg-green-500 hover:bg-green-600">In Stock</Badge>;
      }
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsCell item={row.original} />,
  },
];
