import { useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import { CourseKeys } from '@/features/courses/services/queries/keys';

import type { CourseResponse } from './types';
import { CourseDetailResponse } from '../../types';
import { ModuleResponse } from '@/features/modules/services/queries/types';
import { AssignmentResponse } from '@/features/assignment/services/queries/types';

export const useGetCourseQuery = () => {
  const _request = useAxios();
  return useQuery({
    queryKey: [CourseKeys.GetCourseQuery],
    queryFn: async () => {
      const response = await _request.get<CourseResponse>('/courses');

      return response.data;
    },
  });
};

export const useGetCourseByIdQuery = (courseId: string) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [CourseKeys.GetCourseQuery, courseId],
    queryFn: async () => {
      const response = await _request.get<CourseDetailResponse>(
        `/courses/${courseId}`,
      );
      return response.data;
    },
    enabled: !!courseId,
  });
};

//lessonsS
export const useGetLessonQuery = (moduleId: string) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [CourseKeys.GetModuleQuery, moduleId],
    queryFn: async () => {
      const response = await _request.get<ModuleResponse[]>(
        `/modules/${moduleId}/lessons`,
      );
      return response.data;
    },
  });
};

//assignments
export const useGetAssignmentModuleQuery = (moduleId: string) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [CourseKeys.GetModuleQuery, moduleId],
    queryFn: async () => {
      const response = await _request.get<AssignmentResponse>(
        `/modules/${moduleId}/assignments`,
      );
      return response.data;
    },
  });
};
