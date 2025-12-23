"use client";

import { useState, useCallback, useRef } from "react";
import {
  screenToGrid,
  type Selection,
  getSelectionInfo,
  GRID_SIZE,
} from "../utils/grid-utils";

export interface GridInteractionState {
  hoveredSpot: { x: number; y: number } | null;
  selection: Selection | null;
  isSelecting: boolean;
  selectionInfo: { width: number; height: number; totalSpots: number } | null;
}

export interface UseGridInteractionsReturn extends GridInteractionState {
  handleMouseMove: (
    screenX: number,
    screenY: number,
    viewportX: number,
    viewportY: number,
    scale: number
  ) => void;
  handleMouseDown: (
    screenX: number,
    screenY: number,
    viewportX: number,
    viewportY: number,
    scale: number
  ) => void;
  handleMouseUp: () => void;
  handleMouseLeave: () => void;
  clearSelection: () => void;
}

export function useGridInteractions(): UseGridInteractionsReturn {
  const [hoveredSpot, setHoveredSpot] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const selectionStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleMouseMove = useCallback(
    (
      screenX: number,
      screenY: number,
      viewportX: number,
      viewportY: number,
      scale: number
    ) => {
      const gridPos = screenToGrid(
        screenX,
        screenY,
        viewportX,
        viewportY,
        scale
      );

      // Update hovered spot
      if (
        gridPos.x >= 0 &&
        gridPos.x < GRID_SIZE &&
        gridPos.y >= 0 &&
        gridPos.y < GRID_SIZE
      ) {
        setHoveredSpot(gridPos);
      } else {
        setHoveredSpot(null);
      }

      // Update selection if dragging
      if (isSelecting && selectionStartRef.current) {
        setSelection({
          startX: selectionStartRef.current.x,
          startY: selectionStartRef.current.y,
          endX: gridPos.x,
          endY: gridPos.y,
        });
      }
    },
    [isSelecting]
  );

  const handleMouseDown = useCallback(
    (
      screenX: number,
      screenY: number,
      viewportX: number,
      viewportY: number,
      scale: number
    ) => {
      const gridPos = screenToGrid(
        screenX,
        screenY,
        viewportX,
        viewportY,
        scale
      );

      if (
        gridPos.x >= 0 &&
        gridPos.x < GRID_SIZE &&
        gridPos.y >= 0 &&
        gridPos.y < GRID_SIZE
      ) {
        selectionStartRef.current = gridPos;
        setIsSelecting(true);
        setSelection({
          startX: gridPos.x,
          startY: gridPos.y,
          endX: gridPos.x,
          endY: gridPos.y,
        });
      }
    },
    []
  );

  const handleMouseUp = useCallback(() => {
    setIsSelecting(false);
    // Keep selection visible after mouse up
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredSpot(null);
  }, []);

  const clearSelection = useCallback(() => {
    setSelection(null);
    setIsSelecting(false);
    selectionStartRef.current = null;
  }, []);

  const selectionInfo = selection ? getSelectionInfo(selection) : null;

  return {
    hoveredSpot,
    selection,
    isSelecting,
    selectionInfo,
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
    clearSelection,
  };
}
