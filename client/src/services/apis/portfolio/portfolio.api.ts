import { coreApi } from "@/services/config/apiBase";
import { HTTP_METHODS } from "@/common/constants/http-methods";
import { cacheTimings } from "@/common/constants/timings";
import { Portfolio, PortfolioCurrency } from "./portfolio.model";

const baseUrl = "portfolio";

const portfolioApi = coreApi
  .enhanceEndpoints({ addTagTypes: ["Portfolio"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getPortfolio: builder.query<Portfolio, PortfolioCurrency | undefined>({
        query: (currency) => ({
          url: `v1/${baseUrl}`,
          method: HTTP_METHODS.GET,
          params: { portfolioCurrency: currency },
        }),
        keepUnusedDataFor: cacheTimings.moderate,
        providesTags: ["Portfolio"],
      }),
    }),
    overrideExisting: true,
  });

export { portfolioApi };
export const { useGetPortfolioQuery } = portfolioApi;
