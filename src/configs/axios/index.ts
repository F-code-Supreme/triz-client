import axios from 'axios';

import {
  axiosBaseOptions,
  axiosV2BaseOptions,
} from '@/configs/axios/axios-setup';
import { setupTokenRefreshInterceptor } from '@/configs/axios/token-refresh-interceptor';
import { TokenManager } from '@/utils/token/token-manager';

import i18n from '../i18next';

import type {
  AxiosDownload,
  Upload,
  UrlDownload,
  UploadStream,
} from '@/configs/axios/types';
import type { Response } from '@/types';
import type { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

function analysisFilename(contentDisposition: string): string {
  let regex = /filename\*=\S+?''(.+?)(;|$)/;
  if (regex.test(contentDisposition)) {
    return RegExp.$1;
  }
  regex = /filename="{0,1}([\S\s]+?)"{0,1}(;|$)/;
  if (regex.test(contentDisposition)) {
    return RegExp.$1;
  }
  return 'File_name_error';
}

class MyAxios {
  private readonly axiosInstance: AxiosInstance;
  private readonly auth: boolean;
  constructor(options: AxiosRequestConfig, auth = false) {
    this.axiosInstance = axios.create(options);
    this.auth = auth;
    this.initInterceptors();
    // Setup token refresh interceptor for authenticated requests
    if (auth) {
      setupTokenRefreshInterceptor(this.axiosInstance);
    }
  }

  private initInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.auth) {
          const token = TokenManager.getAccessToken();
          if (token) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            config.headers['Authorization'] = `Bearer ${token}`;
          }
        }
        config.headers['Accept-Language'] = i18n.language || 'vi';
        // console.log(`Request config:`, config);
        return config;
      },
      (error) => {
        console.error(`Request error:`, error);
        return Promise.reject(error);
      },
    );

    this.axiosInstance.interceptors.response.use(
      (response) => {
        const { data } = response;
        // console.log('data', data);
        if (data.code !== 200 && data.code !== 201) {
          throw new Error(data.message);
        }
        if (data instanceof Blob) {
          return response;
        } else {
          return data;
        }
      },
      (error: AxiosError) => {
        console.log(
          'An error occurred in the axios response interception. The error message is:',
          error,
        );

        //需要对错误进行提示？
        //以下Message是ElementUI库的全局提示组件 当然我们可以更改
        //若ElementUI 需要在头部引入   import { Message } from 'element-ui';
        /*    if(error?.response){
              switch (error.response.status){
                  case 400:
                      Message.error('请求错误');
                      break;
                  case 401:
                      Message.error('未授权访问');
                      break;
                  case 404:
                      Message.error('资源未找到');
                      break;
                  default:
                      Message.error('其他错误信息');
              }
          }*/

        return Promise.reject(error);
      },
    );
  }

  get<T = null>(
    url: string,
    data?: {
      params?: object;
      signal?: AbortSignal;
    },
  ): Promise<Response<T>> {
    const { params, signal } = data || {};
    return this.axiosInstance.get(url, { params, signal });
  }

  post<T = null>(
    url: string,
    data?: object,
    params?: object,
    signal?: AbortSignal,
  ): Promise<Response<T>> {
    return this.axiosInstance.post(url, data, { params, signal });
  }

  put<T = null>(
    url: string,
    data?: object,
    parameters?: object,
  ): Promise<Response<T>> {
    return this.axiosInstance.put(url, data, { params: parameters });
  }

  patch<T = null>(
    url: string,
    data?: object,
    parameters?: object,
  ): Promise<Response<T>> {
    return this.axiosInstance.patch(url, data, { params: parameters });
  }

  delete<T = null>(url: string, data?: object): Promise<Response<T>> {
    return this.axiosInstance.delete(url, { params: data });
  }

  upload<T = null>(data: Upload): Promise<Response<T>> {
    const { url, formData, controller, onUploadProgress } = data;
    return this.axiosInstance.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
      signal: controller ? controller.signal : undefined,
    });
  }

  async uploadStream<T = null>(data: UploadStream): Promise<Response<T>> {
    const { url, file, controller, onUploadProgress } = data;
    /** generateSHA 生成文件SHA256 hash  用于标识文件唯一性 往往会用上 这里会用到crypto-js库 **/
    // async function generateSHA(file: File): Promise<string> {
    //   const wordArray = CryptoJs.lib.WordArray.create(await file.arrayBuffer())
    //   const sha256 = CryptoJs.SHA256(wordArray)
    //   //转16进制
    //   return sha256.toString()
    // }
    // const Hash = await generateSHA(File)
    const fileArrayBuffer = await file.arrayBuffer();
    return this.axiosInstance.post(url, fileArrayBuffer, {
      headers: { 'Content-Type': 'application/octet-stream' },
      onUploadProgress,
      signal: controller ? controller.signal : undefined,
    });
  }

  axiosDownload(parameters: AxiosDownload): Promise<{ fileName: string }> {
    const { url, data, controller, fileName, onDownloadProgress } = parameters;
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .get<Blob>(url, {
          params: data,
          responseType: 'blob',
          onDownloadProgress,
          signal: controller ? controller.signal : undefined,
        })
        .then((res) => {
          const blob = new Blob([res.data]);
          const a = document.createElement('a');
          a.style.display = 'none';
          if (fileName) {
            a.download = fileName;
          } else {
            a.download = decodeURIComponent(
              analysisFilename(res.headers['content-disposition']),
            );
          }
          a.href = URL.createObjectURL(blob);
          document.body.appendChild(a);
          const downloadFileName = a.download;
          a.click();
          URL.revokeObjectURL(a.href);
          document.body.removeChild(a);
          resolve({ fileName: downloadFileName });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  urlDownload(parameters: UrlDownload) {
    const {
      fileName,
      serveBaseUrl = import.meta.env.VITE_API_SERVER_URL,
      fileUrl,
    } = parameters;
    const a = document.createElement('a');
    a.style.display = 'none';
    a.download = fileName;
    a.href = fileUrl.startsWith('http') ? fileUrl : `${serveBaseUrl}${fileUrl}`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(a.href);
    document.body.removeChild(a);
  }
}

export const request = new MyAxios(axiosBaseOptions);

export const useAxios = () => new MyAxios(axiosBaseOptions, true);
export const useAxiosV2 = () => new MyAxios(axiosV2BaseOptions, true);
