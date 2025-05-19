/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
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

type ErrorPayload = {
  message: string;
  path: string;
  statusCode: number;
  timestamp: string;
  code?: string;
};

export type CustomError = AxiosError<ErrorPayload>;

export function isCustomError(error: unknown): error is CustomError {
  if (typeof error !== "object" || error === null) return false;

  // Check if error looks like AxiosError (basic shape check)
  const err = error as AxiosError;

  if (typeof err.isAxiosError !== "boolean" || !err.isAxiosError) return false;

  // Check response and data presence
  if (!err.response || typeof err.response !== "object") return false;

  const data = err.response.data;

  if (
    typeof data !== "object" ||
    data === null ||
    typeof (data as any).message !== "string" ||
    typeof (data as any).path !== "string" ||
    typeof (data as any).statusCode !== "number" ||
    typeof (data as any).timestamp !== "string"
  ) {
    return false;
  }

  return true;
}
