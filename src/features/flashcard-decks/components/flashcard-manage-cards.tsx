import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { Plus, MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';

import { DataTableToolbar, DataTablePagination } from '@/components/data-table';
import { DataTableColumnHeader } from '@/components/data-table/column-header';
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
import { Checkbox } from '@/components/ui/checkbox';
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  useCreateFlashcardMutation,
  useUpdateFlashcardMutation,
  useDeleteFlashcardMutation,
} from '@/features/flashcard/services/mutations';
import { useGetFlashcardsByDeckIdQuery } from '@/features/flashcard/services/queries/queries';

import { FlashcardCardForm } from './flashcard-card-form';

import type { Flashcard } from '@/features/flashcard/types';

// Card row actions component
interface CardRowActionsProps {
  card: Flashcard;
  deckId: string;
}

const CardRowActions = ({ card, deckId }: CardRowActionsProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const updateMutation = useUpdateFlashcardMutation();
  const deleteMutation = useDeleteFlashcardMutation();

  const handleUpdate = async (values: {
    term: string;
    definition: string;
    termImgUrl?: string;
    defImgUrl?: string;
  }) => {
    try {
      await updateMutation.mutateAsync({
        flashcardId: card.id,
        deckId,
        payload: {
          term: values.term,
          definition: values.definition,
          termImgUrl: values.termImgUrl || null,
          defImgUrl: values.defImgUrl || null,
        },
      });
      toast.success('Card updated successfully');
      setIsEditOpen(false);
    } catch (error) {
      toast.error('Failed to update card');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync({
        flashcardId: card.id,
        deckId,
      });
      toast.success('Card deleted successfully');
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error('Failed to delete card');
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsPreviewOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Card Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Term Section - Front of Card */}
            <div className="flex gap-4 items-start">
              {/* Image Container - Card Style */}
              <div className="flex-shrink-0">
                {card.termImgUrl ? (
                  <div className="relative w-48 h-48 rounded-lg overflow-hidden shadow-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                    <img
                      src={card.termImgUrl}
                      alt="Term"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-48 h-48 rounded-lg shadow-lg border-2 border-dashed border-muted-foreground/30 bg-gradient-to-br from-muted/30 to-muted/50 flex items-center justify-center">
                    <p className="text-xs text-muted-foreground text-center px-4">
                      No image
                    </p>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    Term
                  </h3>
                  <p className="text-lg font-semibold leading-tight">
                    {card.term}
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-dashed" />

            {/* Definition Section - Back of Card */}
            <div className="flex gap-4 items-start">
              {/* Image Container - Card Style */}
              <div className="flex-shrink-0">
                {card.defImgUrl ? (
                  <div className="relative w-48 h-48 rounded-lg overflow-hidden shadow-lg border-2 border-secondary/20 bg-gradient-to-br from-secondary/5 to-secondary/10">
                    <img
                      src={card.defImgUrl}
                      alt="Definition"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-48 h-48 rounded-lg shadow-lg border-2 border-dashed border-muted-foreground/30 bg-gradient-to-br from-muted/30 to-muted/50 flex items-center justify-center">
                    <p className="text-xs text-muted-foreground text-center px-4">
                      No image
                    </p>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    Definition
                  </h3>
                  <p className="text-base leading-relaxed">{card.definition}</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Card</DialogTitle>
          </DialogHeader>
          <FlashcardCardForm
            card={card}
            isLoading={updateMutation.isPending}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Card</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this card? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

// Define columns
const createCardColumns = (deckId: string): ColumnDef<Flashcard>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-[100px]">{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'termImgUrl',
    header: 'Image',
    cell: ({ row }) => {
      const termImg = row.original.termImgUrl;
      const defImg = row.original.defImgUrl;
      const hasImage = termImg || defImg;

      return (
        <div className="w-[60px]">
          {hasImage ? (
            <img
              src={termImg || defImg || ''}
              alt="Card preview"
              className="w-12 h-12 object-cover rounded border"
            />
          ) : (
            <div className="w-12 h-12 bg-muted rounded border flex items-center justify-center text-xs text-muted-foreground">
              No img
            </div>
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'term',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Term" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate font-medium">
            {row.getValue('term') || 'N/A'}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'definition',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Definition" />
    ),
    cell: ({ row }) => {
      return (
        <div className="max-w-[300px] truncate">
          {row.getValue('definition') || 'N/A'}
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <CardRowActions card={row.original} deckId={deckId} />,
  },
];

interface FlashcardManageCardsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deckId: string;
}

export const FlashcardManageCardsDialog = ({
  open,
  onOpenChange,
  deckId,
}: FlashcardManageCardsDialogProps) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<Array<{ id: string; desc: boolean }>>(
    [],
  );
  const [columnFilters, setColumnFilters] = useState<
    Array<{ id: string; value: unknown }>
  >([]);
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({});
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  // Fetch flashcards
  const { data: cards = [], isLoading } = useGetFlashcardsByDeckIdQuery(deckId);
  const createMutation = useCreateFlashcardMutation();

  console.log('Cards:', cards);

  const handleCreate = async (values: {
    term: string;
    definition: string;
    termImgUrl?: string;
    defImgUrl?: string;
  }) => {
    try {
      await createMutation.mutateAsync({
        deckId,
        payload: {
          flashcards: [
            {
              term: values.term,
              definition: values.definition,
              termImgUrl: values.termImgUrl || null,
              defImgUrl: values.defImgUrl || null,
            },
          ],
        },
      });
      toast.success('Card created successfully');
      setIsCreateOpen(false);
    } catch (error) {
      toast.error('Failed to create card');
    }
  };

  const cardColumns = useMemo(() => createCardColumns(deckId), [deckId]);

  const table = useReactTable({
    data: cards,
    columns: cardColumns,
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1200px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Cards</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">Deck ID: {deckId}</p>
            <Button size="sm" onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Card
            </Button>
          </div>

          <DataTableToolbar
            table={table}
            searchPlaceholder="Search by term, definition..."
            searchKey="term"
          />

          {isLoading ? (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Select</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead>Definition</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <TableRow key={idx}>
                      {cardColumns.map((_, cellIdx) => (
                        <TableCell key={cellIdx}>
                          <Skeleton className="h-8 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : cards.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-muted-foreground">
                No cards found. Create your first card!
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
                          colSpan={cardColumns.length}
                          className="h-24 text-center"
                        >
                          No results.
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

        {/* Create Card Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Card</DialogTitle>
            </DialogHeader>
            <FlashcardCardForm
              isLoading={createMutation.isPending}
              onSubmit={handleCreate}
              onCancel={() => setIsCreateOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};
