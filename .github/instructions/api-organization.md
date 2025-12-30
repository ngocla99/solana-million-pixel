---
description: 'Guidelines for API organization and data fetching patterns'
applyTo: '**/api/*.ts, **/features/*/api/*.ts, **/*.api.ts'
---

# API Organization & Data Fetching Guide

You are an expert TypeScript developer specializing in modern API organization patterns with TanStack Query and feature-based architecture.

## Tech Stack
- TypeScript (strict mode)
- TanStack Query (server state management)
- Feature-based folder structure
- Zustand (client state)
- Zod (validation)
- Next.js API Routes

## Core Principles

- **One file per operation** - Separate by action: `get-user.ts`, `create-user.ts`, `update-user.ts`
- **File naming**: `[action]-[resource].ts` (e.g., `get-spots.ts`, `create-spot.ts`)
- **Feature isolation** - Each feature contains its own API, components, hooks, stores, and types
- **Type safety** - Always use proper TypeScript types and Zod validation

## Naming Conventions

| Type   | Function            | QueryOptions              | Hook                |
| ------ | ------------------- | ------------------------- | ------------------- |
| GET    | `getResourceApi`    | `getResourceQueryOptions` | `useResource`       |
| POST   | `createResourceApi` | N/A                       | `useCreateResource` |
| PATCH  | `updateResourceApi` | N/A                       | `useUpdateResource` |
| DELETE | `deleteResourceApi` | N/A                       | `useDeleteResource` |
| Custom | `checkSpotApi`      | N/A                       | `useCheckSpot`      |

**Key rules:**

- API functions always end with `Api` suffix
- Use `input` parameter name (not `params`) for consistency
- Always support `AbortSignal` in GET requests for cancellation
- Import types from feature's `types/api.ts` file

## GET Request Pattern

Use this pattern for all data fetching operations. Always include proper TypeScript types and error handling:

```typescript
import { queryOptions, useQuery } from "@tanstack/react-query";
import api from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { GetSpotsResponse, GetSpotsInput } from "../types/api";

// 1. API Function
export const getSpotsApi = async (
  input: GetSpotsInput = {},
  signal?: AbortSignal
): Promise<GetSpotsResponse> => {
  return api.get<GetSpotsResponse>("/spots", { 
    params: input, 
    signal 
  });
};

// 2. Query Options (for prefetching and SSR)
export const getSpotsQueryOptions = (input: GetSpotsInput = {}) => {
  return queryOptions({
    queryKey: ["pixels-grid", "spots", input],
    queryFn: ({ signal }) => getSpotsApi(input, signal),
  });
};

// 3. Hook Options Type
type UseSpotsOptions = {
  input?: GetSpotsInput;
  queryConfig?: QueryConfig<typeof getSpotsQueryOptions>;
};

// 4. React Query Hook
export const useSpots = ({ 
  input = {}, 
  queryConfig 
}: UseSpotsOptions = {}) => {
  return useQuery({
    ...getSpotsQueryOptions(input),
    ...queryConfig,
  });
};
```

## Mutation Pattern

Use this pattern for POST/PUT/DELETE operations with optimistic updates and cache management:

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { CreateSpotInput, SpotResponse } from "../types/api";

// API Function
export const createSpotApi = (
  input: CreateSpotInput
): Promise<SpotResponse> => {
  return api.post<SpotResponse>("/spots", input);
};

// React Mutation Hook
export const useCreateSpot = (
  config?: MutationConfig<typeof createSpotApi>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSpotApi,
    onSuccess: (data) => {
      // Update specific spot in cache
      queryClient.setQueryData(["pixels-grid", "spot", data.id], data);
      
      // Invalidate spots list to refetch
      queryClient.invalidateQueries({ 
        queryKey: ["pixels-grid", "spots"] 
      });
      
      // Update stats cache
      queryClient.invalidateQueries({ 
        queryKey: ["pixels-grid", "stats"] 
      });
    },
    ...config,
  });
};
```

## Query Key Structure

Use hierarchical query keys for optimal cache management and invalidation:

```typescript
// ✅ Good: Hierarchical structure
["pixels-grid", "spots"]                    // All spots
["pixels-grid", "spot", spotId]            // Single spot
["pixels-grid", "spots", { status: "sold" }] // Filtered spots
["pixels-grid", "stats"]                   // Grid statistics
["wallet", "connection"]                   // Wallet state

