import { useQuery } from '@tanstack/react-query';
import { useAxios } from '@/configs/axios';
import type { getQuizzByModulesResponse } from './type';

export const useGetQuizzByModulesQuery = (moduleId: string) => {
  const _request = useAxios();
  return useQuery({
    queryKey: ['getQuizzByModules', moduleId],
    queryFn: async () => {
      const response = await _request.get<getQuizzByModulesResponse>(
        `/modules/${moduleId}/quizzes`,
      );
      console.log('response for quiz', response.data);
      return response.data;
    },
    enabled: !!moduleId,
  });
};
