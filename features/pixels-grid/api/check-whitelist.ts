import { queryOptions, useQuery } from "@tanstack/react-query";
import api from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { CheckWhitelistInput, CheckWhitelistResponse } from "../types/api";

// API Function
export const checkWhitelistApi = async (
  input: CheckWhitelistInput,
  signal?: AbortSignal
): Promise<CheckWhitelistResponse> => {
  return api.get<CheckWhitelistResponse>("/whitelist/check", {
    params: input,
    signal,
  });
};

// Query Options
export const checkWhitelistQueryOptions = (input: CheckWhitelistInput) => {
  return queryOptions({
    queryKey: ["pixels-grid", "whitelist", input.wallet],
    queryFn: ({ signal }) => checkWhitelistApi(input, signal),
    enabled: !!input.wallet,
  });
};

// Hook Options Type
type UseCheckWhitelistOptions = {
  input: CheckWhitelistInput;
  queryConfig?: QueryConfig<typeof checkWhitelistQueryOptions>;
};

// React Query Hook
export const useCheckWhitelist = ({
  input,
  queryConfig,
}: UseCheckWhitelistOptions) => {
  return useQuery({
    ...checkWhitelistQueryOptions(input),
    ...queryConfig,
  });
};
