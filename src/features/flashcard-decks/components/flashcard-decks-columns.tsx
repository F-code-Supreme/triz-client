import { type ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/data-table/column-header';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { type FlashcardDeck } from '../types';
import { FlashcardDecksDataTableRowActions } from './flashcard-decks-data-table-row-actions';

export const flashcardDecksColumns: ColumnDef<FlashcardDeck>[] = [
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
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      return (
        <div className="max-w-xs truncate">
          {row.getValue('description') || 'N/A'}
        </div>
      );
    },
  },
  {
    accessorKey: 'numberOfFlashcards',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cards" />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue('numberOfFlashcards')}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <FlashcardDecksDataTableRowActions
        row={row}
        // isDeleted={Boolean(row.original.deletedAt)}
      />
    ),
  },
];
