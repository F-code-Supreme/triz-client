import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import i18next from 'i18next';
import { Plus, MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('pages.admin');
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
      toast.success(t('flashcards.manage_cards.card_updated'));
      setIsEditOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error(t('flashcards.manage_cards.update_failed'));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync({
        flashcardId: card.id,
        deckId,
      });
      toast.success(t('flashcards.manage_cards.card_deleted'));
      setIsDeleteOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error(t('flashcards.manage_cards.delete_failed'));
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
          <DropdownMenuLabel>
            {t('flashcards.deck_actions.actions')}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsPreviewOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            {t('flashcards.deck_actions.preview')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            {t('flashcards.deck_actions.edit')}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t('flashcards.deck_actions.delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>
              {t('flashcards.manage_cards.preview_title')}
            </DialogTitle>
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
                      alt={t('flashcards.manage_cards.term_label')}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-48 h-48 rounded-lg shadow-lg border-2 border-dashed border-muted-foreground/30 bg-gradient-to-br from-muted/30 to-muted/50 flex items-center justify-center">
                    <p className="text-xs text-muted-foreground text-center px-4">
                      {t('flashcards.manage_cards.no_image')}
                    </p>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    {t('flashcards.manage_cards.term_label')}
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
                      alt={t('flashcards.manage_cards.definition_label')}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-48 h-48 rounded-lg shadow-lg border-2 border-dashed border-muted-foreground/30 bg-gradient-to-br from-muted/30 to-muted/50 flex items-center justify-center">
                    <p className="text-xs text-muted-foreground text-center px-4">
                      {t('flashcards.manage_cards.no_image')}
                    </p>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    {t('flashcards.manage_cards.definition_label')}
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
            <DialogTitle>{t('flashcards.manage_cards.edit_title')}</DialogTitle>
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
            <AlertDialogTitle>
              {t('flashcards.manage_cards.delete_title')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('flashcards.manage_cards.delete_message')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t('flashcards.card_form.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              {t('flashcards.deck_actions.delete')}
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
    accessorKey: 'termImgUrl',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18next.t('pages.admin:flashcards.manage_cards.table.image')}
      />
    ),
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
              {i18next.t('pages.admin:flashcards.manage_cards.no_img')}
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
      <DataTableColumnHeader
        column={column}
        title={i18next.t('pages.admin:flashcards.manage_cards.table.term')}
      />
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
      <DataTableColumnHeader
        column={column}
        title={i18next.t(
          'pages.admin:flashcards.manage_cards.table.definition',
        )}
      />
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
  deckTitle?: string;
}

export const FlashcardManageCardsDialog = ({
  open,
  onOpenChange,
  deckId,
  deckTitle,
}: FlashcardManageCardsDialogProps) => {
  const { t } = useTranslation('pages.admin');
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

  // console.log('Cards:', cards);

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
      toast.success(t('flashcards.manage_cards.card_created'));
      setIsCreateOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error(t('flashcards.manage_cards.create_failed'));
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
          <DialogTitle>{t('flashcards.manage_cards.title')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {t('flashcards.manage_cards.deck_label', { deckTitle })}
            </p>
            <Button size="sm" onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t('flashcards.manage_cards.new_card')}
            </Button>
          </div>

          <DataTableToolbar
            table={table}
            searchPlaceholder={t('flashcards.manage_cards.search_placeholder')}
            searchKey="term"
          />

          {isLoading ? (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      {t('flashcards.manage_cards.table.image')}
                    </TableHead>
                    <TableHead>
                      {t('flashcards.manage_cards.table.term')}
                    </TableHead>
                    <TableHead>
                      {t('flashcards.manage_cards.table.definition')}
                    </TableHead>
                    <TableHead>
                      {t('flashcards.manage_cards.table.actions')}
                    </TableHead>
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
                {t('flashcards.manage_cards.no_cards')}
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
                          {t('flashcards.manage_cards.no_results')}
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
              <DialogTitle>
                {t('flashcards.manage_cards.create_title')}
              </DialogTitle>
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
