import { useState } from 'react';
import { motion } from 'framer-motion';

import CourseList from '@/features/course/components/course-list';
import CourseFiltersComponent from '@/features/course/components/course-filters';
import { mockCourses } from '@/features/course/data/mock-courses';
import { CourseFilters } from '@/features/course/types';
// import { De } from 'zod/v4/locales';
import { DefaultLayout } from '@/layouts/default-layout';

function CoursePage() {
  const [filters, setFilters] = useState<CourseFilters>({});

  // Stats calculation
  // const totalCourses = mockCourses.length;
  // const completedCourses = mockCourses.filter(
  //   (course) => course.status === 'COMPLETED',
  // ).length;
  // const inProgressCourses = mockCourses.filter(
  //   (course) => course.status === 'IN_PROGRESS',
  // ).length;

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
          <h1 className="text-3xl font-bold text-foreground mb-2">
            My Courses
          </h1>
          <p className="text-muted-foreground">
            Continue your learning journey with your enrolled courses
          </p>
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
          <CourseList courses={mockCourses} filters={filters} />
        </motion.div>
      </div>
    </DefaultLayout>
  );
}

export default CoursePage;
