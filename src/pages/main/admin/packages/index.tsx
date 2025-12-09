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
import DeleteConfirmDialog from '@/features/packages/components/delete-confirm-dialog';
import PackageCard from '@/features/packages/components/package-card';
import PackageDialog from '@/features/packages/components/package-dialog';
import {
  useCreatePackageMutation,
  useDeletePackageMutation,
  useUpdatePackageMutation,
} from '@/features/packages/services/mutations';
import { useGetPackagesQuery } from '@/features/packages/services/queries';
import { AdminLayout } from '@/layouts/admin-layout';

import type { CreatePackagePayload } from '@/features/packages/services/mutations/types';
import type { Package } from '@/features/packages/types';

const AdminManagePackagePage = () => {
  const { t } = useTranslation('pages.admin');
  // Fetch packages from API
  const { data, isLoading } = useGetPackagesQuery();

  // Mutations
  const createPackage = useCreatePackageMutation();
  const updatePackage = useUpdatePackageMutation();
  const deletePackage = useDeletePackageMutation();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [deletingPackage, setDeletingPackage] = useState<Package | null>(null);

  // Get data
  const packages = useMemo(() => data?.content || [], [data]);
  const pageInfo = useMemo(() => data?.page, [data]);

  // Filter packages by status (client-side filtering)
  const filteredPackages = useMemo(() => {
    if (statusFilter === 'ALL') return packages;
    return packages.filter((pkg: Package) => pkg.status === statusFilter);
  }, [packages, statusFilter]);

  // Use pagination data
  const total = pageInfo?.totalElements || 0;
  const totalPages = pageInfo?.totalPages || 1;
  const currentPage = (pageInfo?.number || 0) + 1;

  const handleCreate = () => {
    setEditingPackage(null);
    setDialogOpen(true);
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setDialogOpen(true);
  };

  const handleDeleteClick = (pkg: Package) => {
    setDeletingPackage(pkg);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletingPackage) return;

    deletePackage.mutate(deletingPackage.id, {
      onSuccess: () => {
        toast.success(t('packages.toast.delete_success'));
        setDeleteDialogOpen(false);
        setDeletingPackage(null);
      },
      onError: (error) => {
        console.error('Delete error:', error);
        toast.error(t('packages.toast.delete_error'));
      },
    });
  };

  const handleDelete = (id: string) => {
    const pkg = packages.find((p) => p.id === id);
    if (pkg) {
      handleDeleteClick(pkg);
    }
  };

  const handleSave = (packageData: Partial<Package>) => {
    if (editingPackage) {
      // Update existing package
      updatePackage.mutate(
        {
          id: editingPackage.id,
          ...packageData,
        },
        {
          onSuccess: () => {
            setDialogOpen(false);
            toast.success(t('packages.toast.update_success'));
          },
          onError: (error) => {
            console.error('Update error:', error);
            toast.error(t('packages.toast.update_error'));
          },
        },
      );
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, createdAt, updatedAt, deletedAt, ...createData } =
        packageData as Package;
      createPackage.mutate(createData as CreatePackagePayload, {
        onSuccess: () => {
          toast.success(t('packages.toast.create_success'));
          setDialogOpen(false);
        },
        onError: (error) => {
          console.error('Create error:', error);
          toast.error(t('packages.toast.create_error'));
        },
      });
    }
  };

  return (
    <AdminLayout meta={{ title: 'Admin Manage Package' }}>
      <div className="space-y-6 p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {t('packages.title')}
            </h1>
            <p className="text-muted-foreground">{t('packages.description')}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCreate}>
              <PlusIcon className="mr-2 h-4 w-4" />
              {t('packages.create_package')}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">
              {t('packages.status_label')}
            </label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">
                  {t('packages.status_filter.all')}
                </SelectItem>
                <SelectItem value="ACTIVE">
                  {t('packages.status_filter.active')}
                </SelectItem>
                <SelectItem value="INACTIVE">
                  {t('packages.status_filter.inactive')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="ml-auto text-sm text-muted-foreground">
            {t('packages.total', { count: total })}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredPackages.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPackages.map((pkg: Package) => (
              <PackageCard
                key={pkg.id}
                package={pkg}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              {t('packages.no_packages')}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {t('packages.try_adjusting')}
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
                    }}
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
                          isActive={p === currentPage}
                          onClick={(e: React.MouseEvent) => {
                            e.preventDefault();
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
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        )}

        {/* Dialog */}
        <PackageDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          package={editingPackage}
          onSave={handleSave}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          package={deletingPackage}
          onConfirm={handleDeleteConfirm}
          isDeleting={deletePackage.isPending}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminManagePackagePage;
