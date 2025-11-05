import { useQuery } from '@tanstack/react-query';
import { useAxios } from '@/configs/axios';
import {
  GetQuizByIdResponse,
  GetQuizzesResponse,
  AutoSaveQuizAnswerPayload,
  SubmitQuizAttemptPayload,
  GetUserQuizAttemptsResponse,
  CreateQuizPayload,
  CreateQuizResponse,
  UpdateQuizPayload,
  UpdateQuizResponse,
  GetAdminQuizzesResponse,
} from './type';
import { useMutation } from '@tanstack/react-query';

// users

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

// admin

export const useGetAdminQuizzesQuery = () => {
  const _request = useAxios();
  return useQuery({
    queryKey: ['getAdminQuizzes'],
    queryFn: async () => {
      const res = await _request.get<GetAdminQuizzesResponse>('/quizzes/admin');
      return res.data;
    },
  });
};

export const useGetQuizByIdMutationAdmin = (id: string) => {
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

export const useDeleteQuizByIdMutation = () => {
  const _request = useAxios();
  return useMutation({
    mutationFn: async (quizId: string) => {
      const res = await _request.delete(`/quizzes/${quizId}`);
      return res.data;
    },
  });
};

export const useCreateQuizMutation = () => {
  const _request = useAxios();
  return useMutation({
    mutationFn: async (payload: CreateQuizPayload) => {
      const res = await _request.post<CreateQuizResponse>('/quizzes', payload);
      return res.data;
    },
  });
};

export const useUpdateQuizMutation = () => {
  const _request = useAxios();
  return useMutation<
    UpdateQuizResponse,
    unknown,
    { quizId: string; payload: UpdateQuizPayload }
  >({
    mutationFn: async ({ quizId, payload }) => {
      const res = await _request.put<UpdateQuizResponse>(
        `/quizzes/${quizId}`,
        payload,
      );
      return res.data;
    },
  });
};
