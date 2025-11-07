import { PlusIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

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
import PackageCard from '@/features/packages/components/package-card';
import PackageDialog from '@/features/packages/components/package-dialog';
import { PackageStatus } from '@/features/packages/types';
import { AdminLayout } from '@/layouts/admin-layout';

import type { Package } from '@/features/packages/types';

const AdminManagePackagePage = () => {
  // Constants
  const CHECK_ICON_URL =
    'https://res.cloudinary.com/djeel69su/image/upload/v1761448013/check_f8tm4n.webp';
  const DEFAULT_TIMESTAMP = '2025-11-01T14:43:46.820820Z';

  // Mock data based on the provided API response
  const mockPackages: Package[] = useMemo(
    () => [
      {
        id: 'abcf61de-4c3d-4663-9579-55657c569287',
        name: 'Experimental Plan',
        priceInTokens: 1000,
        durationInDays: 30,
        chatTokenPerDay: 500,
        status: PackageStatus.INACTIVE,
        features: [
          {
            iconUrl: 'https://example.com/icon1.png',
            description: 'Unlimited AI conversations',
          },
          {
            iconUrl: 'https://example.com/icon2.png',
            description: 'Priority support',
          },
        ],
        deletedAt: null,
        createdAt: '2025-11-01T14:45:44.667886Z',
        updatedAt: '2025-11-01T14:45:44.667959Z',
      },
      {
        id: '7428c518-f8ce-4223-9a55-365611cfade3',
        name: 'Basic Plan',
        priceInTokens: 1000,
        durationInDays: 30,
        chatTokenPerDay: 500,
        status: PackageStatus.ACTIVE,
        features: [
          {
            iconUrl: CHECK_ICON_URL,
            description: 'Access to standard chat features',
          },
          {
            iconUrl: CHECK_ICON_URL,
            description: 'Up to 5 conversations per day',
          },
        ],
        deletedAt: null,
        createdAt: DEFAULT_TIMESTAMP,
        updatedAt: DEFAULT_TIMESTAMP,
      },
      {
        id: '8da9feea-a28a-4a83-ad13-e1541e5d05e6',
        name: 'Premium Plan',
        priceInTokens: 5000,
        durationInDays: 30,
        chatTokenPerDay: 2000,
        status: PackageStatus.ACTIVE,
        features: [
          {
            iconUrl: CHECK_ICON_URL,
            description: 'Access to all chat features',
          },
          {
            iconUrl: CHECK_ICON_URL,
            description: 'Unlimited daily conversations',
          },
          {
            iconUrl: CHECK_ICON_URL,
            description: 'Get priority customer support',
          },
        ],
        deletedAt: null,
        createdAt: DEFAULT_TIMESTAMP,
        updatedAt: DEFAULT_TIMESTAMP,
      },
      {
        id: '7b682372-bd6e-4f30-ad2b-8e2285ca8328',
        name: 'Enterprise Plan',
        priceInTokens: 10000,
        durationInDays: 90,
        chatTokenPerDay: 5000,
        status: PackageStatus.ACTIVE,
        features: [
          {
            iconUrl: CHECK_ICON_URL,
            description: 'Complete access to all features',
          },
          {
            iconUrl: CHECK_ICON_URL,
            description: 'No limits on usage',
          },
          {
            iconUrl: CHECK_ICON_URL,
            description: '24/7 dedicated support team',
          },
          {
            iconUrl: CHECK_ICON_URL,
            description: 'API access and custom integrations',
          },
        ],
        deletedAt: null,
        createdAt: DEFAULT_TIMESTAMP,
        updatedAt: DEFAULT_TIMESTAMP,
      },
    ],
    [],
  );

  const [packages, setPackages] = useState<Package[]>(mockPackages);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);

  // Filter packages by status
  const filteredPackages = useMemo(() => {
    if (statusFilter === 'ALL') return packages;
    return packages.filter((pkg) => pkg.status === statusFilter);
  }, [packages, statusFilter]);

  const total = filteredPackages.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const pagedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredPackages.slice(start, start + pageSize);
  }, [page, pageSize, filteredPackages]);

  const handleCreate = () => {
    setEditingPackage(null);
    setDialogOpen(true);
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to delete this package?')) {
      setPackages((prev) => prev.filter((pkg) => pkg.id !== id));
    }
  };

  const handleSave = (packageData: Partial<Package>) => {
    if (editingPackage) {
      // Update existing package
      setPackages((prev) =>
        prev.map((pkg) =>
          pkg.id === editingPackage.id
            ? { ...pkg, ...packageData, updatedAt: new Date().toISOString() }
            : pkg,
        ),
      );
    } else {
      // Create new package
      const newPackage: Package = {
        id: crypto.randomUUID(),
        name: packageData.name || '',
        priceInTokens: packageData.priceInTokens || 0,
        durationInDays: packageData.durationInDays || 0,
        chatTokenPerDay: packageData.chatTokenPerDay || 0,
        status: packageData.status || PackageStatus.ACTIVE,
        features: packageData.features || [],
        deletedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPackages((prev) => [newPackage, ...prev]);
    }
  };

  return (
    <AdminLayout meta={{ title: 'Admin Manage Package' }}>
      <div className="space-y-6 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Manage Packages
            </h1>
            <p className="text-muted-foreground">
              Manage subscription packages offered on the platform. You can add,
              edit, or remove packages as needed.
            </p>
          </div>
          <Button onClick={handleCreate}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Create Package
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Status:</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Items per page:</label>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(parseInt(value));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="8">8</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="16">16</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="ml-auto text-sm text-muted-foreground">
            Total: {total} package{total !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Grid */}
        {pagedItems.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pagedItems.map((pkg) => (
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
              No packages found
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your filters or create a new package
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
                      setPage((p) => Math.max(1, p - 1));
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
                          isActive={p === page}
                          onClick={(e: React.MouseEvent) => {
                            e.preventDefault();
                            setPage(p);
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
                      setPage((p) => Math.min(totalPages, p + 1));
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
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
      </div>
    </AdminLayout>
  );
};

export default AdminManagePackagePage;
