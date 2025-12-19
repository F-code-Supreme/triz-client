import { format } from 'date-fns';
import { Check, MoreHorizontal, Star, Trash2, X } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';

import type { ChildReviewWithTimestamp } from '../types';

const DATE_FORMAT = 'dd/MM/yyyy HH:mm';

interface NestedReviewsProps {
  reviews: ChildReviewWithTimestamp[];
  isReadOnly: boolean;
  userId?: string;
  canDelete: (reviewOwnerId: string) => boolean;
  editingReview: string | null;
  editContent: string;
  editRating: number | null;
  setEditingReview: (id: string | null) => void;
  setEditContent: (content: string) => void;
  setEditRating: (rating: number | null) => void;
  handleUpdateReview: (reviewId: string, stepNumber: number | null) => void;
  handleDeleteReview: (reviewId: string, stepNumber: number | null) => void;
}

export const NestedReviews = ({
  reviews,
  isReadOnly,
  userId,
  canDelete,
  editingReview,
  editContent,
  editRating,
  setEditingReview,
  setEditContent,
  setEditRating,
  handleUpdateReview,
  handleDeleteReview,
}: NestedReviewsProps) => {
  const renderReview = (review: ChildReviewWithTimestamp) => {
    const isEditing = editingReview === review.id;
    const canEdit = !isReadOnly && review.creatorId === userId;
    const canDeleteThis = !isReadOnly && canDelete(review.creatorId);
    const showRating = true; // Always show rating for direct children

    return (
      <div key={review.id} className="border rounded-lg p-3">
        <div className="flex gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={review.creatorAvatarUrl || ''} />
            <AvatarFallback>{review.creatorFullName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-sm">{review.creatorFullName}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(review.createdAt), DATE_FORMAT)}
                </p>
              </div>
              {(canEdit || canDeleteThis) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {canEdit && (
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingReview(review.id);
                          setEditContent(review.content);
                          setEditRating(review.rating);
                        }}
                      >
                        Chỉnh sửa
                      </DropdownMenuItem>
                    )}
                    {canDeleteThis && (
                      <DropdownMenuItem
                        onClick={() =>
                          handleDeleteReview(review.id, review.stepNumber)
                        }
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
                {showRating && review.stepNumber !== null && (
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
                    onClick={() =>
                      handleUpdateReview(review.id, review.stepNumber)
                    }
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Lưu
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingReview(null);
                      setEditContent('');
                      setEditRating(null);
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Hủy
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="mt-2 text-sm whitespace-pre-wrap">
                  {review.content}
                </p>
                {showRating && review.rating && (
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {review.rating}/5
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {reviews.map((review) => renderReview(review))}
    </div>
  );
};
