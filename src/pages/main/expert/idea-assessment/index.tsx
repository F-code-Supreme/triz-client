import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';

import { DataTablePagination, DataTableToolbar } from '@/components/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ideaAssessmentColumns } from '@/features/6-steps/components/idea-assessment-columns';
import { ExpertLayout } from '@/layouts/expert-layout';

import type { IdeaAssessmentRequest } from '@/features/6-steps/services/queries/types';

const ExpertIdeaAssessmentPage = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<
    Array<{
      id: string;
      desc: boolean;
    }>
  >([]);
  const [columnFilters, setColumnFilters] = useState<
    Array<{
      id: string;
      value: unknown;
    }>
  >([]);
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({});
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  // TODO: Replace with actual API call when backend is ready
  const isLoading = false;

  const assessmentRequests = useMemo(() => {
    // TODO: Replace with actual API data
    const mockData: IdeaAssessmentRequest[] = [
      // Mock data for development
      {
        id: '1',
        userId: 'user1',
        userFullName: 'Xi Nê Ép Pê Tê',
        userEmail: 'xinefpt@gmail.com',
        journalId: 'journal1',
        journalTitle: 'Giải quyết vấn đề về năng lượng tái tạo',
        ideaStatement:
          'Sử dụng pin mặt trời kết hợp với hệ thống lưu trữ năng lượng để tối ưu hóa việc sử dụng điện',
        principleUsed: {
          id: 1,
          name: 'Nguyên tắc phân đoạn',
        },
        howItAddresses:
          'Chia hệ thống năng lượng thành các module nhỏ để dễ dàng mở rộng và bảo trì',
        status: 'PENDING',
        requestedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        userId: 'user2',
        userFullName: 'Xi Nê Ép Pê Tê',
        userEmail: 'xinefpt@gmail.com',
        journalId: 'journal2',
        journalTitle: 'Cải thiện hiệu suất sản xuất',
        ideaStatement:
          'Áp dụng automation để giảm thời gian sản xuất và tăng chất lượng sản phẩm',
        principleUsed: {
          id: 10,
          name: 'Hành động sơ bộ',
        },
        howItAddresses:
          'Chuẩn bị trước các bước sản xuất quan trọng để giảm thời gian chờ đợi',
        status: 'IN_REVIEW',
        requestedAt: new Date(Date.now() - 86400000).toISOString(),
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 43200000).toISOString(),
      },
      {
        id: '3',
        userId: 'user3',
        userFullName: 'Võ Minh Trí',
        userEmail: 'vominhtri@gmail.com',
        journalId: 'journal3',
        journalTitle: 'Tối ưu hóa quy trình logistics',
        ideaStatement:
          'Sử dụng AI để dự đoán nhu cầu và tối ưu hóa tuyến đường giao hàng',
        principleUsed: {
          id: 15,
          name: 'Tính động',
        },
        status: 'APPROVED',
        expertRating: 5,
        expertComment:
          'Ý tưởng rất sáng tạo và khả thi. Đề xuất triển khai pilot.',
        requestedAt: new Date(Date.now() - 172800000).toISOString(),
        reviewedAt: new Date(Date.now() - 86400000).toISOString(),
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
    return mockData;
  }, []);

  const table = useReactTable({
    data: assessmentRequests,
    columns: ideaAssessmentColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting as never,
    onColumnFiltersChange: setColumnFilters as never,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  return (
    <ExpertLayout meta={{ title: 'Idea Assessment Management' }}>
      <div className="flex flex-col gap-8 p-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Quản lý Đánh giá Ý tưởng
            </h1>
            <p className="text-muted-foreground mt-2">
              Đánh giá các ý tưởng 6 bước từ người dùng yêu cầu
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <DataTableToolbar
            table={table}
            searchPlaceholder="Tìm kiếm theo tiêu đề, người dùng..."
            searchKey="journalTitle"
          />

          {isLoading ? (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tiêu đề nhật ký</TableHead>
                    <TableHead>Người dùng</TableHead>
                    <TableHead>Ý tưởng</TableHead>
                    <TableHead>Nguyên tắc TRIZ</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Đánh giá</TableHead>
                    <TableHead>Ngày yêu cầu</TableHead>
                    <TableHead>Ngày đánh giá</TableHead>
                    <TableHead>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <TableRow key={idx}>
                      {ideaAssessmentColumns.map((_, cellIdx) => (
                        <TableCell key={cellIdx}>
                          <Skeleton className="h-8 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : assessmentRequests.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">
                Chưa có yêu cầu đánh giá nào.
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
                          colSpan={ideaAssessmentColumns.length}
                          className="h-24 text-center"
                        >
                          Không có kết quả.
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
      </div>
    </ExpertLayout>
  );
};

export default ExpertIdeaAssessmentPage;
