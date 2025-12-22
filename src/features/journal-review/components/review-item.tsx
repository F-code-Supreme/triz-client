import { Star, Trash2 } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { formatDate } from '@/utils';

import type { ChildReviewWithTimestamp } from '../types';

const DATE_FORMAT = 'DD/MM/YYYY HH:mm' as const;

interface ReviewItemProps {
  review: ChildReviewWithTimestamp;
  isReadOnly: boolean;
  canEdit: boolean;
  canDelete: boolean;
  isEditing: boolean;
  editContent: string;
  editRating: number | null;
  onEdit: (reviewId: string, content: string, rating: number | null) => void;
  onDelete: (reviewId: string, stepNumber: number | null) => void;
  onStartEdit: (
    reviewId: string,
    content: string,
    rating: number | null,
  ) => void;
  onCancelEdit: () => void;
  onUpdateReview: (reviewId: string, stepNumber: number | null) => void;
  setEditContent: (content: string) => void;
  setEditRating: (rating: number | null) => void;
}

export const ReviewItem = ({
  review,
  isReadOnly,
  canEdit,
  canDelete,
  isEditing,
  editContent,
  editRating,
  onStartEdit,
  onCancelEdit,
  onUpdateReview,
  onDelete,
  setEditContent,
  setEditRating,
}: ReviewItemProps) => {
  return (
    <div className="flex gap-3 p-4 border rounded-lg">
      <Avatar>
        <AvatarImage src={review.creatorAvatarUrl || ''} />
        <AvatarFallback>{review.creatorFullName?.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{review.creatorFullName}</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(new Date(review.createdAt), DATE_FORMAT)}
            </p>
          </div>
          {!isReadOnly && (canEdit || canDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  •••
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {canEdit && (
                  <DropdownMenuItem
                    onClick={() =>
                      onStartEdit(review.id, review.content, review.rating)
                    }
                  >
                    Chỉnh sửa
                  </DropdownMenuItem>
                )}
                {canDelete && (
                  <DropdownMenuItem
                    onClick={() => onDelete(review.id, review.stepNumber)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {isEditing ? (
          <div className="mt-2 space-y-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[80px]"
            />
            {review.stepNumber !== null && (
              <div className="flex items-center gap-2">
                <span className="text-sm">Đánh giá:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 cursor-pointer ${
                      star <= (editRating || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    onClick={() => setEditRating(star)}
                  />
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => onUpdateReview(review.id, review.stepNumber)}
              >
                Lưu
              </Button>
              <Button size="sm" variant="outline" onClick={onCancelEdit}>
                Hủy
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="mt-2 text-sm whitespace-pre-wrap">{review.content}</p>
            {review.rating && (
              <div className="flex items-center gap-1 mt-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{review.rating}/5</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