// ❌ Bad: Flat structure
["spots"]
["allSpots"] 
["spotData"]
```

## Cache Update Strategies

Choose the appropriate strategy based on your use case:

```typescript
// 1. Optimistic Updates (immediate UI feedback)
onMutate: async (newSpot) => {
  await queryClient.cancelQueries({ queryKey: ["pixels-grid", "spots"] });
  const previous = queryClient.getQueryData(["pixels-grid", "spots"]);
  
  queryClient.setQueryData(["pixels-grid", "spots"], (old) => 
    old ? [...old, { ...newSpot, id: Date.now() }] : [newSpot]
  );
  
  return { previous };
},
onError: (err, newSpot, context) => {
  queryClient.setQueryData(["pixels-grid", "spots"], context?.previous);
},

// 2. Simple Invalidation (refetch after success)
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["pixels-grid"] });
},

// 3. Direct Update + Selective Invalidation
onSuccess: (data, variables) => {
  queryClient.setQueryData(["pixels-grid", "spot", data.id], data);
  queryClient.invalidateQueries({ 
    queryKey: ["pixels-grid", "spots"],
    exact: false 
  });
},
```

## Conditional Queries

Handle dependent queries and conditional fetching properly:

```typescript
// Dependent Queries
const { data: user } = useUser({ userId });
const { data: spots } = useSpots({
  input: { ownerId: user?.id },
  queryConfig: { 
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  },
});

// Conditional with Custom Hook
export const useUserSpots = (userId: string | undefined) => {
  return useSpots({
    input: { ownerId: userId },
    queryConfig: {
      enabled: !!userId,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  });
};
```

## Type Safety & Validation

Always validate external data with Zod schemas and use proper TypeScript types:

```typescript
// features/pixels-grid/types/api.ts
import { z } from "zod";

export const spotSchema = z.object({
  id: z.string(),
  x: z.number().min(0).max(999),
  y: z.number().min(0).max(999),
  width: z.number().min(1).max(100),
  height: z.number().min(1).max(100),
  owner: z.string().optional(),
  image_url: z.string().url().optional(),
  price: z.number().positive(),
  status: z.enum(["available", "sold", "reserved"]),
});

export type Spot = z.infer<typeof spotSchema>;

export const getSpotsResponseSchema = z.object({
  spots: z.array(spotSchema),
  total: z.number(),
  page: z.number(),
});

export type GetSpotsResponse = z.infer<typeof getSpotsResponseSchema>;

export type GetSpotsInput = {
  page?: number;
  limit?: number;
  status?: "available" | "sold" | "reserved";
  owner?: string;
};

// Safe parsing in API functions
export const getSpotsApi = async (
  input: GetSpotsInput = {},
  signal?: AbortSignal
): Promise<GetSpotsResponse> => {
  const response = await api.get<unknown>("/spots", { params: input, signal });
  return getSpotsResponseSchema.parse(response);
};
```

## Feature-Based Organization

Organize API files within each feature for better maintainability:

```
features/pixels-grid/
├── api/
│   ├── get-spots.ts          # List spots
│   ├── get-spot.ts           # Single spot
│   ├── create-spot.ts        # Create new spot
│   ├── update-spot.ts        # Update spot
│   ├── check-spot-availability.ts  # Custom operations
│   └── upload-spot-image.ts
├── components/
├── hooks/
├── stores/
├── types/
│   └── api.ts               # All API types for this feature
└── utils/
```

## Import Standards

Use `@/` alias consistently for all internal imports:

```typescript
// ✅ Good
import api from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { GetSpotsInput } from "../types/api";

// ❌ Bad
import api from "../../../../lib/api-client";
import type { QueryConfig } from "../../lib/react-query";
```

## Error Handling

Implement proper error handling and user feedback:

```typescript
export const useCreateSpot = (config?: MutationConfig<typeof createSpotApi>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSpotApi,
    onSuccess: (data) => {
      toast.success("Spot created successfully!");
      queryClient.invalidateQueries({ queryKey: ["pixels-grid"] });
    },
    onError: (error) => {
      console.error("Failed to create spot:", error);
      toast.error("Failed to create spot. Please try again.");
    },
    ...config,
  });
};
```

## Common Patterns

Essential patterns for consistent API implementation:

```typescript
// Prefetching for better UX
const prefetchSpots = () => {
  queryClient.prefetchQuery(getSpotsQueryOptions());
};

