import { useState } from 'react';
import { motion } from 'framer-motion';

import CourseList from '@/features/courses/components/course-list';
import CourseFiltersComponent from '@/features/courses/components/course-filters';
import { DefaultLayout } from '@/layouts/default-layout';
import { Link } from '@tanstack/react-router';
import {
  useGetCourseQuery,
  useGetMyEnrollmentsQuery,
} from '@/features/courses/services/queries';
import type { CourseFilters } from '@/features/courses/types';

const AllCoursePage = () => {
  const [filters, setFilters] = useState<CourseFilters>({});
  const { data, isLoading, isError } = useGetCourseQuery();
  const { data: enrollmentsData } = useGetMyEnrollmentsQuery();

  const enrolledCourseIds = (enrollmentsData?.content || []).map(
    (enrollment) => enrollment.courseId,
  );

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
          <div className="flex flex-row justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                All Courses
              </h1>
              <p className="text-muted-foreground">
                Explore and enroll in courses to start your learning journey
              </p>
            </div>

            <div>
              <Link
                to="/course/my-course"
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
              >
                My Courses
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
            <div>Loading courses...</div>
          ) : isError ? (
            <div>Failed to load courses.</div>
          ) : (
            <CourseList
              courses={data?.content || []}
              filters={filters}
              enrolledCourseIds={enrolledCourseIds}
            />
          )}
        </motion.div>
      </div>
    </DefaultLayout>
  );
};

export default AllCoursePage;
