---
description: 'Guidelines for efficient client-side state management with Zustand'
applyTo: '**/stores/*.ts, **/use-*-store.ts, **/state/*.ts'
---

# Zustand State Management Guide

You are an expert TypeScript developer specializing in efficient client-side state management patterns with Zustand and modern React applications.

## Tech Stack
- TypeScript (strict mode)
- Zustand (client state management)
- React 18+ (concurrent features)
- Feature-based architecture
- TanStack Query (server state separation)

## Core Principles

- **Small and focused stores** - One store per feature or concern for maintainability
- **Module-level actions** - Actions defined outside the store for better code splitting
- **Atomic selectors** - Subscribe to specific values to minimize re-renders
- **Type safety** - Leverage TypeScript for compile-time guarantees
- **Clear separation** - Client state (Zustand) vs server state (TanStack Query)

## Store Architecture Pattern

Follow this pattern for consistent, maintainable Zustand stores across your application:

```typescript
// features/pixels-grid/stores/use-grid-store.ts
import { create } from "zustand";

// State interface with clear typing
interface GridState {
  blockSize: "1x1" | "2x2" | "4x4" | "8x8" | "16x16";
  selection: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  isGridLoaded: boolean;
  zoomLevel: number;
}

// Store contains only state (no actions)
const useGridStore = create<GridState>(() => ({
  blockSize: "1x1",
  selection: null,
  isGridLoaded: false,
  zoomLevel: 1,
}));

// ✅ Module-level actions (callable from anywhere)
export const setBlockSize = (blockSize: GridState["blockSize"]) =>
  useGridStore.setState({ blockSize });

export const setSelection = (selection: GridState["selection"]) =>
  useGridStore.setState({ selection });

export const clearSelection = () => 
  useGridStore.setState({ selection: null });

export const setGridLoaded = (isLoaded: boolean) =>
  useGridStore.setState({ isGridLoaded: isLoaded });

export const updateZoom = (delta: number) =>
  useGridStore.setState((state) => ({ 
    zoomLevel: Math.max(0.1, Math.min(5, state.zoomLevel + delta))
  }));

export const resetGrid = () =>
  useGridStore.setState({
    blockSize: "1x1",
    selection: null,
    zoomLevel: 1,
  });

// ✅ Atomic selectors for performance
export const useBlockSize = () => useGridStore((state) => state.blockSize);
export const useSelection = () => useGridStore((state) => state.selection);
export const useIsGridLoaded = () => useGridStore((state) => state.isGridLoaded);
export const useZoomLevel = () => useGridStore((state) => state.zoomLevel);
```

### Benefits of Module-Level Actions:

- **No hook dependency** - Actions can be called from anywhere
- **Better code splitting** - Actions can be imported separately
- **Event-driven design** - Actions represent user intent, not just setters
- **Easier testing** - Actions can be tested independently
- **Type safety** - Full TypeScript support with inference

## Usage in Components

### Basic Component Integration

```typescript
// features/pixels-grid/components/grid-controls.tsx
"use client";
import { 
  useBlockSize, 
  useSelection, 
  setBlockSize, 
  clearSelection 
} from "../stores/use-grid-store";

export function GridControls() {
  const blockSize = useBlockSize();
  const selection = useSelection();

  const handleBlockSizeChange = (size: "1x1" | "2x2" | "4x4") => {
    setBlockSize(size);
    clearSelection(); // Clear selection when changing size
  };

  return (
    <div className="space-y-4">
      <select 
        value={blockSize} 
        onChange={(e) => handleBlockSizeChange(e.target.value as any)}
      >
        <option value="1x1">1x1 Pixel</option>
        <option value="2x2">2x2 Pixels</option>
        <option value="4x4">4x4 Pixels</option>
      </select>
      
      {selection && (
        <div>
          Selected: {selection.width}x{selection.height} at 
          ({selection.x}, {selection.y})
          <button onClick={clearSelection}>Clear</button>
        </div>
      )}
    </div>
  );
}
```

### Advanced Component Patterns

