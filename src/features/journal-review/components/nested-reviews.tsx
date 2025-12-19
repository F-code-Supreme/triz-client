import { format } from 'date-fns';
import {
  Check,
  MessageSquare,
  MoreHorizontal,
  Star,
  Trash2,
  X,
} from 'lucide-react';

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
  level?: number;
  isReadOnly: boolean;
  isExpertOrAdmin: boolean;
  userId?: string;
  canDelete: (reviewOwnerId: string) => boolean;
  editingReview: string | null;
  editContent: string;
  editRating: number | null;
  replyToReview: string | null;
  replyContent: string;
  replyRating: number;
  setEditingReview: (id: string | null) => void;
  setEditContent: (content: string) => void;
  setEditRating: (rating: number | null) => void;
  setReplyToReview: (id: string | null) => void;
  setReplyContent: (content: string) => void;
  setReplyRating: (rating: number) => void;
  handleUpdateReview: (reviewId: string) => void;
  handleDeleteReview: (reviewId: string) => void;
  handleCreateChildReview: (
    stepNumber: number | null,
    content: string,
    rating?: number,
  ) => Promise<void>;
}

export const NestedReviews = ({
  reviews,
  level = 0,
  isReadOnly,
  isExpertOrAdmin,
  userId,
  canDelete,
  editingReview,
  editContent,
  editRating,
  replyToReview,
  replyContent,
  replyRating,
  setEditingReview,
  setEditContent,
  setEditRating,
  setReplyToReview,
  setReplyContent,
  setReplyRating,
  handleUpdateReview,
  handleDeleteReview,
  handleCreateChildReview,
}: NestedReviewsProps) => {
  // Build tree structure from flat list
  const buildTree = (
    items: ChildReviewWithTimestamp[],
  ): (ChildReviewWithTimestamp & {
    children: ChildReviewWithTimestamp[];
  })[] => {
    const map = new Map<
      string,
      ChildReviewWithTimestamp & { children: ChildReviewWithTimestamp[] }
    >();
    const roots: (ChildReviewWithTimestamp & {
      children: ChildReviewWithTimestamp[];
    })[] = [];

    // Initialize all items with empty children array
    items.forEach((item) => {
      map.set(item.id, { ...item, children: [] });
    });

    // Build the tree
    items.forEach((item) => {
      const node = map.get(item.id)!;
      if (item.parentId) {
        const parent = map.get(item.parentId);
        if (parent) {
          parent.children.push(node);
        } else {
          // If parent not found, treat as root
          roots.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  const tree =
    level === 0
      ? buildTree(reviews)
      : (reviews as (ChildReviewWithTimestamp & {
          children?: ChildReviewWithTimestamp[];
        })[]);

  const renderReview = (
    review: ChildReviewWithTimestamp & {
      children?: ChildReviewWithTimestamp[];
    },
  ) => {
    const isEditing = editingReview === review.id;
    const canEdit =
      !isReadOnly && (review.creatorId === userId || isExpertOrAdmin);
    const canDeleteThis = !isReadOnly && canDelete(review.creatorId);
    const isReplying = replyToReview === review.id;

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
                        onClick={() => handleDeleteReview(review.id)}
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
                    onClick={() => handleUpdateReview(review.id)}
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
                {review.rating && (
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {review.rating}/5
                    </span>
                  </div>
                )}
                {!isReadOnly && isExpertOrAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setReplyToReview(review.id);
                      setReplyContent('');
                      setReplyRating(0);
                    }}
                    className="mt-2 text-xs"
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Trả lời
                  </Button>
                )}
              </>
            )}

            {/* Reply input */}
            {isReplying && (
              <div className="mt-3 space-y-2 pl-2 border-l-2">
                <Textarea
                  placeholder="Nhập câu trả lời..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[60px]"
                />
                {review.stepNumber !== null && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Đánh giá:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 cursor-pointer ${
                          star <= replyRating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        onClick={() => setReplyRating(star)}
                      />
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      handleCreateChildReview(
                        review.stepNumber,
                        replyContent,
                        replyRating || undefined,
                      ).then(() => {
                        setReplyToReview(null);
                        setReplyContent('');
                        setReplyRating(0);
                      })
                    }
                    disabled={!replyContent.trim()}
                  >
                    Gửi
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setReplyToReview(null);
                      setReplyContent('');
                      setReplyRating(0);
                    }}
                  >
                    Hủy
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recursive nested children */}
        {review.children && review.children.length > 0 && (
          <div className="ml-11 mt-3 space-y-2">
            {review.children.map((child) =>
              renderReview(
                child as ChildReviewWithTimestamp & {
                  children?: ChildReviewWithTimestamp[];
                },
              ),
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={level > 0 ? 'ml-8 mt-2 space-y-2' : 'space-y-3'}>
      {tree.map((review) => renderReview(review))}
    </div>
  );
};
