import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { DataTablePagination, DataTableToolbar } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MinimalTiptapEditor } from '@/components/ui/minimal-tiptap';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { forumpostsColumns } from '@/features/forum/components/forum-posts-columns';
import { useCreateForumPostMutation } from '@/features/forum/services/mutations';
import { useGetForumPostsByAdminQuery } from '@/features/forum/services/queries';
import { useUploadFileMutation } from '@/features/media/services/mutations';
import { AdminLayout } from '@/layouts/admin-layout';

import type { FilterOption } from '@/components/data-table';
import type {
  ColumnFiltersState,
  PaginationState,
} from '@tanstack/react-table';

const AdminForumPostManage = () => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [postTitle, setPostTitle] = useState('');
  const [postImage, setPostImage] = useState('');
  const [answer, setAnswer] = useState<string>('');
  const [sorting, setSorting] = useState<
    Array<{
      id: string;
      desc: boolean;
    }>
  >([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const uploadMutation = useUploadFileMutation();
  const createForumPostMutation = useCreateForumPostMutation();

  // Build filters with date range
  const filters = useMemo(() => {
    // Remove existing fromDate and toDate filters
    const f = columnFilters.filter(
      (filter) => filter.id !== 'fromDate' && filter.id !== 'toDate',
    );

    return f;
  }, [columnFilters]);
  const forumPostFilters: FilterOption[] = [
    {
      columnId: 'status',
      title: 'Status',
      options: [
        { label: 'Công khai', value: 'ACTIVE' },
        { label: 'Chưa công khai', value: 'INACTIVE' },
      ],
    },
  ];

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: forumpostsData, isLoading } = useGetForumPostsByAdminQuery(
    pagination,
    sorting,
    filters,
  );
  const totalRowCount = forumpostsData?.page?.totalElements ?? 0;
  const forumPosts = useMemo(() => {
    const currentData = forumpostsData;
    return currentData?.content || [];
  }, [forumpostsData]);

  const table = useReactTable({
    data: forumPosts,
    columns: forumpostsColumns,
    state: {
      columnFilters,
      pagination,
      sorting,
    },
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    rowCount: totalRowCount,
  });

  return (
    <AdminLayout meta={{ title: 'Forum Management' }}>
      <div className="flex flex-col gap-8 p-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Quản lý bài viết diễn đàn
            </h1>
            <p className="text-muted-foreground mt-2">
              Xem và quản lý tất cả bài viết trong diễn đàn tại đây.
            </p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm bài viết mới
          </Button>
        </div>

        <div className="space-y-4">
          <DataTableToolbar
            table={table}
            searchPlaceholder="Tìm theo tiêu đề..."
            searchKey="title"
            filters={forumPostFilters}
          />

          {isLoading ? (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 10 }).map((_, idx) => (
                    <TableRow key={idx}>
                      {forumpostsColumns.map((_, cellIdx) => (
                        <TableCell key={cellIdx}>
                          <Skeleton className="h-8 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : forumPosts.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">
                Không có bài viết nào trong diễn đàn
              </p>
            </div>
          ) : (
            <>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && 'selected'}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={forumpostsColumns.length}
                          className="h-24 text-center"
                        >
                          Không có bài viết nào trong diễn đàn
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <DataTablePagination table={table} />
            </>
          )}
        </div>

        {/* Create post dialog */}
        <Dialog
          open={isCreateOpen}
          onOpenChange={(open) => !open && setIsCreateOpen(false)}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Tạo bài viết mới</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-600">Tiêu đề</label>
                <Input
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="Tiêu đề bài viết"
                />
              </div>

              <div>
                <label className="text-sm text-slate-600">Ảnh bài viết</label>

                <Input
                  id="picture"
                  type="file"
                  accept="image/*"
                  placeholder="Chọn ảnh cho khóa học"
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
                          toast.error(
                            'Tải ảnh lên thất bại. Vui lòng thử lại.',
                          );
                        },
                      },
                    );
                  }}
                  disabled={uploadMutation.isPending}
                />
                {uploadMutation.progress > 0 && uploadMutation.isPending && (
                  <Progress
                    value={uploadMutation.progress}
                    className="w-full h-[10px] mt-2 "
                  />
                )}
                {postImage && (
                  <div className="mt-2 w-full h-60  overflow-hidden rounded-md border bg-white">
                    <img
                      src={postImage}
                      alt="thumbnail preview"
                      className="object-cover w-full h-60"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm text-slate-600">Nội dung</label>

                <TooltipProvider>
                  <Tooltip>
                    <div>
                      <MinimalTiptapEditor
                        value={answer}
                        onChange={(v) =>
                          setAnswer(
                            typeof v === 'string' ? v : JSON.stringify(v),
                          )
                        }
                        output="html"
                        placeholder="Nhập nội dung bài viết..."
                        editorContentClassName="min-h-[200px] p-4"
                      />
                    </div>
                    {!answer && (
                      <TooltipContent side="bottom">
                        <p>Nhấp vào đây để bắt đầu nhập câu trả lời của bạn</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>
                  Hủy
                </Button>
                <Button
                  onClick={() => {
                    const payload = {
                      title: postTitle.trim(),
                      content: answer || '',
                      imgUrl: postImage || '',
                      tagIds: [],
                    };
                    createForumPostMutation.mutate(payload, {
                      onSuccess: () => {
                        setIsCreateOpen(false);
                        setPostTitle('');
                        setPostImage('');
                        setAnswer('');
                        toast.success('Đã tạo bài viết thành công.');
                      },
                      onError: (error) => {
                        toast.error(
                          error instanceof Error
                            ? error.message
                            : 'Không thể tạo bài viết. Vui lòng thử lại.',
                        );
                      },
                    });
                  }}
                  disabled={
                    !postTitle.trim() ||
                    !(answer && answer.toString().trim()) ||
                    createForumPostMutation.isPending
                  }
                >
                  {createForumPostMutation.isPending ? 'Đang đăng...' : 'Đăng'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminForumPostManage;
