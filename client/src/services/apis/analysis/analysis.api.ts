import { coreApi } from "@/services/config/apiBase";
import { HTTP_METHODS } from "@/common/constants/http-methods";
import { cacheTimings } from "@/common/constants/timings";
import { RuleResult } from "./rule.model";

const baseUrl = "analyze";

const analysisApi = coreApi
  .enhanceEndpoints({ addTagTypes: ["Analysis"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getRuleResults: builder.query<Record<string, RuleResult>, void>({
        query: () => ({
          url: `v1/${baseUrl}/rules`,
          method: HTTP_METHODS.GET,
        }),
        keepUnusedDataFor: cacheTimings.moderate,
        providesTags: ["Analysis"],
      }),
    }),
    overrideExisting: true,
  });

export { analysisApi };
export const { useGetRuleResultsQuery } = analysisApi;
