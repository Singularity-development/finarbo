import { coreApi } from "@/services/config/apiBase";
import { HTTP_METHODS } from "@/common/constants/http-methods";
import { cacheTimings } from "@/common/constants/timings";

export type Profile = {
  username: string;
  email: string;
  roles: string[];
  emailVerified: boolean;
  avatarUrl?: string;
};

const authApi = coreApi
  .enhanceEndpoints({ addTagTypes: ["User"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      signIn: builder.mutation<
        { accessToken: string; refreshToken: string },
        { login: string; password: string }
      >({
        query: (data) => ({
          url: `signin`,
          method: HTTP_METHODS.POST,
          data,
        }),
        invalidatesTags: ["User"],
      }),
      signUp: builder.mutation<
        void,
        { email: string; username: string; password: string }
      >({
        query: (data) => ({
          url: `signup`,
          method: HTTP_METHODS.POST,
          data,
        }),
      }),
      logout: builder.mutation<void, void>({
        query: () => ({
          url: `logout`,
          method: HTTP_METHODS.POST,
        }),
        invalidatesTags: ["User"],
      }),
      getProfile: builder.query<Profile, void>({
        query: () => ({
          url: `profile`,
          method: HTTP_METHODS.GET,
        }),
        keepUnusedDataFor: cacheTimings.moderate,
        providesTags: ["User"],
      }),
    }),
    overrideExisting: true,
  });

export { authApi };
export const {
  useSignInMutation,
  useSignUpMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useLazyGetProfileQuery,
} = authApi;
