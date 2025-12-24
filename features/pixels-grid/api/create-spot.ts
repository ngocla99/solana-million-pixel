import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { CreateSpotInput, CreateSpotResponse } from "../types/api";

// API Function
export const createSpotApi = (
  input: CreateSpotInput
): Promise<CreateSpotResponse> => {
  return api.post<CreateSpotResponse>("/spots", input);
};

// React Mutation Hook
export const useCreateSpot = (
  config?: MutationConfig<typeof createSpotApi>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSpotApi,
    onSuccess: (data) => {
      // Invalidate spots list to refetch
      queryClient.invalidateQueries({ queryKey: ["pixels-grid", "spots"] });
    },
    ...config,
  });
};
