import { motion } from 'framer-motion';
import { useState } from 'react';
import CourseList from '@/features/courses/components/course-list';
import CourseFiltersComponent from '@/features/courses/components/course-filters';
import { DefaultLayout } from '@/layouts/default-layout';
import { CourseFilters } from '@/features/courses/types';
import {
  useGetMyEnrollmentsQuery,
  useGetCourseQuery,
} from '@/features/courses/services/queries';

function MyCoursePage() {
  const [filters, setFilters] = useState<CourseFilters>({});
  const {
    data: enrollmentsData,
    isLoading,
    isError,
  } = useGetMyEnrollmentsQuery();
  const { data: coursesData } = useGetCourseQuery();

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
            <div>Loading courses...</div>
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
}

export default MyCoursePage;
