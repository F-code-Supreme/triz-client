import { motion } from 'framer-motion';
import { useState } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import CourseFiltersComponent from '@/features/courses/components/course-filters';
import CourseList from '@/features/courses/components/course-list';
import {
  useGetMyEnrollmentsQuery,
  useGetCourseQueryUser,
} from '@/features/courses/services/queries';
import { DefaultLayout } from '@/layouts/default-layout';

import type { CourseFilters } from '@/features/courses/types';

const MyCoursePage = () => {
  const [filters, setFilters] = useState<CourseFilters>({});
  const {
    data: enrollmentsData,
    isLoading,
    isError,
  } = useGetMyEnrollmentsQuery();
  const { data: coursesData } = useGetCourseQueryUser();

  const enrolledCourses = (enrollmentsData?.content || []).map((enrollment) => {
    const courseDetail = (coursesData?.content || []).find(
      (course) => course.id === enrollment.courseId,
    );
    return {
      id: enrollment.courseId,
      title: enrollment.courseTitle,
      status: enrollment.status,
      enrolledAt: enrollment.enrolledAt,
      description: courseDetail?.description ?? '',
      shortDescription: courseDetail?.shortDescription ?? '',
      thumbnail: courseDetail?.thumbnail ?? '',
      thumbnailUrl: courseDetail?.thumbnailUrl ?? '',
      durationInMinutes: courseDetail?.durationInMinutes ?? 0,
      level: courseDetail?.level ?? '',
      // modules: courseDetail?.orders ?? [],
      learnerCount: courseDetail?.learnerCount ?? 0,
      price: courseDetail?.price ?? 0,
      dealPrice: courseDetail?.dealPrice ?? 0,
      slug: courseDetail?.slug ?? '',
      updatedAt: courseDetail?.updatedAt ?? '',
    };
  });

  return (
    <DefaultLayout meta={{ title: 'My Courses' }}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              My Courses
            </h1>
            <p className="text-muted-foreground">
              Continue your learning journey with your enrolled courses
            </p>
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
            <div>Failed to load courses.</div>
          ) : (
            <CourseList
              courses={enrolledCourses}
              filters={filters}
              enrolledCourseIds={enrolledCourses.map((c) => c.id)}
            />
          )}
        </motion.div>
      </div>
    </DefaultLayout>
  );
};

export default MyCoursePage;
