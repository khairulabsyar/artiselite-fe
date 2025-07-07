'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateInventoryItem } from '@/hooks/use-inventory';
import { Button } from '@/components/ui/button';

interface AddItemFormProps {
  onFinished: () => void;
}

export function AddItemForm({ onFinished }: AddItemFormProps) {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(''); // Category is a string in the backend
  const [quantity, setQuantity] = useState<number | null>(null);
  const [lowStockThreshold, setLowStockThreshold] = useState<number | null>(null);
  const [isArchived, setIsArchived] = useState(false);

  const createItemMutation = useCreateInventoryItem();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create payload matching backend API requirements and TypeScript type
    const newItem = {
      name,
      sku,
      tags, // Send tags as a string, backend expects it this way
      description,
      category,
      quantity: quantity || 0, // Ensure quantity is never null
      low_stock_threshold: lowStockThreshold || 0, // Ensure threshold is never null
      is_archived: isArchived
    };

    createItemMutation.mutate(newItem, {
      onSuccess: () => {
        onFinished();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            value={quantity === null ? '' : quantity}
            onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : null)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
          <Input
            id="lowStockThreshold"
            type="number"
            value={lowStockThreshold === null ? '' : lowStockThreshold}
            onChange={(e) => setLowStockThreshold(e.target.value ? Number(e.target.value) : null)}
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Input
          id="isArchived"
          type="checkbox"
          className="w-4 h-4"
          checked={isArchived}
          onChange={(e) => setIsArchived(e.target.checked)}
        />
        <Label htmlFor="isArchived">Archived</Label>
      </div>
      <Button
        type="submit"
        className="w-full mt-4"
        disabled={createItemMutation.isPending}
      >
        {createItemMutation.isPending ? 'Adding...' : 'Add Item'}
      </Button>
    </form>
  );
}
