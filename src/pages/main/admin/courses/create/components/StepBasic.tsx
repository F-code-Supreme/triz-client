import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  useCreateCourseMutation,
  useUpdateCourseMutation,
} from '@/features/courses/services/mutations';
import { useGetCourseByIdQuery } from '@/features/courses/services/queries';
import { useUploadFileMutation } from '@/features/media/services/mutations';

import type { Course } from '@/features/courses/types';

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
  setCourseId,
}) => {
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
  const uploadFile = useUploadFileMutation();
  const [localErrors, setLocalErrors] = useState<Errors>({});
  const [existingCourseId, setExistingCourseId] = useState<string | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);

  const { data: existingCourse } = useGetCourseByIdQuery(draftId ?? undefined);
  const [serverPopulated, setServerPopulated] = useState<boolean>(false);
  const createCourse = useCreateCourseMutation();
  const updateCourse = useUpdateCourseMutation(existingCourseId ?? '');

  const restoreDraft = () => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('createCourseDraft_v1');
      if (!raw) return;
      const saved = JSON.parse(raw) as Record<string, unknown>;
      if (!saved) return;

      const id = typeof saved.id === 'string' && saved.id ? saved.id : null;
      // If there's an id, defer restoring until we verify the server has the course.
      if (id) {
        setDraftId(id);
        return;
      }

      const payload = (saved.payload ?? saved) as Record<string, unknown>;

      const setIfString = (key: string, setter: (v: string) => void) => {
        const val = payload[key];
        if (typeof val === 'string') setter(val);
      };
      const setIfNumber = (key: string, setter: (v: number) => void) => {
        const val = payload[key];
        if (typeof val === 'number') setter(val);
      };

      setIfString('title', setTitle);
      setIfString('description', setDescription);
      setIfNumber('durationInMinutes', setDurationInMinutes);

      const levelVal = payload.level;
      if (['STARTER', 'INTERMEDIATE', 'ADVANCED'].includes(String(levelVal)))
        setLevel(levelVal as 'STARTER' | 'INTERMEDIATE' | 'ADVANCED');

      if (typeof payload.price === 'number') {
        setPrice(payload.price);
        setPriceDisplay(String(payload.price));
      }

      if (typeof payload.dealPrice === 'number') {
        setDealPrice(payload.dealPrice);
        setDealPriceDisplay(String(payload.dealPrice));
      }

      if (typeof payload.thumbnailUrl === 'string' && payload.thumbnailUrl)
        setThumbnailUrl(payload.thumbnailUrl);
    } catch {
      // ignore parse errors
    }
  };
  useEffect(() => {
    restoreDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When we receive an existing course from the server (queried by draftId),
  // populate the form fields from that server response exactly once.
  useEffect(() => {
    if (!existingCourse) return;
    if (serverPopulated) return;

    setExistingCourseId(existingCourse.id as string);
    setCourseId?.(existingCourse.id as string);
    setTitle(existingCourse.title ?? '');
    setDescription(existingCourse.description ?? '');
    setDurationInMinutes(existingCourse.durationInMinutes ?? 60);
    setLevel((existingCourse.level as any) ?? 'STARTER');
    setPrice(existingCourse.price ?? 0);
    setPriceDisplay(String(existingCourse.price ?? 0));
    setDealPrice(existingCourse.dealPrice ?? 0);
    setDealPriceDisplay(String(existingCourse.dealPrice ?? 0));
    setThumbnailUrl(existingCourse.thumbnailUrl ?? '');

    try {
      localStorage.removeItem('createCourseDraft_v1');
    } catch {
      // ignore
    }

    setServerPopulated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingCourse]);
  const validate = () => {
    const e: Errors = {};
    if (!title.trim()) e.title = 'Tiêu đề là bắt buộc';
    if (!description.trim()) e.description = 'Mô tả ngắn là bắt buộc';
    if (!thumbnailUrl.trim()) e.thumbnail = 'Ảnh đại diện là bắt buộc';
    if (!(price > 0)) e.price = 'Giá phải lớn hơn 0';
    if (dealPrice > 0 && dealPrice >= price) {
      e.dealPrice = 'Giá khuyến mãi phải nhỏ hơn giá gốc';
    }
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
      thumbnailUrl: thumbnailUrl ?? '',
    };

    const getErrorMessage = (err: unknown) => {
      if (typeof err === 'object' && err !== null) {
        const e = err as Record<string, unknown>;
        if (typeof e.message === 'string') return e.message;
      }
      return 'An error occurred while creating the course.';
    };

    const mutation = existingCourseId ? updateCourse : createCourse;
    const successMessage = existingCourseId
      ? 'Khóa học đã được cập nhật thành công!'
      : 'Khóa học đã được tạo thành công, tiếp tục bước tiếp theo.';

    mutation.mutate(payload, {
      onSuccess: (res) => {
        const response = res as Course;
        localStorage.setItem(
          'createCourseDraft_v1',
          JSON.stringify({ payload, id: response.id as string }),
        );
        toast.success(successMessage);
        goNext();
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  // react-query mutation result typing may vary across versions; access isLoading defensively
  const loading = Boolean(
    (createCourse as unknown as { isLoading?: boolean }).isLoading ||
      (updateCourse as unknown as { isLoading?: boolean }).isLoading,
  );

  return (
    <div className="rounded-md border p-6">
      <h2 className="text-lg font-bold mb-4">
        Thông tin cơ bản khóa học
        {existingCourseId && (
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            (Đang chỉnh sửa)
          </span>
        )}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Thumbnail */}
        <div className="col-span-1">
          <label className="block text-sm font-semibold text-gray-700">
            Ảnh đại diện khóa học <span className="text-red-500">*</span>
          </label>

          <div className="mt-1 flex items-center gap-2">
            <Input
              id="picture"
              type="file"
              accept="image/*"
              placeholder="Chọn ảnh cho khóa học"
              onChange={(e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (!file) return;
                // uploadFile expects an object payload with `file` property
                uploadFile.mutate(
                  { file },
                  {
                    onSuccess: (res: {
                      flag: boolean;
                      code: number;
                      data: string;
                    }) => {
                      if (res.code === 200) {
                        setThumbnailUrl(res.data);
                      }
                      toast.success('Tải ảnh lên thành công');
                    },
                    onError: () => {
                      toast.error('Tải ảnh lên thất bại. Vui lòng thử lại.');
                    },
                  },
                );
              }}
              disabled={loading || uploadFile.isPending}
            />

            {uploadFile.progress > 0 && uploadFile.isPending && (
              <div className="text-sm text-muted-foreground">
                {uploadFile.progress}%
              </div>
            )}
          </div>

          {thumbnailUrl && (
            <div className="mt-2 w-full h-64 overflow-hidden rounded-md border bg-white">
              <img
                src={thumbnailUrl}
                alt="thumbnail preview"
                className="object-cover w-full h-full"
                onError={(e) => {
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
            <label className="block text-sm font-semibold text-gray-700">
              Tiêu đề khóa học <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border px-3 py-2 "
              placeholder="Nhập tiêu đề khóa học"
              disabled={loading}
            />
            {(errors.title || localErrors.title) && (
              <p className="text-sm text-red-600 mt-2">
                {errors.title ?? localErrors.title}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Mô tả ngắn <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="mt-1 block w-full rounded-md border px-3 py-2"
              placeholder="Mô tả ngắn cho khóa học"
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
              <label className="block text-sm font-semibold text-gray-700">
                Thời lượng (phút)
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
              <label className="block text-sm font-semibold text-gray-700">
                Mức độ
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
                  <SelectItem value="STARTER">Sơ cấp</SelectItem>
                  <SelectItem value="INTERMEDIATE">Trung cấp</SelectItem>
                  <SelectItem value="ADVANCED">Nâng cao</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Giá <span className="text-red-500">*</span>
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
              <label className="block text-sm font-semibold text-gray-700">
                Giá ưu đãi
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
          <Button type="button" onClick={handleCreate} disabled={loading}>
            {loading
              ? existingCourseId
                ? 'Đang cập nhật...'
                : 'Tạo...'
              : existingCourseId
                ? 'Cập nhật & Tiếp tục'
                : 'Tạo & Tiếp tục'}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepBasic;
