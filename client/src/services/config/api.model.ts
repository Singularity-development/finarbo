import { AxiosRequestConfig, AxiosResponse, AxiosResponseHeaders } from "axios";
import { BaseQueryFn } from "@reduxjs/toolkit/query";

export const getApiUrl = () => {
  const coreBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
  return `${coreBaseUrl}/api/`;
};

export type AxiosRequestMeta = Pick<AxiosResponse, "headers" | "status">;

export type AxiosFetchArgs = {
  url: string;
  method: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
};

export type CustomBaseQueryFnType<T> = BaseQueryFn<
  AxiosFetchArgs,
  unknown,
  T,
  unknown,
  AxiosRequestMeta
>;

export type CustomError = {
  status?: number;
  data?: AxiosResponse | string;
  headers: AxiosResponseHeaders;
};
