import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useAxios } from '@/configs/axios';
import { AssignmentKeys } from '@/features/assignment/services/queries/keys';
import { LessonKeys } from '@/features/lesson/services/queries/keys';
import { ModuleKeys } from '@/features/modules/services/queries/keys';
import { useGetUserQuizAttemptsQuery } from '@/features/quiz/service/mutations';

import type { AssignmentSubmissionHistoryResponse } from '@/features/assignment/services/queries/types';
import type { LessonProgressResponse } from '@/features/lesson/services/queries/types';

interface UseCourseProgressProps {
  lessonIds: string[];
  assignmentIds: string[];
  moduleIds: string[];
  userId?: string;
}

export const useCourseProgress = ({
  lessonIds,
  assignmentIds,
  moduleIds,
  userId,
}: UseCourseProgressProps) => {
  const _request = useAxios();

  const { data: quizData } = useGetUserQuizAttemptsQuery();

  const lessonProgressQueries = useQueries({
    queries: lessonIds.map((lessonId) => ({
      queryKey: [LessonKeys.GetLessonProgress, lessonId],
      queryFn: async () => {
        const response = await _request.get<LessonProgressResponse>(
          `/lessons/${lessonId}/progress`,
        );
        return response.data;
      },
      enabled: !!lessonId,
    })),
  });

  const assignmentProgressQueries = useQueries({
    queries: assignmentIds.map((assignmentId) => ({
      queryKey: [
        AssignmentKeys.GetAssignmentSubmissionHistoryQuery,
        userId,
        assignmentId,
      ],
      queryFn: async () => {
        const response =
          await _request.get<AssignmentSubmissionHistoryResponse>(
            `/asm-submissions/users/${userId}/assignments/${assignmentId}`,
          );
        return response.data;
      },
      enabled: !!userId && !!assignmentId,
    })),
  });

  const moduleProgressQueries = useQueries({
    queries: moduleIds.map((moduleId) => ({
      queryKey: [ModuleKeys.GetModuleProgress, moduleId],
      queryFn: async () => {
        const response = await _request.get<{ isCompleted: boolean }>(
          `/module/${moduleId}/progress`,
        );
        console.log('Fetched module progress:', response.data);
        return response.data;
      },
      enabled: !!moduleId,
    })),
  });

  const lessonProgressMap = useMemo(() => {
    const map = new Map<string, boolean>();
    lessonIds.forEach((lessonId, index) => {
      const progress = lessonProgressQueries[index]?.data;
      map.set(lessonId, progress?.isCompleted || false);
    });
    return map;
  }, [lessonIds, lessonProgressQueries]);

  const assignmentProgressMap = useMemo(() => {
    const map = new Map<string, boolean>();
    assignmentIds.forEach((assignmentId, index) => {
      const submissions = assignmentProgressQueries[index]?.data?.content;
      const isCompleted =
        submissions?.some(
          (submission: any) => submission.isExpertPassed === true,
        ) || false;
      map.set(assignmentId, isCompleted);
    });
    return map;
  }, [assignmentIds, assignmentProgressQueries]);

  const moduleProgressMap = useMemo(() => {
    const map = new Map<string, boolean>();
    moduleIds.forEach((moduleId, index) => {
      const progress = moduleProgressQueries[index]?.data;
      console.log('Module Progress:', moduleId, progress);
      console.log('moduleProgressQueries', moduleProgressQueries);
      map.set(moduleId, progress?.isCompleted || false);
    });

    console.log('Module Progress Map:', map);
    return map;
  }, [moduleIds, moduleProgressQueries]);

  const quizzProgressMap = useMemo(() => {
    const map = new Map<string, boolean>();
    if (quizData && Array.isArray(quizData.content)) {
      quizData.content.forEach((quiz: any) => {
        const currentStatus = map.get(quiz.quizId) || false;
        const isPassed = quiz.score >= quiz.passingScore;
        map.set(quiz.quizId, currentStatus || isPassed);
      });
    }

    return map;
  }, [quizData]);

  const isLoading =
    lessonProgressQueries.some((q) => q.isLoading) ||
    assignmentProgressQueries.some((q) => q.isLoading) ||
    moduleProgressQueries.some((q) => q.isLoading) ||
    false;

  return {
    lessonProgressMap,
    assignmentProgressMap,
    moduleProgressMap,
    quizzProgressMap,
    isLoading,
  };
};
