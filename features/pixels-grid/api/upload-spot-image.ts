import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type {
  UploadSpotImageInput,
  UploadSpotImageResponse,
} from "../types/api";

// API Function
export const uploadSpotImageApi = (
  input: UploadSpotImageInput
): Promise<UploadSpotImageResponse> => {
  const formData = new FormData();
  formData.append("file", input.file);
  formData.append("spotId", input.spotId);

  return api.post<UploadSpotImageResponse>("/spots/upload", formData);
};

// React Mutation Hook
export const useUploadSpotImage = (
  config?: MutationConfig<typeof uploadSpotImageApi>
) => {
  return useMutation({
    mutationFn: uploadSpotImageApi,
    ...config,
  });
};
