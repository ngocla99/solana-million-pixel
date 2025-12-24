import { useEffect, useRef, useState, useCallback } from "react";
import { Application, Container, Graphics } from "pixi.js";
import { Viewport } from "pixi-viewport";
import {
  GRID_SIZE,
  SPOT_SIZE,
  WORLD_SIZE,
  screenToGrid,
} from "../utils/grid-utils";
import {
  createGridContainer,
  renderGridLines,
  createHoverHighlight,
  updateHoverHighlight,
  createSelectionOverlay,
  updateSelectionOverlay,
  createSoldSpotsContainer,
  renderSoldSpots,
  DEFAULT_COLORS,
  type GridColors,
} from "./grid-renderer";
import { SpotTooltip } from "./spot-tooltip";
import { useSpots } from "../api/get-spots";
import {
  setSelection as setStoreSelection,
  useBlockSize,
  type BlockSize,
} from "../stores/use-grid-store";

// Helper to get block size number from BlockSize type
function getBlockSizeNumber(blockSize: BlockSize): number {
  switch (blockSize) {
    case "2x2":
      return 2;
    case "5x5":
      return 5;
    default:
      return 1;
  }
}

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
  const soldSpotsContainerRef = useRef<Container | null>(null);
  const hoverHighlightRef = useRef<Graphics | null>(null);
  const selectionOverlayRef = useRef<Graphics | null>(null);
  const colorsRef = useRef<GridColors>(DEFAULT_COLORS);

  // Get block size from Zustand store
  const blockSize = useBlockSize();
  const blockSizeNum = getBlockSizeNumber(blockSize);

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

  // Fetch spots using TanStack Query
  const { data: spotsData } = useSpots();

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
        background: "#09090b", // Match background from mock
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

      // Create sold spots container
      const soldSpotsContainer = createSoldSpotsContainer();
      viewport.addChild(soldSpotsContainer);
      soldSpotsContainerRef.current = soldSpotsContainer;

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

  // Render sold spots when data is available
  useEffect(() => {
    if (spotsData?.spots && soldSpotsContainerRef.current) {
      renderSoldSpots(soldSpotsContainerRef.current, spotsData.spots);
    }
  }, [spotsData]);

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

      // Update hovered spot - snap to block size grid
      if (
        gridPos.x >= 0 &&
        gridPos.x < GRID_SIZE &&
        gridPos.y >= 0 &&
        gridPos.y < GRID_SIZE
      ) {
        // Snap hover to block size aligned grid
        const snappedX = Math.floor(gridPos.x / blockSizeNum) * blockSizeNum;
        const snappedY = Math.floor(gridPos.y / blockSizeNum) * blockSizeNum;
        setHoveredSpot({ x: snappedX, y: snappedY });
        updateHoverHighlight(
          hoverHighlightRef.current!,
          snappedX,
          snappedY,
          true,
          colorsRef.current,
          blockSizeNum
        );
      } else {
        setHoveredSpot(null);
        updateHoverHighlight(
          hoverHighlightRef.current!,
          0,
          0,
          false,
          colorsRef.current,
          blockSizeNum
        );
      }

      // Update selection if dragging with left button
      if (isSelecting && selectionStartRef.current) {
        // Snap end position to block size grid
        const snappedEndX =
          Math.floor(gridPos.x / blockSizeNum) * blockSizeNum +
          blockSizeNum -
          1;
        const snappedEndY =
          Math.floor(gridPos.y / blockSizeNum) * blockSizeNum +
          blockSizeNum -
          1;
        const clampedEndX = Math.max(0, Math.min(GRID_SIZE - 1, snappedEndX));
        const clampedEndY = Math.max(0, Math.min(GRID_SIZE - 1, snappedEndY));

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
        // Calculate selection based on block size
        // Snap to grid aligned with block size and clamp to grid bounds
        const startX = Math.floor(gridPos.x / blockSizeNum) * blockSizeNum;
        const startY = Math.floor(gridPos.y / blockSizeNum) * blockSizeNum;
        const endX = Math.min(startX + blockSizeNum - 1, GRID_SIZE - 1);
        const endY = Math.min(startY + blockSizeNum - 1, GRID_SIZE - 1);

        selectionStartRef.current = { x: startX, y: startY };
        setIsSelecting(true);
        const newSelection = {
          startX,
          startY,
          endX,
          endY,
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
        // Sync selection with Zustand store
        setStoreSelection(selection);
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
  }, [
    getViewportState,
    isSelecting,
    selection,
    onSelectionComplete,
    blockSizeNum,
  ]);

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

  // Zoom control handlers
  const handleZoomIn = useCallback(() => {
    viewportRef.current?.zoom(-WORLD_SIZE * 0.05, true);
  }, []);

  const handleZoomOut = useCallback(() => {
    viewportRef.current?.zoom(WORLD_SIZE * 0.05, true);
  }, []);

  return (
    <div className="relative w-full h-full group">
      <div
        ref={containerRef}
        className="w-full h-full cursor-crosshair bg-zinc-950"
        style={{ touchAction: "none" }}
      />

      {/* Grid Pattern Overlay (Optional, visually enhances background before Pixi loads) */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      {/* Tooltip */}
      {hoveredSpot && (
        <SpotTooltip
          x={hoveredSpot.x}
          y={hoveredSpot.y}
          screenX={tooltipPosition.x}
          screenY={tooltipPosition.y}
        />
      )}

      {/* Zoom Controls Overlay */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-4 pointer-events-none">
        <div className="bg-zinc-900/90 backdrop-blur border border-white/10 p-1 rounded-lg pointer-events-auto flex flex-col gap-1 shadow-2xl">
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-white/5 rounded text-zinc-400 hover:text-white transition-colors"
            title="Zoom In"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-white/5 rounded text-zinc-400 hover:text-white transition-colors"
            title="Zoom Out"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
