import { useMemo } from 'react';
import type {
  EnhancedModule,
  ModuleContentItem,
  LessonContentItem,
  AssignmentContentItem,
  QuizContentItem,
} from '../types';
import type { Module } from '@/features/modules/types';

interface UseCourseContentProps {
  modules: Module[];
  lessonsData?: any;
  assignmentsData?: any;
  quizzesData?: any;
  currentModuleId: string;
}

export const useCourseContent = ({
  modules,
  lessonsData,
  assignmentsData,
  quizzesData,
  currentModuleId,
}: UseCourseContentProps) => {
  // Merge and transform all content for the current module
  const enhancedModules: EnhancedModule[] = useMemo(() => {
    if (!modules || !Array.isArray(modules)) return [];

    return modules.map((module, index) => {
      const isCurrentModule = module.id === currentModuleId;
      const contents: ModuleContentItem[] = [];

      // Only process contents for the current module to optimize performance
      if (isCurrentModule) {
        // Process lessons
        if (lessonsData && Array.isArray(lessonsData)) {
          lessonsData.forEach((lesson: any) => {
            const lessonItem: LessonContentItem = {
              id: lesson.id,
              type: 'lesson',
              order: 0, // Will be set based on module.orders
              title: lesson.name,
              lessonData: lesson,
            };
            contents.push(lessonItem);
          });
        }

        // Process assignments
        if (
          assignmentsData?.content &&
          Array.isArray(assignmentsData.content)
        ) {
          assignmentsData.content.forEach((assignment: any) => {
            const assignmentItem: AssignmentContentItem = {
              id: assignment.id,
              type: 'assignment',
              order: 0,
              title: assignment.title,
              assignmentData: assignment,
            };
            contents.push(assignmentItem);
          });
        }

        // Process quizzes
        if (quizzesData && Array.isArray(quizzesData)) {
          quizzesData.forEach((quiz: any) => {
            const quizItem: QuizContentItem = {
              id: quiz.id,
              type: 'quiz',
              order: 0,
              title: quiz.title,
              quizData: quiz,
            };
            contents.push(quizItem);
          });
        }

        // Sort contents based on module.orders
        if (module.orders && Array.isArray(module.orders)) {
          contents.forEach((item) => {
            const orderInfo = module.orders.find((o) => o.id === item.id);
            if (orderInfo) {
              item.order = module.orders.indexOf(orderInfo);
            }
          });
          contents.sort((a, b) => a.order - b.order);
        }
      }

      return {
        id: module.id,
        name: module.name,
        durationInMinutes: module.durationInMinutes,
        level: module.level,
        totalItems:
          module.lessonCount + module.quizCount + module.assignmentCount,
        contents,
        order: index,
      };
    });
  }, [modules, lessonsData, assignmentsData, quizzesData, currentModuleId]);

  // Get current module
  const currentModule = useMemo(() => {
    return enhancedModules.find((m) => m.id === currentModuleId);
  }, [enhancedModules, currentModuleId]);

  // Get all content items across all modules (for navigation)
  const allContentItems = useMemo(() => {
    return enhancedModules.flatMap((module) => module.contents);
  }, [enhancedModules]);

  return {
    enhancedModules,
    currentModule,
    allContentItems,
  };
};
