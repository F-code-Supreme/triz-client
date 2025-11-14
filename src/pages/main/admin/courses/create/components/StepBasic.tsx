import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { useCreateCourseMutation } from '@/features/courses/services/mutations';

type Errors = {
  title?: string;
  description?: string;
  thumbnail?: string;
  price?: string;
  dealPrice?: string;
  shortDescription?: string;
};

type Props = {
  title: string;
  setTitle: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  thumbnailPreview: string | null;
  errors: Errors;
  goNext: () => void;
  goBack: () => void;
  step: number;
  setCourseId?: (id: string) => void;
};

const StepBasic: React.FC<Props> = ({
  title,
  setTitle,
  description,
  setDescription,
  thumbnailPreview,
  errors,
  goNext,
  goBack,
  step,
  setCourseId,
}) => {
  // use parent's `description` as the short description field
  const [durationInMinutes, setDurationInMinutes] = useState<number>(60);
  const [level, setLevel] = useState<'STARTER' | 'INTERMEDIATE' | 'ADVANCED'>(
    'STARTER',
  );
  const [price, setPrice] = useState<number>(0);
  const [dealPrice, setDealPrice] = useState<number>(0);
  const [priceDisplay, setPriceDisplay] = useState<string>('0');
  const [dealPriceDisplay, setDealPriceDisplay] = useState<string>('0');
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(
    thumbnailPreview ?? '',
  );
  const [localErrors, setLocalErrors] = useState<Errors>({});

  const createCourse = useCreateCourseMutation();

  const validate = () => {
    const e: Errors = {};
    if (!title.trim()) e.title = 'Title is required';
    if (!description.trim()) e.description = 'Short description is required';
    if (!thumbnailUrl.trim()) e.thumbnail = 'Thumbnail is required';
    if (!(price > 0)) e.price = 'Price must be greater than 0';
    setLocalErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;

    const payload = {
      title: title.trim(),
      description: description.trim(),
      shortDescription: description.trim(),
      durationInMinutes,
      level,
      price,
      dealPrice,
      // backend expects a URL; as a fallback use data URL preview
      thumbnailUrl: thumbnailUrl ?? '',
    };

    const getErrorMessage = (err: unknown) => {
      if (typeof err === 'object' && err !== null) {
        const e = err as Record<string, unknown>;
        if (typeof e.message === 'string') return e.message;
      }
      return 'An error occurred while creating the course.';
    };

    createCourse.mutate(payload, {
      onSuccess: (res: unknown) => {
        let id: string | undefined;
        if (typeof res === 'object' && res !== null && 'id' in res) {
          const maybeId = (res as Record<string, unknown>).id;
          if (typeof maybeId === 'string') {
            id = maybeId;
          }
        }
        if (id && setCourseId) setCourseId(id);
        // Proceed to next step on success
        goNext();
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  // react-query mutation result typing may vary across versions; access isLoading defensively
  const loading = Boolean(
    (createCourse as unknown as { isLoading?: boolean }).isLoading,
  );

  return (
    <div className="rounded-md border p-6">
      <h2 className="text-lg font-semibold mb-4">Basic information</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Thumbnail */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thumbnail URL
          </label>
          <input
            type="text"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            placeholder="https://example.com/image.jpg or data URL"
            className="mt-1 block w-full rounded-md border px-3 py-2"
            disabled={loading}
          />
          {thumbnailUrl && (
            <div className="mt-2 w-full h-28 overflow-hidden rounded-md border bg-white">
              <img
                src={thumbnailUrl}
                alt="thumbnail preview"
                className="object-cover w-full h-full"
                onError={(e) => {
                  // hide broken image by clearing src (keeps UI simple);
                  (e.target as HTMLImageElement).src = '';
                }}
              />
            </div>
          )}
          {(errors.thumbnail || localErrors.thumbnail) && (
            <p className="text-sm text-red-600 mt-2">
              {errors.thumbnail ?? localErrors.thumbnail}
            </p>
          )}
        </div>

        {/* Title + Description + meta */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Course Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter course title"
              disabled={loading}
            />
            {(errors.title || localErrors.title) && (
              <p className="text-sm text-red-600 mt-2">
                {errors.title ?? localErrors.title}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Short Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Short description for listings"
              disabled={loading}
            />
            {localErrors.description && (
              <p className="text-sm text-red-600 mt-2">
                {localErrors.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={durationInMinutes}
                onChange={(e) => setDurationInMinutes(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border px-3 py-2"
                min={1}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Level
              </label>
              <Select
                value={level}
                onValueChange={(v: string) =>
                  setLevel(v as 'STARTER' | 'INTERMEDIATE' | 'ADVANCED')
                }
              >
                <SelectTrigger className="w-full" disabled={loading}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STARTER">Starter</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                  <SelectItem value="ADVANCED">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="text"
                value={priceDisplay}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9.]/g, '');
                  setPriceDisplay(raw);
                  setPrice(raw ? Number(raw) : 0);
                }}
                onBlur={() => setPriceDisplay(price.toLocaleString())}
                onFocus={() => setPriceDisplay(String(price))}
                className="mt-1 block w-full rounded-md border px-3 py-2"
                disabled={loading}
              />
              {localErrors.price && (
                <p className="text-sm text-red-600 mt-2">{localErrors.price}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Deal Price
              </label>
              <input
                type="text"
                value={dealPriceDisplay}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9.]/g, '');
                  setDealPriceDisplay(raw);
                  setDealPrice(raw ? Number(raw) : 0);
                }}
                onBlur={() => setDealPriceDisplay(dealPrice.toLocaleString())}
                onFocus={() => setDealPriceDisplay(String(dealPrice))}
                className="mt-1 block w-full rounded-md border px-3 py-2"
                disabled={loading}
              />
              {localErrors.dealPrice && (
                <p className="text-sm text-red-600 mt-2">
                  {localErrors.dealPrice}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-between border-t pt-6">
        <div />
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={goBack}
            disabled={step === 1 || loading}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button type="button" onClick={handleCreate} disabled={loading}>
            {loading ? 'Creating...' : 'Create & Next'}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepBasic;
