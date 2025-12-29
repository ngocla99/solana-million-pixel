import { create } from "zustand";

// Block size options
export type BlockSize = "1x1" | "2x2" | "5x5";

// Selection interface
export interface Selection {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface GridState {
  blockSize: BlockSize;
  selection: Selection | null;
  isChecking: boolean;
  isAvailable: boolean;
}

// Store contains only state
const useGridStore = create<GridState>(() => ({
  blockSize: "1x1",
  selection: null,
  isChecking: false,
  isAvailable: false,
}));

// ✅ Actions defined at module level
export const setBlockSize = (size: BlockSize) =>
  useGridStore.setState({ blockSize: size });

export const setSelection = (selection: Selection | null) =>
  useGridStore.setState({ selection });

export const clearSelection = () =>
  useGridStore.setState({ selection: null, isAvailable: false });

export const setIsChecking = (isChecking: boolean) =>
  useGridStore.setState({ isChecking });

export const setIsAvailable = (isAvailable: boolean) =>
  useGridStore.setState({ isAvailable });

// ✅ Export atomic selectors for state
export const useBlockSize = () => useGridStore((state) => state.blockSize);
export const useSelection = () => useGridStore((state) => state.selection);
export const useIsChecking = () => useGridStore((state) => state.isChecking);
export const useIsAvailable = () => useGridStore((state) => state.isAvailable);
