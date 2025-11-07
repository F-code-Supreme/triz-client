import { useQuery, useMutation } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';

import type {
  GetQuizByIdResponse,
  GetQuizzesResponse,
  AutoSaveQuizAnswerPayload,
  SubmitQuizAttemptPayload,
  GetUserQuizAttemptsResponse,
} from './type';

export const useGetQuizzesMutation = () => {
  const _request = useAxios();
  return useQuery({
    queryKey: ['getQuizzes'],
    queryFn: async () => {
      const res = await _request.get<GetQuizzesResponse>('/quizzes');
      return res.data;
    },
  });
};

export const useGetQuizByIdMutation = (id: string) => {
  const _request = useAxios();
  return useQuery({
    queryKey: ['getQuizById', id],
    queryFn: async () => {
      const res = await _request.get<GetQuizByIdResponse>(`/quizzes/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

export const useStartQuizAttemptMutation = () => {
  const _request = useAxios();
  return useMutation({
    mutationFn: async ({
      quizId,
      userId,
    }: {
      quizId: string;
      userId: string;
    }) => {
      const res = await _request.post(
        `/quiz-attempts/start/quiz/${quizId}/user/${userId}`,
        {},
      );
      return res.data;
    },
  });
};

export const useAutoSaveQuizAnswerMutation = () => {
  const _request = useAxios();
  return useMutation({
    mutationFn: async ({
      attemptId,
      questionId,
      selectedOptionIds,
    }: AutoSaveQuizAnswerPayload) => {
      const res = await _request.post(`/quiz-attempts/${attemptId}/answer`, {
        questionId,
        selectedOptionIds,
      });
      return res.data;
    },
  });
};

export const useSubmitQuizAttemptMutation = () => {
  const _request = useAxios();
  return useMutation({
    mutationFn: async ({ attemptId, answers }: SubmitQuizAttemptPayload) => {
      const res = await _request.post(`/quiz-attempts/${attemptId}/submit`, {
        answers,
      });
      return res.data;
    },
  });
};

export const useGetQuizAttemptRemainingTimeQuery = (attemptId: string) => {
  const _request = useAxios();
  return useQuery({
    queryKey: ['quizAttemptRemainingTime', attemptId],
    queryFn: async () => {
      const res = await _request.get(
        `/quiz-attempts/${attemptId}/remaining-time`,
      );
      return res.data;
    },
    enabled: !!attemptId,
  });
};

export const useGetUserQuizAttemptsQuery = (userId: string) => {
  const _request = useAxios();
  return useQuery({
    queryKey: ['userQuizAttempts', userId],
    queryFn: async () => {
      const res = await _request.get<GetUserQuizAttemptsResponse>(
        `/quiz-attempts/user/${userId}`,
      );
      return res.data;
    },
    enabled: !!userId,
  });
};
