import { Link, useNavigate } from '@tanstack/react-router';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import { ArrowLeft, MessageSquare, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

import { DataTablePagination } from '@/components/data-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetJournalByIdQuery } from '@/features/6-steps/services/queries';
import useAuth from '@/features/auth/hooks/use-auth';
import { ReviewRequestDialog } from '@/features/journal-review/components';
import { useGetRootReviewsByProblemQuery } from '@/features/journal-review/services/queries';
import { getReviewStatusBadge } from '@/features/journal-review/utils/status';
import { useGetWalletByUserQuery } from '@/features/payment/wallet/services/queries';
import { DefaultLayout } from '@/layouts/default-layout';
import { Route } from '@/routes/(app)/journals/$journalId/reviews';
import { formatDate } from '@/utils';

import type { RootReviewWithTimestamp } from '@/features/journal-review/types';

const columnHelper = createColumnHelper<RootReviewWithTimestamp>();

const JournalReviewsPage = () => {
  const { journalId } = Route.useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: true },
  ]);

  const { data: journal, isLoading: journalLoading } = useGetJournalByIdQuery(
    user?.id,
    journalId,
  );

  const { data: reviewsData, isLoading: reviewsLoading } =
    useGetRootReviewsByProblemQuery(pagination, sorting, journal?.id);

  const reviews = useMemo(() => reviewsData?.content || [], [reviewsData]);
  const totalRowCount = reviewsData?.page?.totalElements ?? 0;

  // Get wallet balance for review request
  const { data: wallet } = useGetWalletByUserQuery(user?.id);
  const walletBalance = useMemo(() => wallet?.balance || 0, [wallet]);

  // Review request dialog state
  const [isReviewRequestDialogOpen, setIsReviewRequestDialogOpen] =
    useState(false);

  const columns = useMemo(
    () => [
      columnHelper.accessor('creatorFullName', {
        header: 'Người đánh giá',
        cell: (info) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={info.row.original.creatorAvatarUrl || ''} />
              <AvatarFallback>
                {info.getValue()?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor('content', {
        header: 'Nội dung',
        cell: (info) => (
          <p className="line-clamp-2 text-sm">{info.getValue()}</p>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Trạng thái',
        cell: (info) => getReviewStatusBadge(info.getValue()),
      }),
      columnHelper.accessor('averageRating', {
        header: 'Đánh giá',
        cell: (info) => {
          const rating = info.getValue();
          return rating ? (
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
              <span className="text-yellow-500">★</span>
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">Chưa có</span>
          );
        },
      }),
      columnHelper.accessor('createdAt', {
        header: 'Ngày tạo',
        cell: (info) => (
          <span className="text-sm">
            {formatDate(new Date(info.getValue()), 'DD/MM/YYYY HH:mm')}
          </span>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <Link
            to="/journals/$journalId/reviews/$reviewId"
            params={{ journalId, reviewId: row.original.id }}
          >
            <Button variant="ghost" size="sm">
              Xem chi tiết
            </Button>
          </Link>
        ),
      }),
    ],
    [journalId],
  );

  const table = useReactTable({
    data: reviews,
    columns,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    rowCount: totalRowCount,
  });

  if (journalLoading) {
    return (
      <DefaultLayout meta={{ title: 'Đang tải...' }}>
        <div className="py-8 space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout meta={{ title: `Đánh giá - ${journal?.title || ''}` }}>
      <div className="space-y-8">
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={() =>
              navigate({ to: '/journals/$journalId', params: { journalId } })
            }
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại nhật ký
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <MessageSquare className="h-8 w-8" />
                Đánh giá
              </h1>
              <p className="text-muted-foreground mt-2">
                Xem tất cả đánh giá cho nhật ký: {journal?.title}
              </p>
            </div>

            <Button onClick={() => setIsReviewRequestDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Tạo yêu cầu đánh giá mới
            </Button>
          </div>
        </div>

        {reviewsLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton key={idx} className="h-16 w-full" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có đánh giá nào</h3>
            <p className="text-muted-foreground text-center">
              Nhật ký này chưa có đánh giá từ chuyên gia.
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
                  {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <DataTablePagination table={table} />
          </>
        )}
      </div>

      {/* Review Request Dialog */}
      <ReviewRequestDialog
        open={isReviewRequestDialogOpen}
        onOpenChange={setIsReviewRequestDialogOpen}
        journalId={journal?.id || null}
        journalTitle={journal?.title}
        walletBalance={walletBalance}
      />
    </DefaultLayout>
  );
};

export default JournalReviewsPage;
