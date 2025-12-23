"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Application, Container, Graphics } from "pixi.js";
import { Viewport } from "pixi-viewport";
import {
  GRID_SIZE,
  SPOT_SIZE,
  WORLD_SIZE,
  screenToGrid,
} from "@/lib/grid-utils";
import {
  createGridContainer,
  renderGridLines,
  createHoverHighlight,
  updateHoverHighlight,
  createSelectionOverlay,
  updateSelectionOverlay,
  DEFAULT_COLORS,
  type GridColors,
} from "./grid-renderer";
import { SpotTooltip } from "./spot-tooltip";
import { SelectionOverlay } from "./selection-overlay";

interface CanvasGridProps {
  onSelectionComplete?: (selection: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  }) => void;
}

// Helper to convert CSS color to hex number
function cssColorToHex(cssVar: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;

  // Try to get from computed style of body (which has dark class applied)
  const style = getComputedStyle(document.body);
  const color = style.getPropertyValue(cssVar).trim();

  if (!color) return fallback;

  // Parse hex color
  if (color.startsWith("#")) {
    const hex = color.slice(1);
    const parsed = parseInt(hex, 16);
    if (!isNaN(parsed)) return parsed;
  }

  return fallback;
}

// Just use DEFAULT_COLORS directly for reliability
// CSS variables can be unreliable for PixiJS timing
function getThemeColors(): GridColors {
  return DEFAULT_COLORS;
}

