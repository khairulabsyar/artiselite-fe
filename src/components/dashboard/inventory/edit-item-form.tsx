'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateInventoryItem } from '@/hooks/use-inventory';
import { Product } from '@/lib/types';

interface EditItemFormProps {
  item: Product;
  onFinished: () => void;
}

export function EditItemForm({ item, onFinished }: EditItemFormProps) {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [isArchived, setIsArchived] = useState(false);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setSku(item.sku);
      setTags(item.tags);
      setDescription(item.description);
      setCategory(item.category);
      setQuantity(item.quantity);
      setLowStockThreshold(item.low_stock_threshold);
      setIsArchived(item.is_archived);
    }
  }, [item]);

  const updateItemMutation = useUpdateInventoryItem();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedItem = {
      id: item.id,
      name,
      sku,
      tags, // Send tags as string, backend expects it this way
      description,
      category, // Category is a string in the backend
      quantity: Number(quantity) || 0, // Ensure quantity is never null
      low_stock_threshold: lowStockThreshold || 0, // Ensure threshold is never null
      is_archived: isArchived
    };
    updateItemMutation.mutate(updatedItem, {
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
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" value={sku} onChange={(e) => setSku(e.target.value)} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
          <Input id="lowStockThreshold" type="number" value={lowStockThreshold} onChange={(e) => setLowStockThreshold(Number(e.target.value))} required />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isArchived"
          checked={isArchived}
          onChange={(e) => setIsArchived(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <Label htmlFor="isArchived" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Archive this item
        </Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onFinished}>
          Cancel
        </Button>
        <Button type="submit" disabled={updateItemMutation.isPending}>
          {updateItemMutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
