import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useQueryClient } from '@tanstack/react-query';
import { type Row } from '@tanstack/react-table';
import { BookDashed } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { MinimalTiptapEditor } from '@/components/ui/minimal-tiptap';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  useDeleteForumPostMutation,
  useUpdateForumPostMutation,
  useDeleteReplyCommentMutation,
  useCreateReplyCommentMutation,
  useCreateCommentMutation,
} from '@/features/forum/services/mutations';
import {
  useGetForumPostReplyByIdQuery,
  useGetForumPostChildrenReplyByIdQuery,
  useGetForumPostByIdQuery,
} from '@/features/forum/services/queries';
import { ForumKeys } from '@/features/forum/services/queries/keys';
import ReviewPostReport from '@/features/report/components/report-review-dialog';
import { cleanHtml, formatDate } from '@/utils';

import type { Comment } from '@/features/forum/types';
import type { Report } from '@/features/report/types';

interface AssignmentsDataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export const ReportPostsDataTableRowActions = <TData,>({
  row,
}: AssignmentsDataTableRowActionsProps<TData>) => {
  const [isUpdateOpen, setIsUpdateOpen] = React.useState(false);
  const forumPost = row.original as any;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const deleteForumPost = useDeleteForumPostMutation();
  const updateForumPostMutation = useUpdateForumPostMutation();
  const [showDetailDialog, setShowDetailDialog] = React.useState(false);
  const [selectedPostId, setSelectedPostId] = React.useState<string | null>(
    null,
  );
  const { data: selectedPost, isFetching } = useGetForumPostByIdQuery(
    selectedPostId!,
    {
      enabled: !!selectedPostId,
    },
  );
  console.log('selectedPost', selectedPost);
  // reply management (admin)
  const [isRepliesOpen, setIsRepliesOpen] = React.useState(false);
  const [isReportReviewOpen, setIsReportReviewOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const deleteReplyComment = useDeleteReplyCommentMutation();
  const createReplyComment = useCreateReplyCommentMutation();

  // Add editable local state
  const [postTitle, setPostTitle] = React.useState<string>('');
  const [postImage, setPostImage] = React.useState<string>('');
  const [answer, setAnswer] = React.useState<string>('');

  // Populate fields when dialog opens
  React.useEffect(() => {
    if (isUpdateOpen && forumPost) {
      setPostTitle(forumPost.title ?? '');
      setPostImage(forumPost.imgUrl ?? forumPost.image ?? '');
      // Prefer plain content string if available; fallback to empty string
      setAnswer(forumPost.content ?? forumPost.body ?? '');
    }
  }, [isUpdateOpen, forumPost]);

  // fetch top-level replies for the post when replies dialog is open
  const { data: repliesData, isLoading: repliesLoading } =
    useGetForumPostReplyByIdQuery(forumPost.id, { enabled: isRepliesOpen });

  // local state for replying inside the dialog
  const [activeReplyTarget, setActiveReplyTarget] = React.useState<
    string | null
  >(null);
  const [replyText, setReplyText] = React.useState('');
  const createTopLevelComment = useCreateCommentMutation();

  const ReplyChildrenList: React.FC<{ parentId: string }> = ({ parentId }) => {
    const { data } = useGetForumPostChildrenReplyByIdQuery(parentId);
    const children = data ?? [];
    if (!children || children.length === 0) return null;
    return (
      <div className="ml-4 mt-2 space-y-2">
        {children.map((c: Comment) => (
          <div key={c.id} className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-medium">
                {c.userName || 'Người dùng'}
              </div>
              <div className="text-sm text-slate-600">{c.content}</div>
              <div className="text-xs text-slate-400 mt-1">
                {c.createdAt
                  ? formatDate(new Date(c.createdAt), 'DD/MM/YYYY HH:mm')
                  : ''}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDeleteReply(c.id)}
              >
                Xóa
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleDelete = () => {
    deleteForumPost.mutate(forumPost.id, {
      onSuccess: () => {
        toast.success('Đã xóa bài đăng thành công.');
      },
    });
  };

  const handleDeleteReply = (replyId: string) => {
    deleteReplyComment.mutate(replyId, {
      onSuccess: () => {
        toast.success('Đã xóa bình luận thành công.');
        queryClient.invalidateQueries({
          queryKey: [ForumKeys.GetForumPostReplies, forumPost.id],
        });
        queryClient.invalidateQueries({
          queryKey: [ForumKeys.GetForumPostsByAdminQuery],
        });
        queryClient.invalidateQueries({
          predicate: (query) =>
            Array.isArray(query.queryKey) &&
            query.queryKey[0] === ForumKeys.GetForumPostChildrenReplies,
        });
      },
      onError: () => {
        toast.error('Xóa bình luận thất bại.');
      },
    });
  };

  const handleCreateReply = (parentReplyId?: string) => {
    const text = replyText.trim();
    if (!text) return;
    if (parentReplyId) {
      createReplyComment.mutate({ parentReplyId, content: text } as any, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [ForumKeys.GetForumPostChildrenReplies, parentReplyId],
          });
          queryClient.invalidateQueries({
            queryKey: [ForumKeys.GetForumPostReplies, forumPost.id],
          });
          queryClient.invalidateQueries({
            queryKey: [ForumKeys.GetForumByIdQuery, forumPost.id],
          });
          toast.success('Đã trả lời bình luận.');
          setReplyText('');
          setActiveReplyTarget(null);
        },
        onError: () => {
          toast.error('Không thể gửi phản hồi.');
        },
      });
    } else {
      // create top-level reply for the post
      createTopLevelComment.mutate(
        { postId: forumPost.id, content: text } as any,
        {
          onSuccess: () => {
            toast.success('Đã thêm bình luận.');
            setReplyText('');

            queryClient.invalidateQueries({
              queryKey: [ForumKeys.GetForumPostChildrenReplies, parentReplyId],
            });
            queryClient.invalidateQueries({
              queryKey: [ForumKeys.GetForumPostsByAdminQuery],
            });
            queryClient.invalidateQueries({
              queryKey: [ForumKeys.GetForumPostReplies, forumPost.id],
            });
            queryClient.invalidateQueries({
              queryKey: [ForumKeys.GetForumByIdQuery, forumPost.id],
            });
          },
          onError: () => {
            toast.error('Không thể gửi bình luận.');
          },
        },
      );
    }
  };

  // Update handler
  const handleUpdate = () => {
    const payload = {
      postId: forumPost.id,
      title: postTitle.trim(),
      content: answer ?? '',
      imgUrl: postImage ?? '',
    };
    updateForumPostMutation.mutate(payload, {
      onSuccess: () => {
        toast.success('Cập nhật bài đăng thành công.');
        setIsUpdateOpen(false);
      },
      onError: (err) => {
        toast.error(
          err instanceof Error
            ? err.message
            : 'Không thể cập nhật bài viết. Vui lòng thử lại.',
        );
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuItem
            onClick={() => {
              setSelectedPostId(forumPost.forumPostId);
              setShowDetailDialog(true);
            }}
          >
            <BookDashed className="mr-2 h-4 w-4" />
            Chi tiết bài viết
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsReportReviewOpen(true)}>
            <BookDashed className="mr-2 h-4 w-4" />
            Đánh giá báo cáo
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa bài đăng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bài đăng &quot;{forumPost.title}&quot;
              không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteForumPost.isPending}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteForumPost.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteForumPost.isPending ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-600">Tiêu đề</label>
              <Input
                value={postTitle}
                onChange={(e) =>
                  setPostTitle((e.target as HTMLInputElement).value)
                }
                placeholder="Tiêu đề bài viết"
              />
            </div>

            <div>
              <label className="text-sm text-slate-600">Ảnh (URL)</label>
              <Input
                value={postImage}
                onChange={(e) =>
                  setPostImage((e.target as HTMLInputElement).value)
                }
                placeholder="https://... (để trống nếu không có)"
              />
              {postImage ? (
                <div className="mt-2 w-full h-60 overflow-hidden rounded-md border bg-white">
                  <img
                    src={postImage}
                    alt="thumbnail preview"
                    className="object-cover w-full h-60"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '';
                    }}
                  />
                </div>
              ) : null}
            </div>

            <div>
              <label className="text-sm text-slate-600">Nội dung</label>

              <TooltipProvider>
                <MinimalTiptapEditor
                  key={forumPost.id}
                  value={forumPost.content}
                  className="max-h-[500px] overflow-y-auto border rounded-md"
                />
              </TooltipProvider>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsUpdateOpen(false)}>
                Hủy
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={
                  !postTitle.trim() ||
                  !(answer && answer.toString().trim()) ||
                  updateForumPostMutation.isPending
                }
              >
                {updateForumPostMutation.isPending ? 'Đang cập nhật...' : 'Lưu'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isRepliesOpen} onOpenChange={setIsRepliesOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Quản lý bình luận - {forumPost.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4  max-h-[500px] overflow-y-auto">
            {repliesLoading ? (
              <div>Đang tải...</div>
            ) : (
              <div className="space-y-3">
                {repliesData?.content.length === 0 && (
                  <div className="text-sm text-slate-600">
                    Chưa có bình luận nào về bài viết này.
                  </div>
                )}
                {(Array.isArray(repliesData?.content)
                  ? repliesData.content
                  : []
                ).map((r: Comment) => (
                  <div key={r.id} className="p-3 border rounded-md">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <div className="text-sm font-medium">
                          {r.userName || 'Người dùng'}
                        </div>
                        <div className="text-sm text-slate-700">
                          {r.content}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          {r.createdAt
                            ? formatDate(
                                new Date(r.createdAt),
                                'DD/MM/YYYY HH:mm',
                              )
                            : ''}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteReply(r.id)}
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>

                    {activeReplyTarget === r.id && (
                      <div className="mt-3 flex gap-2">
                        <Input
                          value={replyText}
                          onChange={(e) =>
                            setReplyText((e.target as HTMLInputElement).value)
                          }
                          placeholder="Nhập nội dung trả lời..."
                        />
                        <Button
                          onClick={() => handleCreateReply(r.id)}
                          disabled={!replyText.trim()}
                        >
                          Gửi
                        </Button>
                        <Button onClick={() => setActiveReplyTarget(null)}>
                          Hủy
                        </Button>
                      </div>
                    )}

                    <ReplyChildrenList parentId={r.id} />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="pt-2">
            <div className="text-sm text-slate-600">Tạo Bình luận mới</div>
            <div className="mt-2 flex gap-2">
              <Input
                value={replyText}
                onChange={(e) =>
                  setReplyText((e.target as HTMLInputElement).value)
                }
                placeholder="Bình luận bài viết này..."
              />
              <Button
                onClick={() => handleCreateReply(undefined)}
                disabled={!replyText.trim()}
              >
                Gửi
              </Button>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="ghost" onClick={() => setIsRepliesOpen(false)}>
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={showDetailDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowDetailDialog(false);
            setSelectedPostId(null);
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {isFetching ? (
            <div className="py-8 text-center text-slate-500">Đang tải...</div>
          ) : (
            <>
              {selectedPost ? (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                      {selectedPost.title}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4 mt-4">
                    {/* Author info */}
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={selectedPost.avtUrl || ''}
                          alt={selectedPost.userName || 'User'}
                        />
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {selectedPost.userName || 'Người dùng'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatDate(new Date(selectedPost.createdAt))}
                        </p>
                      </div>
                    </div>

                    {/* Post image */}
                    {selectedPost.imgUrl && (
                      <div className="w-full rounded-lg overflow-hidden border">
                        <img
                          src={selectedPost.imgUrl}
                          alt={selectedPost.title}
                          className="w-full object-cover max-h-96"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              'none';
                          }}
                        />
                      </div>
                    )}

                    {/* Post content */}
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: cleanHtml(selectedPost.content || ''),
                      }}
                    />
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-slate-500">
                  Không tìm thấy bài viết
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <ReviewPostReport
        open={isReportReviewOpen}
        onOpenChange={setIsReportReviewOpen}
        reportId={(forumPost as Report).forumPostId}
      />
    </>
  );
};
