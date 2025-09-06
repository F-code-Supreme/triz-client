import type { AxiosRequestConfig } from 'axios';

export const axiosBaseOptions: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  timeout: 8000,
};
