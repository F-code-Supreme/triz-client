import { Link } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import React, { useMemo, useState } from 'react';

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
import { AdminLayout } from '@/layouts/admin-layout';

import type { Course } from '@/features/courses/types';

const AdminManageCoursePage = () => {
  // mock data
  const mockCourses: Course[] = useMemo(
    () =>
      Array.from({ length: 23 }).map((_, i) => {
        const id = i + 1;
        return {
          id,
          title: `Course ${id} — Intro to Topic ${id}`,
          description:
            'This is a short description for the course. It explains the main goals and what students will learn.',
          thumbnail: `https://picsum.photos/seed/course-${id}/600/400`,
        };
      }),
    [],
  );

  // pagination state
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(8);

  const total = mockCourses.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const pagedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return mockCourses.slice(start, start + pageSize);
  }, [page, pageSize, mockCourses]);

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
