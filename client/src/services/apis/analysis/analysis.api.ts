import { coreApi } from "@/services/config/apiBase";
import { HTTP_METHODS } from "@/common/constants/http-methods";
import { cacheTimings } from "@/common/constants/timings";
import { RuleResult, RuleType } from "./rule.model";
import { Asset } from "../portfolio/portfolio.model";

const baseUrl = "analyze";

const analysisApi = coreApi
  .enhanceEndpoints({ addTagTypes: ["Analysis", "Assets"] })
  .injectEndpoints({
    endpoints: builder => ({
      getRuleResults: builder.query<Record<string, RuleResult>, void>({
        query: () => ({
          url: `v1/${baseUrl}/rules`,
          method: HTTP_METHODS.GET,
        }),
        keepUnusedDataFor: cacheTimings.moderate,
        providesTags: ["Analysis"],
      }),
      getPortfolioAssets: builder.query<Asset[], RuleType>({
        query: rule => ({
          url: `v1/${baseUrl}/rules/${rule}/assets`,
          method: HTTP_METHODS.GET,
        }),
        keepUnusedDataFor: cacheTimings.moderate,
        providesTags: ["Assets"],
      }),
    }),
    overrideExisting: true,
  });

export { analysisApi };
export const { useGetRuleResultsQuery, useGetPortfolioAssetsQuery } =
  analysisApi;
