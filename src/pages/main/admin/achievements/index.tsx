import { PlusIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AchievementCard,
  AchievementDialog,
  DeleteConfirmDialog,
} from '@/features/achievement/components';
import {
  useCreateAchievementMutation,
  useDeleteAchievementMutation,
  useUpdateAchievementMutation,
} from '@/features/achievement/services/mutations';
import { useGetAchievementsQuery } from '@/features/achievement/services/queries';
import { AdminLayout } from '@/layouts/admin-layout';

import type { CreateAchievementPayload } from '@/features/achievement/services/mutations/types';
import type { Achievement } from '@/features/achievement/types';

const pageSize = 8;

const AdminManageAchievementPage = () => {
  const { t } = useTranslation('pages.admin');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] =
    useState<Achievement | null>(null);
  const [deletingAchievement, setDeletingAchievement] =
    useState<Achievement | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Queries
  const { data: achievementsData, isLoading } = useGetAchievementsQuery(
    { pageIndex: currentPage, pageSize },
    [{ id: 'createdAt', desc: true }],
  );

  // Mutations
  const createAchievement = useCreateAchievementMutation();
  const updateAchievement = useUpdateAchievementMutation();
  const deleteAchievement = useDeleteAchievementMutation();

  const achievements = useMemo(
    () => achievementsData?.content || [],
    [achievementsData],
  );

  const pageInfo = useMemo(() => achievementsData?.page, [achievementsData]);

  const filteredAchievements = useMemo(() => {
    if (statusFilter === 'ALL') return achievements;
    return achievements.filter(
      (achievement) => achievement.status === statusFilter,
    );
  }, [achievements, statusFilter]);

  const totalPages = pageInfo?.totalPages || 1;
  const displayPage = currentPage + 1;

  const handleCreate = () => {
    setEditingAchievement(null);
    setDialogOpen(true);
  };

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setDialogOpen(true);
  };

  const handleDeleteClick = (achievement: Achievement) => {
    setDeletingAchievement(achievement);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletingAchievement) return;

    deleteAchievement.mutate(deletingAchievement.id, {
      onSuccess: () => {
        toast.success(t('achievements.toast.delete_success'));
        setDeleteDialogOpen(false);
        setDeletingAchievement(null);
      },
      onError: (error) => {
        console.error('Delete error:', error);
        toast.error(t('achievements.toast.delete_error'));
      },
    });
  };

  const handleDelete = (id: string) => {
    const achievement = achievements.find((a) => a.id === id);
    if (achievement) {
      handleDeleteClick(achievement);
    }
  };

  const handleSave = (achievementData: Partial<Achievement>) => {
    if (editingAchievement) {
      updateAchievement.mutate(
        {
          id: editingAchievement.id,
          ...achievementData,
        },
        {
          onSuccess: () => {
            setDialogOpen(false);
            toast.success(t('achievements.toast.update_success'));
          },
          onError: (error) => {
            console.error('Update error:', error);
            toast.error(t('achievements.toast.update_error'));
          },
        },
      );
    } else {
      createAchievement.mutate(achievementData as CreateAchievementPayload, {
        onSuccess: () => {
          toast.success(t('achievements.toast.create_success'));
          setDialogOpen(false);
        },
        onError: (error) => {
          console.error('Create error:', error);
          toast.error(t('achievements.toast.create_error'));
        },
      });
    }
  };

  return (
    <AdminLayout meta={{ title: t('achievements.title') }}>
      <div className="space-y-6 p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {t('achievements.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('achievements.description')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCreate}>
              <PlusIcon className="mr-2 h-4 w-4" />
              {t('achievements.create_achievement')}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">
              {t('achievements.dialog.form.status')}
            </label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">
                  {t('achievements.status_filter.all')}
                </SelectItem>
                <SelectItem value="ACTIVE">
                  {t('achievements.status_filter.active')}
                </SelectItem>
                <SelectItem value="INACTIVE">
                  {t('achievements.status_filter.inactive')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredAchievements.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDeleted={false}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              {t('achievements.no_achievements')}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {t('achievements.create_first')}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center gap-2">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    size="sm"
                    href="#"
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      if (currentPage > 0) {
                        setCurrentPage(currentPage - 1);
                      }
                    }}
                    aria-disabled={currentPage === 0}
                    className={
                      currentPage === 0 ? 'pointer-events-none opacity-50' : ''
                    }
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(totalPages, 5) }).map(
                  (_, idx) => {
                    const p = idx + 1;
                    return (
                      <PaginationItem key={p}>
                        <PaginationLink
                          size="sm"
                          href="#"
                          isActive={p === displayPage}
                          onClick={(e: React.MouseEvent) => {
                            e.preventDefault();
                            setCurrentPage(p - 1);
                          }}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  },
                )}

                {totalPages > 5 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    size="sm"
                    href="#"
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      if (currentPage < totalPages - 1) {
                        setCurrentPage(currentPage + 1);
                      }
                    }}
                    aria-disabled={currentPage >= totalPages - 1}
                    className={
                      currentPage >= totalPages - 1
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            <p className="text-sm text-muted-foreground">
              {t('achievements.pagination.page_of', {
                current: displayPage,
                total: totalPages,
              })}
            </p>
          </div>
        )}

        {/* Dialogs */}
        <AchievementDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          achievement={editingAchievement}
          onSave={handleSave}
        />

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          achievement={deletingAchievement}
          onConfirm={handleDeleteConfirm}
          isDeleting={deleteAchievement.isPending}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminManageAchievementPage;
