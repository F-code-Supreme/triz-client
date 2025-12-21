import { ChatBubbleIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useQueryClient } from '@tanstack/react-query';
import { type Row } from '@tanstack/react-table';
import { MoreHorizontalIcon, PenIcon, Trash, Trash2 } from 'lucide-react';
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
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MinimalTiptapEditor } from '@/components/ui/minimal-tiptap';
import { Progress } from '@/components/ui/progress';
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
} from '@/features/forum/services/queries';
import { ForumKeys } from '@/features/forum/services/queries/keys';
import { useUploadFileMutation } from '@/features/media/services/mutations';
import { formatDate } from '@/utils';

import type { Comment } from '@/features/forum/types';

interface AssignmentsDataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export const ForumPostsDataTableRowActions = <TData,>({
  row,
}: AssignmentsDataTableRowActionsProps<TData>) => {
  const [isUpdateOpen, setIsUpdateOpen] = React.useState(false);
  const forumPost = row.original as any;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const deleteForumPost = useDeleteForumPostMutation();
  const updateForumPostMutation = useUpdateForumPostMutation();
  const uploadMutation = useUploadFileMutation();

  // reply management (admin)
  const [isRepliesOpen, setIsRepliesOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const deleteReplyComment = useDeleteReplyCommentMutation();
  const createReplyComment = useCreateReplyCommentMutation();
  const [confirmDeleteReplyId, setConfirmDeleteReplyId] = React.useState<
    string | null
  >(null);

  // Add editable local state
  const [postTitle, setPostTitle] = React.useState<string>('');
  const [postImage, setPostImage] = React.useState<string>('');
  const [answer, setAnswer] = React.useState<string>('');
  const [titleError, setTitleError] = React.useState<string | null>(null);
  const [contentError, setContentError] = React.useState<string | null>(null);

  // Populate fields when dialog opens
  React.useEffect(() => {
    if (isUpdateOpen && forumPost) {
      setPostTitle(forumPost.title ?? '');
      setPostImage(forumPost.imgUrl ?? forumPost.image ?? '');
      // Prefer plain content string if available; fallback to empty string
      setAnswer(forumPost.content ?? forumPost.body ?? '');
      setTitleError(null);
      setContentError(null);
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
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" aria-label="Open menu">
                    <MoreHorizontalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40" align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => setConfirmDeleteReplyId(c.id)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Xóa
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
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
    const title = postTitle.trim();
    const content = answer ?? '';
    const plain = content
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim();

    if (!title) {
      setTitleError('Tiêu đề là bắt buộc');
      return;
    }
    if (title.length < 3) {
      setTitleError('Tiêu đề phải có ít nhất 3 ký tự');
      return;
    }
    if (!plain) {
      setContentError('Nội dung là bắt buộc');
      return;
    }
    if (plain.length < 10) {
      setContentError('Nội dung phải có ít nhất 10 ký tự');
      return;
    }

    const payload = {
      postId: forumPost.id,
      title,
      content,
      imgUrl: postImage ?? '',
    };

    updateForumPostMutation.mutate(payload, {
      onSuccess: () => {
        toast.success('Cập nhật bài đăng thành công.');
        setIsUpdateOpen(false);
        setTitleError(null);
        setContentError(null);
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
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuItem onClick={() => setIsUpdateOpen(true)}>
            <PenIcon className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsRepliesOpen(true)}>
            <ChatBubbleIcon className="mr-2 h-4 w-4" />
            Quản lý bình luận
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-red-600 cursor-pointer"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa
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

      {/* Edit forum post update dialog */}
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent className="sm:max-w-[1000px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label
                htmlFor="title"
                className="flex items-center justify-between"
              >
                <span>Tiêu đề {<span className="text-red-500">*</span>} </span>
                <span className="text-xs text-gray-400">
                  {postTitle.length}/200
                </span>{' '}
              </Label>
              <Input
                value={postTitle}
                onChange={(e) => {
                  const v = (e.target as HTMLInputElement).value;
                  setPostTitle(v);
                  if (v.trim().length < 3) {
                    setTitleError('Tiêu đề phải có ít nhất 3 ký tự');
                  } else {
                    setTitleError(null);
                  }
                }}
                placeholder="Tiêu đề bài viết"
                aria-invalid={!!titleError}
              />
              {titleError && (
                <p className="text-xs text-destructive mt-1">{titleError}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-slate-600">Ảnh bài viết</label>

              <Input
                id="picture"
                type="file"
                accept="image/*"
                placeholder="Chọn ảnh cho bài viết"
                onChange={(e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (!file) return;
                  uploadMutation.mutate(
                    { file },
                    {
                      onSuccess: (res: {
                        flag: boolean;
                        code: number;
                        data: string;
                      }) => {
                        if (res.code === 200) {
                          setPostImage(res.data);
                        }
                        toast.success('Tải ảnh lên thành công');
                      },
                      onError: () => {
                        toast.error('Tải ảnh lên thất bại. Vui lòng thử lại.');
                      },
                    },
                  );
                }}
                disabled={uploadMutation.isPending}
              />
              {uploadMutation.progress > 0 && uploadMutation.isPending && (
                <Progress
                  value={uploadMutation.progress}
                  className="w-full h-[10px] mt-2"
                />
              )}

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

            <div className="grid gap-2">
              <Label
                htmlFor="content"
                className="flex items-center justify-between"
              >
                <span>Nội dung {<span className="text-red-500">*</span>} </span>
              </Label>

              <TooltipProvider>
                <MinimalTiptapEditor
                  key={forumPost.id}
                  output="html"
                  value={answer}
                  onChange={(v) => {
                    const newVal =
                      typeof v === 'string' ? v : JSON.stringify(v);
                    setAnswer(newVal);
                    const plain = newVal
                      .replace(/<[^>]*>/g, '')
                      .replace(/&nbsp;/g, ' ')
                      .trim();
                    if (plain.length < 10) {
                      setContentError('Nội dung phải có ít nhất 10 ký tự');
                    } else {
                      setContentError(null);
                    }
                  }}
                  className="max-h-[500px] overflow-y-auto border rounded-md"
                />
                {contentError && (
                  <p className="text-xs text-destructive mt-1">
                    {contentError}
                  </p>
                )}
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
                  !!titleError ||
                  !answer ||
                  !answer
                    .replace(/<[^>]*>/g, '')
                    .replace(/&nbsp;/g, ' ')
                    .trim().length ||
                  !!contentError ||
                  updateForumPostMutation.isPending
                }
              >
                {updateForumPostMutation.isPending ? 'Đang cập nhật...' : 'Lưu'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Replies management dialog */}
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
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" aria-label="Open menu">
                              <MoreHorizontalIcon />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-40" align="end">
                            <DropdownMenuGroup>
                              <DropdownMenuItem
                                onClick={() => setConfirmDeleteReplyId(r.id)}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Xóa
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
          <div className="flex justify-end mt-4">
            <Button variant="ghost" onClick={() => setIsRepliesOpen(false)}>
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm delete reply dialog */}
      <AlertDialog
        open={!!confirmDeleteReplyId}
        onOpenChange={(open) => {
          if (!open) setConfirmDeleteReplyId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa bình luận</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bình luận này? Hành động không thể hoàn
              tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteReplyComment.isPending}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!confirmDeleteReplyId) return;
                deleteReplyComment.mutate(confirmDeleteReplyId, {
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
                        query.queryKey[0] ===
                          ForumKeys.GetForumPostChildrenReplies,
                    });
                    setConfirmDeleteReplyId(null);
                  },
                  onError: () => {
                    toast.error('Xóa bình luận thất bại.');
                  },
                });
              }}
              disabled={deleteReplyComment.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteReplyComment.isPending ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
