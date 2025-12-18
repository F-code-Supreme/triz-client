import { useNavigate } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import CourseItem from '@/features/courses/components/course-item';
import { useGetCourseQuery } from '@/features/courses/services/queries';
import { AdminLayout } from '@/layouts/admin-layout';

import type { PaginationState } from '@tanstack/react-table';

const AdminManageCoursePage = () => {
  const { t } = useTranslation('pages.admin');
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  });

  const { data, isFetching, isLoading } = useGetCourseQuery(pagination);

  const isBusy = isFetching || isLoading;

  const coursesData = data?.content ?? [];

  const apiPage = data?.page;

  const totalPages = apiPage ? Math.max(1, apiPage.totalPages) : 1;

  const renderTabContent = () => {
    return (
      <div className="space-y-6 p-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {t('courses.title')}
            </h1>
            <p className="text-muted-foreground">{t('courses.description')}</p>
          </div>
          <div>
            <Button
              onClick={() => {
                navigate({ to: '/admin/courses/create' });
              }}
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              {t('courses.create_course')}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isBusy
            ? // simple skeleton placeholders
              Array.from({ length: Math.max(pagination.pageSize ?? 4, 4) }).map(
                (_, i) => (
                  <div
                    key={i}
                    className="animate-pulse p-4 border rounded-md bg-card "
                    aria-hidden
                  >
                    <div className="h-56 bg-gray-200 rounded mb-2" />
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-1" />
                    <div className="h-8 bg-gray-200 rounded w-1/2" />
                  </div>
                ),
              )
            : coursesData.map((course) => (
                <CourseItem key={course.id} course={course} />
              ))}
        </div>

        {/* Pagination */}
        <div className="flex flex-col items-center gap-2">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  size="sm"
                  href="#"
                  aria-disabled={isBusy}
                  className={isBusy ? 'opacity-50 ' : ''}
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    if (isBusy) return;
                    setPagination((prev) => ({
                      ...prev,
                      pageIndex: Math.max(0, prev.pageIndex - 1),
                    }));
                  }}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const p = idx + 1;
                return (
                  <PaginationItem key={p}>
                    <PaginationLink
                      size="sm"
                      href="#"
                      isActive={p === pagination.pageIndex + 1}
                      aria-disabled={isBusy}
                      className={isBusy ? 'opacity-50 pointer-events-none' : ''}
                      onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        if (isBusy) return;
                        setPagination((prev) => ({
                          ...prev,
                          pageIndex: p - 1,
                        }));
                      }}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  size="sm"
                  href="#"
                  aria-disabled={isBusy}
                  className={isBusy ? 'opacity-50 pointer-events-none' : ''}
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    if (isBusy) return;
                    setPagination((prev) => ({
                      ...prev,
                      pageIndex: Math.min(totalPages - 1, prev.pageIndex + 1),
                    }));
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout meta={{ title: t('courses.title') }}>
      {renderTabContent()}
    </AdminLayout>
  );
};

export default AdminManageCoursePage;
