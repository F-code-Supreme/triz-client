import { Plus, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
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
import { validateUrl } from '@/utils';

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
  const ERROR_CLASS = 'border-red-500';

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

  const [iconUrlError, setIconUrlError] = useState<string>('');
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    priceInTokens?: string;
    durationInDays?: string;
    chatTokenPerDay?: string;
    features?: string;
  }>({});

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
    setIconUrlError('');
    setFormErrors({});
  }, [editPackage, open]);

  const validateForm = () => {
    const errors: {
      name?: string;
      priceInTokens?: string;
      durationInDays?: string;
      chatTokenPerDay?: string;
      features?: string;
    } = {};

    if (!formData.name.trim()) {
      errors.name = 'Package name is required';
    }

    if (formData.priceInTokens <= 0) {
      errors.priceInTokens = 'Price must be greater than 0';
    }

    if (formData.durationInDays <= 0) {
      errors.durationInDays = 'Duration must be greater than 0';
    }

    if (formData.chatTokenPerDay <= 0) {
      errors.chatTokenPerDay = 'Chat tokens per day must be greater than 0';
    }

    if (formData.features.length === 0) {
      errors.features = 'At least 1 feature is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleIconUrlChange = (url: string) => {
    setNewFeature({ ...newFeature, iconUrl: url });

    // Validate URL with image requirement
    const error = validateUrl(url, true);
    setIconUrlError(error);
  };

  const handleAddFeature = () => {
    if (newFeature.iconUrl && newFeature.description && !iconUrlError) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, { ...newFeature }],
      }));
      setNewFeature({ iconUrl: '', description: '' });
      setIconUrlError('');
      // Clear features error when adding a feature
      if (formErrors.features) {
        setFormErrors({ ...formErrors, features: undefined });
      }
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const packageData: Partial<Package> = {
      ...formData,
      ...(editPackage && { id: editPackage.id }),
    };
    onSave(packageData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editPackage ? 'Edit Package' : 'Create New Package'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid">
          <div className="space-y-1">
            <Label htmlFor="name">
              Package Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (formErrors.name) {
                  setFormErrors({ ...formErrors, name: undefined });
                }
              }}
              placeholder="e.g., Premium Plan"
              className={formErrors.name ? 'border-red-500' : ''}
            />
            <div className="min-h-[20px]">
              {formErrors.name && (
                <p className="text-xs text-red-500">{formErrors.name}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="priceInTokens">
                Price (Trizilium) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="priceInTokens"
                type="number"
                value={formData.priceInTokens}
                min={0}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    priceInTokens: parseInt(e.target.value) || 0,
                  });
                  if (formErrors.priceInTokens) {
                    setFormErrors({ ...formErrors, priceInTokens: undefined });
                  }
                }}
                placeholder="1000"
                className={formErrors.priceInTokens ? ERROR_CLASS : ''}
              />
              <div className="min-h-[20px]">
                {formErrors.priceInTokens && (
                  <p className="text-xs text-red-500">
                    {formErrors.priceInTokens}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="durationInDays">
                Duration (Days) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="durationInDays"
                min={0}
                type="number"
                value={formData.durationInDays}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    durationInDays: parseInt(e.target.value) || 0,
                  });
                  if (formErrors.durationInDays) {
                    setFormErrors({
                      ...formErrors,
                      durationInDays: undefined,
                    });
                  }
                }}
                placeholder="30"
                className={formErrors.durationInDays ? ERROR_CLASS : ''}
              />
              <div className="min-h-[20px]">
                {formErrors.durationInDays && (
                  <p className="text-xs text-red-500">
                    {formErrors.durationInDays}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="chatTokenPerDay">
                Daily Trizilium <span className="text-red-500">*</span>
              </Label>
              <Input
                id="chatTokenPerDay"
                min={0}
                type="number"
                value={formData.chatTokenPerDay}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    chatTokenPerDay: parseInt(e.target.value) || 0,
                  });
                  if (formErrors.chatTokenPerDay) {
                    setFormErrors({
                      ...formErrors,
                      chatTokenPerDay: undefined,
                    });
                  }
                }}
                placeholder="500"
                className={formErrors.chatTokenPerDay ? ERROR_CLASS : ''}
              />
              <div className="min-h-[20px]">
                {formErrors.chatTokenPerDay && (
                  <p className="text-xs text-red-500">
                    {formErrors.chatTokenPerDay}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
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
              <div className="min-h-[20px]"></div>
            </div>
          </div>

          <div className="">
            <Label className="text-base font-semibold">
              Features <span className="text-red-500">*</span>
            </Label>
            {formErrors.features && (
              <p className="text-xs text-red-500 mt-1">{formErrors.features}</p>
            )}
            <div className="mt-3 space-y-3 max-h-64 overflow-y-auto pr-2">
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

            <div className="mt-2 space-y-3 border rounded-md p-3 bg-muted/30">
              <Label className="text-sm">Add New Feature</Label>
              <div className="grid gap-2">
                <div className="space-y-1">
                  <Input
                    placeholder="Icon URL (e.g., https://example.com/icon.png)"
                    value={newFeature.iconUrl}
                    onChange={(e) => handleIconUrlChange(e.target.value)}
                    className={iconUrlError ? ERROR_CLASS : ''}
                  />
                  {iconUrlError && (
                    <p className="text-xs text-red-500">{iconUrlError}</p>
                  )}
                  {newFeature.iconUrl && !iconUrlError && (
                    <div className="flex items-center gap-2 text-xs text-green-600">
                      <span>✓ Valid image URL</span>
                    </div>
                  )}
                </div>
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
                  disabled={
                    !newFeature.iconUrl ||
                    !newFeature.description ||
                    !!iconUrlError
                  }
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
