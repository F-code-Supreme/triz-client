import { Plus, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PackageStatus } from '@/features/packages/types';

import type { Package } from '@/features/packages/types';

interface Feature {
  iconUrl: string;
  description: string;
}

interface PackageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  package?: Package | null;
  onSave: (pkg: Partial<Package>) => void;
}

const PackageDialog: React.FC<PackageDialogProps> = ({
  open,
  onOpenChange,
  package: editPackage,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    priceInTokens: 0,
    durationInDays: 0,
    chatTokenPerDay: 0,
    status: PackageStatus.ACTIVE,
    features: [] as Feature[],
  });

  const [newFeature, setNewFeature] = useState({
    iconUrl: '',
    description: '',
  });

  useEffect(() => {
    if (editPackage) {
      setFormData({
        name: editPackage.name,
        priceInTokens: editPackage.priceInTokens,
        durationInDays: editPackage.durationInDays,
        chatTokenPerDay: editPackage.chatTokenPerDay,
        status: editPackage.status,
        features: [...editPackage.features],
      });
    } else {
      setFormData({
        name: '',
        priceInTokens: 0,
        durationInDays: 0,
        chatTokenPerDay: 0,
        status: PackageStatus.ACTIVE,
        features: [],
      });
    }
    setNewFeature({ iconUrl: '', description: '' });
  }, [editPackage, open]);

  const handleAddFeature = () => {
    if (newFeature.iconUrl && newFeature.description) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, { ...newFeature }],
      }));
      setNewFeature({ iconUrl: '', description: '' });
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    const packageData: Partial<Package> = {
      ...formData,
      ...(editPackage && { id: editPackage.id }),
    };
    onSave(packageData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editPackage ? 'Edit Package' : 'Create New Package'}
          </DialogTitle>
          <DialogDescription>
            {editPackage
              ? 'Update the package details below.'
              : 'Fill in the details to create a new package.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Package Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Premium Plan"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="priceInTokens">Price (Tokens)</Label>
              <Input
                id="priceInTokens"
                type="number"
                value={formData.priceInTokens}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priceInTokens: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="1000"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="durationInDays">Duration (Days)</Label>
              <Input
                id="durationInDays"
                type="number"
                value={formData.durationInDays}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    durationInDays: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="chatTokenPerDay">Chat Tokens Per Day</Label>
              <Input
                id="chatTokenPerDay"
                type="number"
                value={formData.chatTokenPerDay}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    chatTokenPerDay: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="500"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: PackageStatus) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border-t pt-4">
            <Label className="text-base font-semibold">Features</Label>
            <div className="mt-3 space-y-3">
              {formData.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2 border rounded-md bg-muted/50"
                >
                  <img
                    src={feature.iconUrl}
                    alt="icon"
                    className="w-5 h-5 mt-0.5"
                  />
                  <p className="flex-1 text-sm">{feature.description}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFeature(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-3 border rounded-md p-3 bg-muted/30">
              <Label className="text-sm">Add New Feature</Label>
              <div className="grid gap-2">
                <Input
                  placeholder="Icon URL"
                  value={newFeature.iconUrl}
                  onChange={(e) =>
                    setNewFeature({ ...newFeature, iconUrl: e.target.value })
                  }
                />
                <Input
                  placeholder="Feature description"
                  value={newFeature.description}
                  onChange={(e) =>
                    setNewFeature({
                      ...newFeature,
                      description: e.target.value,
                    })
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddFeature}
                  disabled={!newFeature.iconUrl || !newFeature.description}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Feature
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {editPackage ? 'Update Package' : 'Create Package'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PackageDialog;
