import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { type Row } from '@tanstack/react-table';
import { BookDashed, Trash2 } from 'lucide-react';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { MinimalTiptapEditor } from '@/components/ui/minimal-tiptap';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  useDeleteForumPostMutation,
  useUpdateForumPostMutation,
} from '@/features/forum/services/mutations';

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

  const handleDelete = () => {
    deleteForumPost.mutate(forumPost.id, {
      onSuccess: () => {
        toast.success('Đã xóa bài đăng thành công.');
      },
    });
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
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setIsUpdateOpen(true)}>
            <BookDashed className="mr-2 h-4 w-4" />
            Chỉnh sửa
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
    </>
  );
};
