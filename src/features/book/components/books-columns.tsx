import { type ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/data-table/column-header';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { bookStatuses } from '../data/data';
import { type AdminBook } from '../types';
import { BooksDataTableRowActions } from './books-data-table-row-actions';

export const booksColumns: ColumnDef<AdminBook>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => {
      const id = row.getValue('id') as string;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-[100px] truncate font-mono text-sm cursor-help">
                {id}
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-mono text-xs">
              {id}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue('title') || 'N/A'}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'author',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Author" />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue('author') || 'N/A'}</div>;
    },
  },
  {
    accessorKey: 'publisher',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Publisher" />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue('publisher') || 'N/A'}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = bookStatuses.find(
        (s) => s.value === row.getValue('status'),
      );

      if (!status) {
        return null;
      }

      return (
        <Badge variant={status.value === 'PUBLISHED' ? 'default' : 'secondary'}>
          {status.label}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'displayOrder',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order" />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue('displayOrder')}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <BooksDataTableRowActions
        row={row}
        isDeleted={Boolean(row.original.deletedAt)}
      />
    ),
  },
];