```typescript
// Custom hooks for computed values
export const useSelectedPixelCount = () => {
  return useGridStore((state) => {
    if (!state.selection) return 0;
    return state.selection.width * state.selection.height;
  });
};

export const useIsSelectionValid = () => {
  return useGridStore((state) => {
    if (!state.selection) return false;
    return state.selection.width > 0 && state.selection.height > 0;
  });
};

// Component using computed values
export function SelectionInfo() {
  const pixelCount = useSelectedPixelCount();
  const isValid = useIsSelectionValid();
  
  if (!isValid) return null;
  
  return (
    <div className="text-sm text-gray-600">
      Selected {pixelCount} pixels
    </div>
  );
}
```

## Performance Optimization

### Atomic Selectors (Recommended)

```typescript
// ✅ Atomic selectors prevent unnecessary re-renders
export const useBlockSize = () => useGridStore((state) => state.blockSize);
export const useSelection = () => useGridStore((state) => state.selection);
export const useZoomLevel = () => useGridStore((state) => state.zoomLevel);

// Component only re-renders when blockSize changes
function BlockSizeDisplay() {
  const blockSize = useBlockSize(); // Won't re-render on zoom/selection changes
  return <span>Block: {blockSize}</span>;
}
```

### Multi-Value Selectors (When Necessary)

```typescript
import { shallow } from "zustand/shallow";

// ✅ Use shallow comparison for object selectors
export const useGridDimensions = () =>
  useGridStore(
    (state) => ({ 
      width: state.selection?.width || 0,
      height: state.selection?.height || 0 
    }),
    shallow // Prevents re-render if values haven't changed
  );

// ✅ Alternative: Custom equality function
export const useGridPosition = () =>
  useGridStore(
    (state) => ({ x: state.selection?.x || 0, y: state.selection?.y || 0 }),
    (a, b) => a.x === b.x && a.y === b.y
  );

// ⚠️ Better: Use separate atomic selectors
const useSelectionX = () => useGridStore((state) => state.selection?.x || 0);
const useSelectionY = () => useGridStore((state) => state.selection?.y || 0);
```

### Performance Anti-Patterns

```typescript
// ❌ Don't subscribe to entire store
function BadComponent() {
  const state = useGridStore(); // Re-renders on ANY state change!
  return <div>{state.blockSize}</div>;
}

// ❌ Don't create objects in selectors without comparison
const badSelector = useGridStore((state) => ({
  x: state.selection?.x,
  y: state.selection?.y
})); // Creates new object every render

// ❌ Don't export the store directly
export { useGridStore }; // Should not be used directly
```

## Integration with Server State

Combine Zustand (client state) with TanStack Query (server state) effectively:

```typescript
// features/pixels-grid/hooks/use-grid-interactions.ts
import { useSpots, useCreateSpot } from "../api/get-spots";
import { useSelection, clearSelection } from "../stores/use-grid-store";

export function useGridInteractions() {
  const selection = useSelection();
  const { data: spots } = useSpots();
  const createSpotMutation = useCreateSpot();

  const purchaseSelection = async (imageFile: File) => {
    if (!selection) return;
    
    try {
      await createSpotMutation.mutateAsync({
        x: selection.x,
        y: selection.y,
        width: selection.width,
        height: selection.height,
        image: imageFile,
      });
      
      clearSelection(); // Clear client state after successful server action
    } catch (error) {
      console.error("Failed to purchase spot:", error);
    }
  };

  return {
    selection,
    spots,
    purchaseSelection,
    isPurchasing: createSpotMutation.isPending,
  };
}
```

## Complex State Patterns

### Derived State with Selectors

```typescript
// Computed values that depend on multiple state pieces
export const useAvailableSpots = () => {
  return useGridStore((state) => {
    if (!state.selection) return [];
    
    // Calculate available spots based on current selection
    const spots = [];
    for (let x = state.selection.x; x < state.selection.x + state.selection.width; x++) {
      for (let y = state.selection.y; y < state.selection.y + state.selection.height; y++) {
        spots.push({ x, y });
      }
    }
    return spots;
  });
};

// Memoized selectors for expensive computations
export const useGridMetrics = () => {
  return useGridStore((state) => {
    const totalPixels = 1000 * 1000; // 1M pixels
    const selectedPixels = state.selection 
      ? state.selection.width * state.selection.height 
      : 0;
    
    return {
      totalPixels,
      selectedPixels,
      selectionPercentage: (selectedPixels / totalPixels) * 100,
    };
  }, shallow);
};
```

