import { useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';

import type { GetQuizzByModulesResponse, QuizGetAnswersAttempt } from './type';

export const useGetQuizzByModulesQuery = (moduleId: string) => {
  const _request = useAxios();
  return useQuery({
    queryKey: ['getQuizzByModules', moduleId],
    queryFn: async () => {
      const response = await _request.get<GetQuizzByModulesResponse>(
        `/modules/${moduleId}/quizzes`,
      );
      return response.data;
    },
    enabled: !!moduleId,
  });
};

export const useGetQuizAttemptInProgressQuery = () => {
  const _request = useAxios();
  return useQuery({
    queryKey: ['quizAttemptInProgress'],
    queryFn: async () => {
      try {
        const response = await _request.get<QuizGetAnswersAttempt>(
          '/quiz-attempts/me/in-progress',
        );
        return response.data;
      } catch (error: unknown) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
  });
};
