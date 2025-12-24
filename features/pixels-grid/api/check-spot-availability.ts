import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type {
  CheckSpotAvailabilityInput,
  CheckSpotAvailabilityResponse,
} from "../types/api";

// API Function
export const checkSpotAvailabilityApi = (
  input: CheckSpotAvailabilityInput
): Promise<CheckSpotAvailabilityResponse> => {
  return api.post<CheckSpotAvailabilityResponse>("/spots/check", input);
};

// React Mutation Hook
export const useCheckSpotAvailability = (
  config?: MutationConfig<typeof checkSpotAvailabilityApi>
) => {
  return useMutation({
    mutationFn: checkSpotAvailabilityApi,
    ...config,
  });
};
