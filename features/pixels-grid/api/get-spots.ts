import { queryOptions, useQuery } from "@tanstack/react-query";
import api from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { GetSpotsResponse } from "../types/api";

// API Function
export const getSpotsApi = async (
  signal?: AbortSignal
): Promise<GetSpotsResponse> => {
  return api.get<GetSpotsResponse>("/spots", { signal });
};

// Query Options
export const getSpotsQueryOptions = () => {
  return queryOptions({
    queryKey: ["pixels-grid", "spots"],
    queryFn: ({ signal }) => getSpotsApi(signal),
  });
};

// Hook Options Type
type UseSpotsOptions = {
  queryConfig?: QueryConfig<typeof getSpotsQueryOptions>;
};

// React Query Hook
export const useSpots = ({ queryConfig }: UseSpotsOptions = {}) => {
  return useQuery({
    ...getSpotsQueryOptions(),
    ...queryConfig,
  });
};
