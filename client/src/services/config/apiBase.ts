import { createApi } from "@reduxjs/toolkit/query/react";
import type { AxiosError, AxiosRequestConfig } from "axios";
import {
  AxiosRequestMeta,
  CustomBaseQueryFnType,
  CustomError,
  getApiUrl,
} from "./api.model";
import api from "./axiosIntance";

const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string | (() => string) } = { baseUrl: "" }
  ): CustomBaseQueryFnType<CustomError> =>
  async ({ url, method, data, params, headers }: AxiosRequestConfig) => {
    try {
      const baseUrlStr = typeof baseUrl === "string" ? baseUrl : baseUrl();
      const { data: resp, ...other } = await api({
        url: baseUrlStr + url,
        method,
        data,
        params,
        headers,
      });
      return {
        data: resp,
        meta: {
          headers: other.headers,
          status: other.status,
        } as AxiosRequestMeta,
      };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
          headers: err.response?.headers,
        } as CustomError,
      };
    }
  };

export const coreApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({ baseUrl: getApiUrl }),
  endpoints: () => ({}),
});
