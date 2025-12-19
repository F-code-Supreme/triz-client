import { useQuery } from '@tanstack/react-query';
import { useAxios } from '@/configs/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ReportResponse } from '@/features/report/types';
import { ReportKeys } from './keys';

export const useGetAllReportsQuery = () => {
  const _request = useAxios();
  return useQuery({
    queryKey: [ReportKeys.GetAllReportsQuery],
    queryFn: async ({ signal }) => {
      const response = await _request.get<ReportResponse>('/reports', {
        signal,
      });

      return response.data;
    },
  });
};

export const useGetReportByIdQuery = (reportId?: string) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [ReportKeys.GetAllReportsQuery, reportId],
    queryFn: async ({ signal }) => {
      const response = await _request.get<ReportResponse>(
        `/reports/forum-post/${reportId}`,
        {
          signal,
        },
      );
      return response.data;
    },
    enabled: !!reportId,
  });
};

export const useReviewPostReportMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (payload: {
      reportId: string;
      status: string;
      reviewNote: string;
    }) => {
      const { reportId, status, reviewNote } = payload;
      const response = await _request.put(`/reports/${reportId}/review`, {
        status,
        reviewNote,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};
