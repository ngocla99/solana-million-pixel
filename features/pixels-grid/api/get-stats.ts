import { queryOptions, useQuery } from "@tanstack/react-query";
import api from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { GetStatsResponse } from "../types/api";

/**
 * API function to fetch grid statistics
 */
export const getStatsApi = async (
  signal?: AbortSignal
): Promise<GetStatsResponse> => {
  return api.get<GetStatsResponse>("/spots/stats", { signal });
};

/**
 * Query options for grid statistics
 */
export const getStatsQueryOptions = () => {
  return queryOptions({
    queryKey: ["pixels-grid", "stats"],
    queryFn: ({ signal }) => getStatsApi(signal),
    staleTime: 30000, // 30 seconds cache
  });
};

/**
 * Hook options type
 */
type UseStatsOptions = {
  queryConfig?: QueryConfig<typeof getStatsQueryOptions>;
};

/**
 * React Query hook to fetch grid statistics
 */
export const useStats = ({ queryConfig }: UseStatsOptions = {}) => {
  return useQuery({
    ...getStatsQueryOptions(),
    ...queryConfig,
  });
};