// Background refetching
const { data: spots } = useSpots({
  queryConfig: {
    refetchInterval: 30000, // 30 seconds
    refetchIntervalInBackground: true,
  },
});

// Retry configuration
const { data: spot } = useSpot({
  input: { id: spotId },
  queryConfig: {
    retry: (failureCount, error) => {
      if (error.status === 404) return false; // Don't retry 404s
      return failureCount < 3;
    },
  },
});

// Optimistic updates for better UX
const updateSpotMutation = useUpdateSpot({
  onMutate: async (variables) => {
    await queryClient.cancelQueries({ 
      queryKey: ["pixels-grid", "spot", variables.id] 
    });
    
    const previousSpot = queryClient.getQueryData([
      "pixels-grid", "spot", variables.id
    ]);
    
    queryClient.setQueryData(
      ["pixels-grid", "spot", variables.id], 
      { ...previousSpot, ...variables }
    );
    
    return { previousSpot };
  },
});
```

## Implementation Checklist

**GET Requests:**

- [ ] File name follows `get-[resource].ts` pattern
- [ ] API function has `Api` suffix
- [ ] Export `QueryOptions` function for prefetching/SSR
- [ ] Include `AbortSignal` support for cancellation
- [ ] Use hierarchical query keys
- [ ] Input types properly defined
- [ ] Zod schema validation for response
- [ ] Error handling implemented

**Mutations:**

- [ ] File name follows `[action]-[resource].ts` pattern
- [ ] API function has `Api` suffix
- [ ] Cache invalidation in `onSuccess`
- [ ] Input type exported and validated
- [ ] Error handling with user feedback
- [ ] Optimistic updates where appropriate
- [ ] Loading states handled properly

**Feature Organization:**

- [ ] API files in `features/[feature]/api/` directory
- [ ] Types defined in `features/[feature]/types/api.ts`
- [ ] Consistent import paths using `@/` alias
- [ ] One file per operation
- [ ] Proper TypeScript strict mode compliance

## Best Practices to Avoid

```typescript
// ❌ Don't mix operations in one file
// bad: user-api.ts with get, create, update, delete

// ❌ Don't use flat query keys
queryKey: ["data"]
queryKey: ["users"] 

// ❌ Don't forget Api suffix
export const getSpots = async () => {} // Should be getSpotsApi

// ❌ Don't use 'params' parameter name
export const getSpotsApi = async (params: GetSpotsInput) => {} // Use 'input'

// ❌ Don't skip AbortSignal in GET requests
export const getSpotsApi = async (input: GetSpotsInput) => {} // Missing signal

// ❌ Don't inline type definitions
export const useSpots = (filters: { status: string }) => {} // Define proper types

// ❌ Don't forget cache invalidation
onSuccess: (data) => {
  // Missing cache updates
}

// ✅ Do use proper patterns
export const getSpotsApi = async (
  input: GetSpotsInput, 
  signal?: AbortSignal
): Promise<GetSpotsResponse> => {
  const response = await api.get<unknown>("/spots", { params: input, signal });
  return getSpotsResponseSchema.parse(response);
};
```

This guide ensures consistent, type-safe, and maintainable API organization across your application while following modern React and TypeScript best practices.
