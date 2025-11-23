import { motion } from 'framer-motion';

import CourseCard from './course-card';
import { Course, CourseFilters } from '../types';

interface CourseListProps {
  courses: Course[];
  filters?: CourseFilters;
  className?: string;
}

const CourseList = ({ courses, filters, className }: CourseListProps) => {
  // Filter courses based on filters

  const filteredCourses = courses.filter((course) => {
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchableText =
        `${course.title ?? ''} ${course.description ?? ''}`.toLowerCase();
      if (!searchableText.includes(searchTerm)) {
        return false;
      }
    }

    if (filters?.status && course.status !== filters.status) {
      return false;
    }

    // category does not exist on Course, so skip

    if (filters?.level && course.level !== filters.level) {
      return false;
    }

    return true;
  });

  // Sort courses based on sort criteria
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    const { sortOrder = 'asc' } = filters || {};
    const comparison = (a.title ?? '').localeCompare(b.title ?? '');
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  if (sortedCourses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No courses found</h3>
        <p className="text-muted-foreground">
          {filters?.search ||
          filters?.status ||
          filters?.category ||
          filters?.level
            ? 'Try adjusting your filters to see more courses.'
            : "You haven't enrolled in any courses yet."}
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {sortedCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <CourseCard course={course} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CourseList;