## Best Practices Summary

### Action Design Patterns

```typescript
// ✅ Model actions as events, not setters
export const selectGridArea = (area: { x: number; y: number; width: number; height: number }) =>
  useGridStore.setState({ selection: area });

export const dragSelection = (deltaX: number, deltaY: number) =>
  useGridStore.setState((state) => ({
    selection: state.selection ? {
      ...state.selection,
      x: state.selection.x + deltaX,
      y: state.selection.y + deltaY,
    } : null,
  }));

// ✅ Use atomic selectors for performance
export const useBlockSize = () => useGridStore((state) => state.blockSize);
export const useSelection = () => useGridStore((state) => state.selection);

// ✅ Combine with React Query for server state
export const useGridWithSpots = () => {
  const selection = useSelection();
  const { data: spots } = useSpots();
  
  return { selection, spots };
};

// ✅ Create derived selectors for computed values
export const useSelectionArea = () => {
  return useGridStore((state) => {
    if (!state.selection) return 0;
    return state.selection.width * state.selection.height;
  });
};
```

### State Structure Guidelines

```typescript
// ✅ Keep state flat and normalized
interface GridState {
  blockSize: BlockSize;
  selection: Selection | null;
  isGridLoaded: boolean;
  zoomLevel: number;
}

// ❌ Avoid nested state when possible
interface BadGridState {
  ui: {
    blockSize: BlockSize;
    zoom: {
      level: number;
      center: { x: number; y: number };
    };
  };
  data: {
    selection: Selection | null;
  };
}
```

## Implementation Checklist

**Store Creation:**
- [ ] Interface defined with proper TypeScript types
- [ ] Store created with initial state only
- [ ] Actions defined at module level (outside store)
- [ ] Atomic selectors exported for each state property
- [ ] Store not exported directly

**Performance:**
- [ ] Using atomic selectors instead of full store subscription
- [ ] Shallow comparison for multi-value selectors
- [ ] Avoiding object creation in selectors
- [ ] Derived state computed in selectors, not stored

**Integration:**
- [ ] Clear separation between client state (Zustand) and server state (TanStack Query)
- [ ] Actions callable from anywhere without hooks
- [ ] Custom hooks for common state combinations
- [ ] Proper TypeScript inference throughout

**Testing:**
- [ ] Actions tested independently
- [ ] Selectors tested with renderHook
- [ ] Mock implementations for component tests
- [ ] Integration tests for complex state interactions

## Common Anti-Patterns to Avoid

```typescript
// ❌ Don't export the store directly
export const useGridStore = create(...); // Allows bypassing selectors

// ❌ Don't subscribe to entire state
function Component() {
  const state = useGridStore(); // Re-renders on any state change
  return <div>{state.blockSize}</div>;
}

// ❌ Don't create objects in selectors without shallow comparison
const position = useGridStore((state) => ({
  x: state.selection?.x || 0,
  y: state.selection?.y || 0,
})); // New object every render

// ❌ Don't put server state in Zustand
interface BadState {
  spots: Spot[];        // Should use TanStack Query
  isLoading: boolean;   // Should use TanStack Query
  selection: Selection; // ✅ This is client state
}

// ❌ Don't make actions hooks
export const useSetBlockSize = () => {
  return useCallback((size: BlockSize) => {
    useGridStore.setState({ blockSize: size });
  }, []);
}; // Just export the action directly

// ✅ Correct patterns
export const setBlockSize = (blockSize: BlockSize) =>
  useGridStore.setState({ blockSize });

export const useBlockSize = () => useGridStore((state) => state.blockSize);

export const useGridSelection = () => {
  const selection = useSelection();
  const { data: spots } = useSpots(); // Server state via React Query
  
  return { selection, spots };
};
```

This comprehensive guide ensures efficient, maintainable, and performant client state management across your Solana Million Pixel application using modern Zustand patterns.
