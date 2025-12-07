import { type ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/data-table/column-header';

import { type FlashcardDeck } from '../types';
import { FlashcardDecksDataTableRowActions } from './flashcard-decks-data-table-row-actions';

export const flashcardDecksColumns: ColumnDef<FlashcardDeck>[] = [
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