export function CanvasGrid({ onSelectionComplete }: CanvasGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const viewportRef = useRef<Viewport | null>(null);
  const gridContainerRef = useRef<Container | null>(null);
  const hoverHighlightRef = useRef<Graphics | null>(null);
  const selectionOverlayRef = useRef<Graphics | null>(null);
  const colorsRef = useRef<GridColors>(DEFAULT_COLORS);

  const [hoveredSpot, setHoveredSpot] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selection, setSelection] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const selectionStartRef = useRef<{ x: number; y: number } | null>(null);

  // Get current viewport state for coordinate conversion
  const getViewportState = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return { x: 0, y: 0, scale: 1 };
    return {
      x: viewport.x,
      y: viewport.y,
      scale: viewport.scale.x,
    };
  }, []);

  // Initialize PixiJS
  useEffect(() => {
    if (!containerRef.current) return;

    let destroyed = false;

    const initPixi = async () => {
      // Get theme colors from CSS
      colorsRef.current = getThemeColors();
      const colors = colorsRef.current;

      const app = new Application();

      // Convert hex number to CSS color string
      const bgColor = `#${colors.background.toString(16).padStart(6, "0")}`;

      await app.init({
        background: "#f3f4f6", // Contrast with white grid background
        resizeTo: containerRef.current!,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      if (destroyed) {
        app.destroy(true);
        return;
      }

      containerRef.current!.appendChild(app.canvas);
      appRef.current = app;

      // Create viewport
      const viewport = new Viewport({
        screenWidth: app.screen.width,
        screenHeight: app.screen.height,
        worldWidth: WORLD_SIZE,
        worldHeight: WORLD_SIZE,
        events: app.renderer.events,
      });

      viewport
        .drag({ mouseButtons: "middle-right" }) // Only middle/right click for panning
        .pinch()
        .wheel({ smooth: 5, percent: 0.1 })
        .decelerate({ friction: 0.95 })
        .clampZoom({ minScale: 0.05, maxScale: 5 })
        .clamp({ direction: "all" });

      // Center viewport initially
      viewport.moveCenter(WORLD_SIZE / 2, WORLD_SIZE / 2);
      viewport.setZoom(0.15, true);

      app.stage.addChild(viewport);
      viewportRef.current = viewport;

      // Create grid container with theme colors
      const gridContainer = createGridContainer(colors);
      viewport.addChild(gridContainer);
      gridContainerRef.current = gridContainer;

      // Create hover highlight
      const hoverHighlight = createHoverHighlight();
      viewport.addChild(hoverHighlight);
      hoverHighlightRef.current = hoverHighlight;

      // Create selection overlay
      const selectionOverlay = createSelectionOverlay();
      viewport.addChild(selectionOverlay);
      selectionOverlayRef.current = selectionOverlay;

      // Initial render
      renderGridLines(
        gridContainer,
        0,
        0,
        WORLD_SIZE,
        WORLD_SIZE,
        viewport.scale.x,
        colors
      );

      // Update grid lines on viewport change
      const updateGridLines = () => {
        if (!viewport || !gridContainer) return;

        const bounds = viewport.getVisibleBounds();
        renderGridLines(
          gridContainer,
          bounds.x,
          bounds.y,
          bounds.x + bounds.width,
          bounds.y + bounds.height,
          viewport.scale.x,
          colorsRef.current
        );
      };

      viewport.on("moved", updateGridLines);
      viewport.on("zoomed", updateGridLines);

      // Handle window resize
      const handleResize = () => {
        if (app && viewport && containerRef.current) {
          app.renderer.resize(
            containerRef.current.clientWidth,
            containerRef.current.clientHeight
          );
          viewport.resize(
            containerRef.current.clientWidth,
            containerRef.current.clientHeight
          );
          updateGridLines();
        }
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    };

    initPixi();

    return () => {
      destroyed = true;
      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
    };
  }, []);

  // Handle mouse events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handlePointerMove = (e: PointerEvent) => {
      const viewport = viewportRef.current;
      if (!viewport) return;

      const rect = container.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      setTooltipPosition({ x: e.clientX, y: e.clientY });

      const { x: viewportX, y: viewportY, scale } = getViewportState();
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
        updateHoverHighlight(
          hoverHighlightRef.current!,
          gridPos.x,
          gridPos.y,
          true,
          colorsRef.current
        );
      } else {
        setHoveredSpot(null);
        updateHoverHighlight(
          hoverHighlightRef.current!,
          0,
          0,
          false,
          colorsRef.current
        );
      }

      // Update selection if dragging with left button
      if (isSelecting && selectionStartRef.current) {
        // Clamp endX and endY to valid grid bounds to prevent border going outside canvas
        const clampedEndX = Math.max(0, Math.min(GRID_SIZE - 1, gridPos.x));
        const clampedEndY = Math.max(0, Math.min(GRID_SIZE - 1, gridPos.y));

        const newSelection = {
          startX: selectionStartRef.current.x,
          startY: selectionStartRef.current.y,
          endX: clampedEndX,
          endY: clampedEndY,
        };
        setSelection(newSelection);
        updateSelectionOverlay(
          selectionOverlayRef.current!,
          newSelection.startX,
          newSelection.startY,
          newSelection.endX,
          newSelection.endY,
          true,
          colorsRef.current
        );
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      // Only left click for selection
      if (e.button !== 0) return;

      const viewport = viewportRef.current;
      if (!viewport) return;

      const rect = container.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      const { x: viewportX, y: viewportY, scale } = getViewportState();
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
        const newSelection = {
          startX: gridPos.x,
          startY: gridPos.y,
          endX: gridPos.x,
          endY: gridPos.y,
        };
        setSelection(newSelection);
        updateSelectionOverlay(
          selectionOverlayRef.current!,
          newSelection.startX,
          newSelection.startY,
          newSelection.endX,
          newSelection.endY,
          true,
          colorsRef.current
        );
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (e.button !== 0) return;

      if (isSelecting && selection) {
        setIsSelecting(false);
        onSelectionComplete?.(selection);
      }
    };

    const handlePointerLeave = () => {
      setHoveredSpot(null);
      updateHoverHighlight(
        hoverHighlightRef.current!,
        0,
        0,
        false,
        colorsRef.current
      );
    };

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerdown", handlePointerDown);
    container.addEventListener("pointerup", handlePointerUp);
    container.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("pointerup", handlePointerUp);
      container.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [getViewportState, isSelecting, selection, onSelectionComplete]);

  // Clear selection handler
  const clearSelection = useCallback(() => {
    setSelection(null);
    setIsSelecting(false);
    selectionStartRef.current = null;
    updateSelectionOverlay(
      selectionOverlayRef.current!,
      0,
      0,
      0,
      0,
      false,
      colorsRef.current
    );
  }, []);

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className="w-full h-full cursor-crosshair"
        style={{ touchAction: "none" }}
      />

      {/* Tooltip */}
      {hoveredSpot && (
        <SpotTooltip
          x={hoveredSpot.x}
          y={hoveredSpot.y}
          screenX={tooltipPosition.x}
          screenY={tooltipPosition.y}
        />
      )}

      {/* Selection Info */}
      {selection && !isSelecting && (
        <SelectionOverlay
          selection={selection}
          onClear={clearSelection}
          onConfirm={() => {
            onSelectionComplete?.(selection);
          }}
        />
      )}
    </div>
  );
}
