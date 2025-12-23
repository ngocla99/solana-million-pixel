import { Container, Graphics } from "pixi.js";
import {
  GRID_SIZE,
  SPOT_SIZE,
  CHUNK_SIZE,
  CHUNKS_PER_ROW,
  type Chunk,
  getVisibleChunks,
} from "@/lib/grid-utils";

// Theme-aware colors (these will be passed from React component)
export interface GridColors {
  background: number;
  gridLine: number;
  spotAvailable: number;
  spotHover: number;
  selection: number;
  highlight: number;
  worldBorder: number;
}

// Default light theme colors (matching CSS variables)
export const DEFAULT_COLORS: GridColors = {
  background: 0xffffff, // White background
  gridLine: 0xe5e5e5, // Light gray grid lines
  spotAvailable: 0xf5f5f5, // Very light gray
  spotHover: 0xd1fae5, // Light teal hover
  selection: 0x10b981, // Teal selection
  highlight: 0x059669, // Darker teal highlight
  worldBorder: 0xcccccc, // Light gray world border
};

/**
 * Creates the grid background container with chunk-based rendering
 */
export function createGridContainer(
  colors: GridColors = DEFAULT_COLORS
): Container {
  const container = new Container();
  container.label = "grid-container";
  container.cullable = true;

  // Create background and border
  const background = new Graphics();
  background.rect(0, 0, GRID_SIZE * SPOT_SIZE, GRID_SIZE * SPOT_SIZE);
  background.fill(colors.background);
  background.stroke({ width: 4, color: colors.worldBorder }); // Thicker border for visibility
  container.addChild(background);

  return container;
}

/**
 * Renders grid lines for visible chunks
 */
export function renderGridLines(
  container: Container,
  viewportLeft: number,
  viewportTop: number,
  viewportRight: number,
  viewportBottom: number,
  scale: number,
  colors: GridColors = DEFAULT_COLORS
): void {
  // Remove existing grid lines
  const existingLines = container.getChildByLabel("grid-lines");
  if (existingLines) {
    container.removeChild(existingLines);
    existingLines.destroy();
  }

  // Don't render lines if zoomed out too much (performance optimization)
  if (scale < 0.3) return;

  const graphics = new Graphics();
  graphics.label = "grid-lines";

  // Get visible area bounds
  const startX = Math.max(0, Math.floor(viewportLeft / SPOT_SIZE) * SPOT_SIZE);
  const startY = Math.max(0, Math.floor(viewportTop / SPOT_SIZE) * SPOT_SIZE);
  const endX = Math.min(
    GRID_SIZE * SPOT_SIZE,
    Math.ceil(viewportRight / SPOT_SIZE) * SPOT_SIZE
  );
  const endY = Math.min(
    GRID_SIZE * SPOT_SIZE,
    Math.ceil(viewportBottom / SPOT_SIZE) * SPOT_SIZE
  );

  // Determine line step based on zoom level for performance
  let step = SPOT_SIZE;
  if (scale < 0.5) step = SPOT_SIZE * 5;
  if (scale < 1) step = SPOT_SIZE * 2;

  graphics.stroke({ width: 1 / scale, color: colors.gridLine, alpha: 0.5 });

  // Vertical lines
  for (let x = startX; x <= endX; x += step) {
    graphics.moveTo(x, startY);
    graphics.lineTo(x, endY);
  }

  // Horizontal lines
  for (let y = startY; y <= endY; y += step) {
    graphics.moveTo(startX, y);
    graphics.lineTo(endX, y);
  }

  graphics.stroke();
  container.addChild(graphics);
}

/**
 * Creates a hover highlight for a spot
 */
export function createHoverHighlight(): Graphics {
  const highlight = new Graphics();
  highlight.label = "hover-highlight";
  highlight.visible = false;
  return highlight;
}

/**
 * Updates hover highlight position
 */
export function updateHoverHighlight(
  highlight: Graphics,
  gridX: number,
  gridY: number,
  visible: boolean,
  colors: GridColors = DEFAULT_COLORS
): void {
  highlight.clear();

  if (!visible) {
    highlight.visible = false;
    return;
  }

  highlight.visible = true;
  highlight.rect(gridX * SPOT_SIZE, gridY * SPOT_SIZE, SPOT_SIZE, SPOT_SIZE);
  highlight.fill({ color: colors.spotHover, alpha: 0.6 });
  highlight.stroke({ width: 2, color: colors.highlight });
}

/**
 * Creates a selection overlay
 */
export function createSelectionOverlay(): Graphics {
  const overlay = new Graphics();
  overlay.label = "selection-overlay";
  overlay.visible = false;
  return overlay;
}

/**
 * Updates selection overlay
 */
export function updateSelectionOverlay(
  overlay: Graphics,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  visible: boolean,
  colors: GridColors = DEFAULT_COLORS
): void {
  overlay.clear();

  if (!visible) {
    overlay.visible = false;
    return;
  }

  overlay.visible = true;

  // Normalize coordinates
  const minX = Math.min(startX, endX);
  const maxX = Math.max(startX, endX);
  const minY = Math.min(startY, endY);
  const maxY = Math.max(startY, endY);

  const width = (maxX - minX + 1) * SPOT_SIZE;
  const height = (maxY - minY + 1) * SPOT_SIZE;

  // Draw selection rectangle
  overlay.rect(minX * SPOT_SIZE, minY * SPOT_SIZE, width, height);
  overlay.fill({ color: colors.selection, alpha: 0.2 });
  overlay.stroke({ width: 2, color: colors.selection, alpha: 0.8 });
}
