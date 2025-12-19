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
  lessonProgressMap?: Map<string, boolean>;
  assignmentProgressMap?: Map<string, boolean>;
  moduleProgressMap?: Map<string, boolean>;
  quizzProgressMap?: Map<string, boolean>;
}

export const useCourseContent = ({
  modules,
  lessonsData,
  assignmentsData,
  quizzesData,
  currentModuleId,
  lessonProgressMap = new Map(),
  assignmentProgressMap = new Map(),
  moduleProgressMap = new Map(),
  quizzProgressMap = new Map(),
}: UseCourseContentProps) => {
  const enhancedModules: EnhancedModule[] = useMemo(() => {
    if (!modules || !Array.isArray(modules)) return [];

    return modules.map((module, index) => {
      const isCurrentModule = module.id === currentModuleId;
      const contents: ModuleContentItem[] = [];

      // Process lessons
      if (isCurrentModule) {
        if (lessonsData?.content && Array.isArray(lessonsData.content)) {
          lessonsData.content.forEach((lesson: any) => {
            const lessonItem: LessonContentItem = {
              id: lesson.id,
              type: 'lesson',
              order: 0,
              title: lesson.title,
              lessonData: lesson,
              isCompleted: lessonProgressMap.get(lesson.id) || false,
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
              isCompleted: assignmentProgressMap.get(assignment.id) || false,
            };
            contents.push(assignmentItem);
          });
        }

        // Process quizzes
        if (quizzesData?.content && Array.isArray(quizzesData.content)) {
          quizzesData.content.forEach((quiz: any) => {
            const quizItem: QuizContentItem = {
              id: quiz.id,
              type: 'quiz',
              order: 0,
              title: quiz.title,
              quizData: quiz,
              isCompleted: quizzProgressMap.get(quiz.id) || false,
            };
            contents.push(quizItem);
          });
        }

        // Sort contents based on module.orders
        if (module.orders && Array.isArray(module.orders)) {
          contents.forEach((item) => {
            const orderInfo = module.orders.find((o) => o.subsetId === item.id);
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
        isCompleted: moduleProgressMap.get(module.id) || false,
      };
    });
  }, [
    modules,
    lessonsData,
    assignmentsData,
    quizzesData,
    currentModuleId,
    lessonProgressMap,
    assignmentProgressMap,
    moduleProgressMap,
    quizzProgressMap,
  ]);

  const currentModule = useMemo(() => {
    return enhancedModules.find((m) => m.id === currentModuleId);
  }, [enhancedModules, currentModuleId]);

  const allContentItems = useMemo(() => {
    return enhancedModules.flatMap((module) => module.contents);
  }, [enhancedModules]);

  // Find the first incomplete item in the current module
  const firstIncompleteItem = useMemo(() => {
    if (!currentModule || !currentModule.contents.length) return null;

    const incompleteItem = currentModule.contents.find(
      (item) => !item.isCompleted,
    );

    // If all items are completed, return the first item
    return incompleteItem || currentModule.contents[0];
  }, [currentModule]);

  // Get completed item IDs for the sidebar
  const completedItemIds = useMemo(() => {
    const ids: string[] = [];
    enhancedModules.forEach((module) => {
      module.contents.forEach((item) => {
        if (item.isCompleted) {
          ids.push(item.id);
        }
      });
    });
    return ids;
  }, [enhancedModules]);

  return {
    enhancedModules,
    currentModule,
    allContentItems,
    firstIncompleteItem,
    completedItemIds,
  };
};
