import axios from "axios";
import { getApiUrl } from "./api.model";
import {
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
  saveRefreshToken,
} from "../util/token.util";

const api = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
});

api.interceptors.request.use(config => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // const res = await api?.post<{
        //   accessToken: string;
        //   refreshToken: string;
        // }>("/refresh", { refreshToken: getRefreshToken() });
        // const { accessToken, refreshToken } = res.data;
        // saveRefreshToken(refreshToken);
        // saveAccessToken(accessToken);
        // originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        // return api(originalRequest);
      } catch {
        window.location.href = "/login"; // redirect on refresh fail
      }
    }
    return Promise.reject(error);
  }
);

export default api;
