import { Link } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import React, { useState } from 'react';

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

const AdminManageCoursePage = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(8);

  const {
    data,
    isFetching: _isFetching,
    isLoading: _isLoading,
  } = useGetCourseQuery(page - 1, pageSize);

  const pagedItems = data?.content ?? [];
  const apiPage = data?.page;

  const totalPages = apiPage ? Math.max(1, apiPage.totalPages) : 1;

  const renderTabContent = () => {
    return (
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Manage Courses
            </h1>
            <p className="text-muted-foreground">
              Manage courses offered on the platform. You can add, edit, or
              remove courses as needed.
            </p>
          </div>
          <div>
            <Link
              to="/admin/courses/create"
              className="bg-blue-400 text-white px-4 py-2 rounded-md flex items-center"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Course
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {pagedItems.map((course) => (
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
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    setPage((p) => Math.max(1, p - 1));
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
              })}

              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
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
        </div>
      </div>
    );
  };

  return (
    <AdminLayout meta={{ title: 'Admin Manage Course' }}>
      {renderTabContent()}
    </AdminLayout>
  );
};

export default AdminManageCoursePage;
