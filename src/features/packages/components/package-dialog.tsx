import { Plus, X, Upload } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadList,
  FileUploadItem,
  FileUploadItemPreview,
  FileUploadItemMetadata,
  FileUploadItemProgress,
  FileUploadItemDelete,
  FileUploadTrigger,
} from '@/components/ui/file-upload';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NumberInput } from '@/components/ui/number-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUploadFileMutation } from '@/features/book/services/mutations';
import { PackageStatus } from '@/features/packages/types';
// import { validateUrl } from '@/utils';
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
  const { t } = useTranslation('pages.admin');
  const ERROR_CLASS = 'border-red-500';

  const [formData, setFormData] = useState({
    name: '',
    priceInTokens: 0,
    durationInDays: 0,
    chatTokenPerDay: 0,
    status: PackageStatus.ACTIVE,
    features: [] as Feature[],
  });
  // For NumberInput price
  const [price, setPrice] = useState<number>(0);

  const [newFeature, setNewFeature] = useState({
    iconUrl: '',
    description: '',
  });

  const [iconUrlError, setIconUrlError] = useState<string>('');
  const [iconFiles, setIconFiles] = useState<File[]>([]);
  const uploadMutation = useUploadFileMutation();
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
      setPrice(editPackage.priceInTokens || 0);
    } else {
      setFormData({
        name: '',
        priceInTokens: 0,
        durationInDays: 0,
        chatTokenPerDay: 0,
        status: PackageStatus.ACTIVE,
        features: [],
      });
      setPrice(0);
    }
    setNewFeature({ iconUrl: '', description: '' });
    setIconUrlError('');
    setFormErrors({});
    setIconFiles([]);
  }, [editPackage, open]);

  // Sync price to formData
  useEffect(() => {
    setFormData((prev) => ({ ...prev, priceInTokens: price }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price]);

  const validateForm = () => {
    const errors: {
      name?: string;
      priceInTokens?: string;
      durationInDays?: string;
      chatTokenPerDay?: string;
      features?: string;
    } = {};

    if (!formData.name.trim()) {
      errors.name = t('packages.dialog.package_name_required');
    }

    if (formData.priceInTokens <= 0) {
      errors.priceInTokens = t('packages.dialog.price_required');
    }

    if (formData.durationInDays <= 0) {
      errors.durationInDays = t('packages.dialog.duration_required');
    }

    if (formData.chatTokenPerDay <= 0) {
      errors.chatTokenPerDay = t('packages.dialog.daily_required');
    }

    if (formData.features.length === 0) {
      errors.features = t('packages.dialog.features_required');
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // const handleIconUrlChange = (url: string) => {
  //   setNewFeature({ ...newFeature, iconUrl: url });
  //   // Validate URL with image requirement
  //   const error = validateUrl(url, true);
  //   setIconUrlError(error);
  //   setIconFiles([]);
  // };

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
            {editPackage
              ? t('packages.dialog.edit_title')
              : t('packages.dialog.create_title')}
          </DialogTitle>
        </DialogHeader>

        <div className="grid">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="name">
                {t('packages.dialog.package_name')}{' '}
                <span className="text-red-500">*</span>
              </Label>
              <span className="text-xs text-gray-400">
                {formData.name.length}/200
              </span>
            </div>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (formErrors.name) {
                  setFormErrors({ ...formErrors, name: undefined });
                }
              }}
              maxLength={200}
              minLength={3}
              placeholder={t('packages.dialog.package_name_placeholder')}
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
                {t('packages.dialog.price_trizilium')}{' '}
                <span className="text-red-500">*</span>
              </Label>
              <NumberInput
                value={price}
                onValueChange={(val) => {
                  setPrice(val ?? 0);
                  if (formErrors.priceInTokens) {
                    setFormErrors({ ...formErrors, priceInTokens: undefined });
                  }
                }}
                min={1000}
                stepper={1}
                thousandSeparator=","
                suffix=" Ƶ"
                placeholder={
                  t('packages.dialog.price_placeholder') || 'Nhập giá'
                }
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
                {t('packages.dialog.duration_days')}{' '}
                <span className="text-red-500">*</span>
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
                placeholder={t('packages.dialog.duration_placeholder')}
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
                {t('packages.dialog.daily_trizilium')}{' '}
                <span className="text-red-500">*</span>
              </Label>
              <NumberInput
                value={formData.chatTokenPerDay}
                onValueChange={(val) => {
                  setFormData((prev) => ({
                    ...prev,
                    chatTokenPerDay: val ?? 0,
                  }));
                  if (formErrors.chatTokenPerDay) {
                    setFormErrors({
                      ...formErrors,
                      chatTokenPerDay: undefined,
                    });
                  }
                }}
                min={1}
                stepper={1}
                thousandSeparator=","
                suffix=" Ƶ"
                placeholder={
                  t('packages.dialog.daily_placeholder') || 'Nhập số token/ngày'
                }
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
              <Label htmlFor="status">{t('packages.dialog.status')}</Label>
              <Select
                value={formData.status}
                onValueChange={(value: PackageStatus) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue
                    placeholder={t('packages.dialog.status_placeholder')}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">
                    {t('packages.dialog.status_active')}
                  </SelectItem>
                  <SelectItem value="INACTIVE">
                    {t('packages.dialog.status_inactive')}
                  </SelectItem>
                </SelectContent>
              </Select>
              <div className="min-h-[20px]"></div>
            </div>
          </div>

          <div className="">
            <Label className="text-base font-semibold">
              {t('packages.dialog.features_label')}{' '}
              <span className="text-red-500">*</span>
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
              <Label className="text-sm">
                {t('packages.dialog.add_new_feature')}
              </Label>
              <div className="grid gap-2">
                <div className="space-y-1">
                  {/* <Input
                    placeholder={t('packages.dialog.icon_url_placeholder')}
                    value={newFeature.iconUrl}
                    onChange={(e) => handleIconUrlChange(e.target.value)}
                    className={iconUrlError ? ERROR_CLASS : ''}
                  /> */}
                  <div className="my-2">
                    <FileUpload
                      value={iconFiles}
                      onValueChange={(files) => {
                        setIconFiles(files);
                        if (files.length > 0) {
                          setIconUrlError('');
                        }
                      }}
                      onUpload={async (
                        files,
                        { onProgress, onSuccess, onError },
                      ) => {
                        for (const file of files) {
                          try {
                            onProgress(file, 0);
                            const response = await uploadMutation.mutateAsync({
                              file,
                            });
                            if (response.data) {
                              setNewFeature((prev) => ({
                                ...prev,
                                iconUrl: response.data,
                              }));
                              setIconUrlError('');
                              onProgress(file, 100);
                              onSuccess(file);
                            }
                          } catch (error) {
                            onError(
                              file,
                              error instanceof Error
                                ? error
                                : new Error('Upload failed'),
                            );
                          }
                        }
                      }}
                      accept="image/*"
                      maxFiles={1}
                      maxSize={5 * 1024 * 1024}
                    >
                      <FileUploadDropzone className="rounded-lg border-2 border-dashed p-3 mt-2">
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">
                            {t('packages.dialog.upload_image') ||
                              'Kéo thả hoặc tải lên icon'}
                          </div>
                          <FileUploadTrigger className="px-2 py-1 border rounded-md text-xs bg-background hover:bg-accent transition-colors inline-flex items-center gap-2 mt-2">
                            <Upload className="w-4 h-4" />
                            {t('packages.dialog.upload_image') || 'Tải ảnh lên'}
                          </FileUploadTrigger>
                        </div>
                        <FileUploadList className="mt-2 space-y-1">
                          {iconFiles.map((file) => (
                            <FileUploadItem key={file.name} value={file}>
                              <div className="flex items-center gap-2 w-full">
                                <FileUploadItemPreview />
                                <div className="flex-1">
                                  <FileUploadItemMetadata />
                                  <FileUploadItemProgress />
                                </div>
                                <FileUploadItemDelete />
                              </div>
                            </FileUploadItem>
                          ))}
                        </FileUploadList>
                      </FileUploadDropzone>
                    </FileUpload>
                  </div>
                  {iconUrlError && (
                    <p className="text-xs text-red-500">{iconUrlError}</p>
                  )}
                  {newFeature.iconUrl && !iconUrlError && (
                    <div className="flex items-center gap-2 text-xs text-green-600">
                      <span>{t('packages.dialog.valid_image_url')}</span>
                    </div>
                  )}
                </div>
                <Input
                  placeholder={t(
                    'packages.dialog.feature_description_placeholder',
                  )}
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
                  {t('packages.dialog.add_feature')}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('packages.dialog.cancel')}
          </Button>
          <Button onClick={handleSubmit}>
            {editPackage
              ? t('packages.dialog.update_package')
              : t('packages.dialog.create_package')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PackageDialog;
