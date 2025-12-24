---
trigger: always_on
---

# API Organization Rules

## Core Principles

- **One file per operation** - Separate by action: `get-user.ts`, `create-user.ts`, `update-user.ts`
- **File naming**: `[action]-[resource].ts` (e.g., `get-baby.ts`, `generate-baby.ts`)

## Naming Conventions

| Type   | Function            | QueryOptions              | Hook                |
| ------ | ------------------- | ------------------------- | ------------------- |
| GET    | `getResourceApi`    | `getResourceQueryOptions` | `useResource`       |
| POST   | `createResourceApi` | N/A                       | `useCreateResource` |
| PATCH  | `updateResourceApi` | N/A                       | `useUpdateResource` |
| DELETE | `deleteResourceApi` | N/A                       | `useDeleteResource` |
| Custom | `generateBabyApi`   | N/A                       | `useGenerateBaby`   |

**Key rules:**

- API functions end with `Api` suffix
- Use `input` (not `params`) for parameters
- Always support `AbortSignal` in GET requests

## GET Template

```typescript
import { queryOptions, useQuery } from "@tanstack/react-query";
import api from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { ResourceApi, GetResourceInput } from "../types";

// 1. API Function
export const getResourceApi = async (
  input: GetResourceInput,
  signal?: AbortSignal
): Promise<ResourceApi> => {
  return api.get<ResourceApi>("/resource", { params: input, signal });
};

// 2. Query Options
export const getResourceQueryOptions = (input: GetResourceInput) => {
  return queryOptions({
    queryKey: ["resource", input],
    queryFn: ({ signal }) => getResourceApi(input, signal),
    enabled: !!input.id,
  });
};

// 3. Hook Options Type
type UseResourceOptions = {
  input: GetResourceInput;
  queryConfig?: QueryConfig<typeof getResourceQueryOptions>;
};

// 4. React Query Hook
export const useResource = ({ input, queryConfig }: UseResourceOptions) => {
  return useQuery({
    ...getResourceQueryOptions(input),
    ...queryConfig,
  });
};
```

## Mutation Template

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";

export type CreateResourceInput = { name: string };

// API Function
export const createResourceApi = (
  input: CreateResourceInput
): Promise<ResourceApi> => {
  return api.post<ResourceApi>("/resource", input);
};

// React Mutation Hook
export const useCreateResource = (
  config?: MutationConfig<typeof createResourceApi>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createResourceApi,
    onSuccess: (data) => {
      queryClient.setQueryData(["resource", data.id], data);
      queryClient.invalidateQueries({ queryKey: ["resource", "list"] });
    },
    ...config,
  });
};
```

## Query Keys

Pattern: `[domain, subdomain?, ...identifiers, ...filters]`

```typescript
// ✅ Good
["matching", "top", "infinite"][("baby", "match", matchId)][
  ("baby", "list", { userId, skip, limit })
][
  // ❌ Bad
  "matches"
]["baby"];
```

## Cache Update Strategies

```typescript
// 1. Optimistic Updates
onMutate: async (newData) => {
  await queryClient.cancelQueries({ queryKey: ["resource", id] });
  const previous = queryClient.getQueryData(["resource", id]);
  queryClient.setQueryData(["resource", id], newData);
  return { previous };
},
onError: (err, _, context) => {
  queryClient.setQueryData(["resource", id], context.previous);
},

// 2. Simple Invalidation
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["resource"] });
},

// 3. Direct Update + Invalidate List
onSuccess: (data, id) => {
  queryClient.setQueryData(["resource", id], data);
  queryClient.invalidateQueries({ queryKey: ["resource", "list"] });
},
```

## Infinite Query

```typescript
export const useResourceInfinite = ({ input, queryConfig }) => {
  return useInfiniteQuery({
    queryKey: ["resource", "infinite"],
    queryFn: ({ pageParam = 0, signal }) =>
      getResourceApi({ ...input, skip: pageParam, signal }),
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPage.length === 0 ? undefined : lastPageParam + input.limit,
    initialPageParam: 0,
    ...queryConfig,
  });
};
```

## Type Safety

```typescript
// ✅ Define explicit input types
export type GetResourceInput = {
  id: string;
  filters?: { status: "active" | "inactive"; limit: number };
};

// ✅ Import from central location
import type { BabyApi, UserApi } from "@/types/api";
```

## Folder Structure

```
src/features/[feature]/api/
├── get-[resource].ts
├── get-[resource]-list.ts
├── create-[resource].ts
├── update-[resource].ts
├── delete-[resource].ts
└── [custom-action].ts
```

## Common Patterns

```typescript
// Conditional Query
const { data } = useResource({
  input: { id: userId },
  queryConfig: { enabled: !!userId },
});

// Dependent Queries
const { data: user } = useUser({ userId });
const { data: matches } = useMatches({
  input: { userId: user?.id },
  queryConfig: { enabled: !!user?.id },
});

// Prefetching
const prefetch = () => {
  queryClient.prefetchQuery(getResourceQueryOptions(id));
};
```

## Checklist

**GET Requests:**

- [ ] File: `get-[resource].ts`
- [ ] API function with `Api` suffix
- [ ] Export QueryOptions
- [ ] AbortSignal support
- [ ] Hierarchical query key

**Mutations:**

- [ ] File: `[action]-[resource].ts`
- [ ] API function with `Api` suffix
- [ ] Cache invalidation in `onSuccess`
- [ ] Export input type

## ❌ Avoid

- Mixing operations in one file
- Flat query keys: `["data"]`
- Missing `Api` suffix
- Using `params` instead of `input`
- Forgetting AbortSignal in GET
- Inline type definitions
- Missing cache invalidation
