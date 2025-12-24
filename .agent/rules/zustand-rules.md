# Zustand State Management Rules

## Core Principles

- Keep stores **small and focused** (one store per feature/concern)
- **Export custom hooks** for state, not the store itself
- Use **atomic selectors** for performance
- **Define actions at module level** (external to store)

## Store Template (Recommended)

```typescript
import { create } from "zustand";

interface BearState {
  bears: number;
  fish: number;
}

// Store contains only state
const useBearStore = create<BearState>(() => ({
  bears: 0,
  fish: 0,
}));

// ✅ Actions defined at module level (no hook needed to call)
export const increasePopulation = (by: number) =>
  useBearStore.setState((state) => ({ bears: state.bears + by }));

export const eatFish = () =>
  useBearStore.setState((state) => ({ fish: state.fish - 1 }));

export const reset = () => useBearStore.setState({ bears: 0, fish: 0 });

// ✅ Export atomic selectors for state
export const useBears = () => useBearStore((state) => state.bears);
export const useFish = () => useBearStore((state) => state.fish);
```

**Advantages of module-level actions:**

- No hook needed to call an action
- Facilitates code splitting
- Can be called from anywhere (components, other stores, utils)

## ✅ Do's

```typescript
// Atomic selectors - subscribe to single values
export const useBears = () => useBearStore((state) => state.bears);

// Call actions directly (no hook needed)
increasePopulation(5);
eatFish();

// Model actions as events, not setters
export const addTodo = (text: string) => useTodoStore.setState(...);
export const toggleComplete = (id: string) => useTodoStore.setState(...);

// Combine with React Query
export const useFilteredTodos = () => {
  const filters = useAppliedFilters();
  return useQuery({
    queryKey: ['todos', filters],
    queryFn: () => getTodos(filters),
  });
};
```

## ❌ Don'ts

```typescript
// Don't export the store directly
export const useBearStore = create(...); // ❌

// Don't subscribe to entire store
const { bears } = useBearStore(); // ❌ Re-renders on ANY state change

// Don't return objects without shallow comparison
const { bears, fish } = useBearStore((state) => ({
  bears: state.bears,
  fish: state.fish,
})); // ❌ Creates new object every render
```

## Multi-value Selectors (if needed)

```typescript
import { shallow } from "zustand/shallow";

// Use shallow comparison for object selectors
const { bears, fish } = useBearStore(
  (state) => ({ bears: state.bears, fish: state.fish }),
  shallow // ✅ Prevents unnecessary re-renders
);

// Better: just use two separate hooks
const bears = useBears();
const fish = useFish();
```

## Combine Multiple Stores

```typescript
// Combine stores via custom hooks
export const useCurrentUserData = () => {
  const currentUserId = useAuthStore((state) => state.userId);
  const user = useUsersStore((state) => state.users[currentUserId]);
  return user;
};
```

## Alternative: Colocated Actions

If you prefer encapsulation, actions can live inside the store:

```typescript
const useBearStore = create<BearState>((set) => ({
  bears: 0,
  fish: 0,
  increasePopulation: (by) => set((state) => ({ bears: state.bears + by })),
  eatFish: () => set((state) => ({ fish: state.fish - 1 })),
}));
```

## Folder Structure

```
src/stores/
├── use-bear-store.ts
├── use-filter-store.ts
└── use-ui-store.ts

# Or inside features
src/features/matching/
├── stores/
│   └── use-match-store.ts
```
