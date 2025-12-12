import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import CourseFiltersComponent from '@/features/courses/components/course-filters';
import CourseList from '@/features/courses/components/course-list';
import {
  useGetCourseQuery,
  useGetMyEnrollmentsQuery,
} from '@/features/courses/services/queries';
import { DefaultLayout } from '@/layouts/default-layout';

import type { CourseFilters } from '@/features/courses/types';
import type { PaginationState } from '@tanstack/react-table';

const AllCoursePage = () => {
  const { t } = useTranslation('pages.courses');
  const [filters, setFilters] = useState<CourseFilters>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 9,
  });
  const { data, isLoading, isError } = useGetCourseQuery(pagination);
  const { data: enrollmentsData } = useGetMyEnrollmentsQuery();
  const courseData = data?.content.filter((c) => c.status === 'ACTIVE') || [];

  const enrolledCourseIds = (enrollmentsData?.content || []).map(
    (enrollment) => enrollment.courseId,
  );

  return (
    <DefaultLayout meta={{ title: t('page_meta_title') }}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-row justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {t('all_courses.title')}
              </h1>
              <p className="text-muted-foreground">
                {t('all_courses.description')}
              </p>
            </div>

            <div>
              <Link
                to="/course/my-course"
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
              >
                {t('all_courses.my_courses_button')}
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <CourseFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-9 w-24 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div>{t('error')}</div>
          ) : (
            <>
              <CourseList
                courses={courseData}
                filters={filters}
                enrolledCourseIds={enrolledCourseIds}
              />

              {/* Pagination */}
              {data?.page && data.page.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (pagination.pageIndex > 0) {
                              setPagination((prev) => ({
                                ...prev,
                                pageIndex: prev.pageIndex - 1,
                              }));
                            }
                          }}
                          className={
                            pagination.pageIndex === 0
                              ? 'pointer-events-none opacity-50'
                              : ''
                          }
                        />
                      </PaginationItem>

                      {Array.from(
                        { length: data.page.totalPages },
                        (_, i) => i,
                      ).map((pageNum) => (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href="#"
                            isActive={pageNum === pagination.pageIndex}
                            onClick={(e) => {
                              e.preventDefault();
                              setPagination((prev) => ({
                                ...prev,
                                pageIndex: pageNum,
                              }));
                            }}
                          >
                            {pageNum + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      {data.page.totalPages > 5 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (
                              pagination.pageIndex <
                              data.page.totalPages - 1
                            ) {
                              setPagination((prev) => ({
                                ...prev,
                                pageIndex: prev.pageIndex + 1,
                              }));
                            }
                          }}
                          className={
                            pagination.pageIndex >= data.page.totalPages - 1
                              ? 'pointer-events-none opacity-50'
                              : ''
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </DefaultLayout>
  );
};

export default AllCoursePage;
