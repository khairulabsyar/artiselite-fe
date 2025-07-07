'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/use-inventory';
import { columns } from '@/components/dashboard/inventory/columns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AddItemForm } from '@/components/dashboard/inventory/add-item-form';
import { DataTable } from '@/components/ui/data-table';

export default function InventoryPage() {
  const { data: inventory, isLoading } = useProducts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Inventory</h1>
        <Dialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        >
          <DialogTrigger asChild>
            <Button>Add New Item</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Inventory Item</DialogTitle>
            </DialogHeader>
            <AddItemForm onFinished={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      {inventory && (
        <DataTable
          columns={columns}
          data={inventory}
        />
      )}
    </div>
  );
}
