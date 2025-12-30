import { Assets, Container, Graphics, Sprite, Texture } from "pixi.js";
import { GRID_SIZE, SPOT_SIZE } from "./grid-utils";
import { Spot } from "../types/api";

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

// Default dark theme colors (matching SOLGRID design)
export const DEFAULT_COLORS: GridColors = {
  background: 0x09090b, // Zinc-950
  gridLine: 0x1f1f2e, // Subtle grid lines
  spotAvailable: 0x141420, // Slightly lighter than background
  spotHover: 0x1a3a2e, // Dark teal hover
  selection: 0x9945ff, // Solana Purple
  highlight: 0x14f195, // Solana Green
  worldBorder: 0x27272a, // Zinc-800
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
  colors: GridColors = DEFAULT_COLORS,
  blockSize: number = 1
): void {
  highlight.clear();

  if (!visible) {
    highlight.visible = false;
    return;
  }

  highlight.visible = true;
  const size = SPOT_SIZE * blockSize;
  highlight.rect(gridX * SPOT_SIZE, gridY * SPOT_SIZE, size, size);
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
 * Updates selection overlay with optional color preview
 */
export function updateSelectionOverlay(
  overlay: Graphics,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  visible: boolean,
  colors: GridColors = DEFAULT_COLORS,
  previewColor?: string | null
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
  
  // If preview color is set, use it for the fill
  if (previewColor) {
    const colorValue = parseInt(previewColor.replace("#", ""), 16);
    overlay.fill({ color: colorValue, alpha: 0.9 });
    overlay.stroke({ width: 2, color: 0xffffff, alpha: 0.8 });
  } else {
    overlay.fill({ color: colors.selection, alpha: 0.2 });
    overlay.stroke({ width: 2, color: colors.selection, alpha: 0.8 });
  }
}

/**
 * Creates a container for sold spots
 */
export function createSoldSpotsContainer(): Container {
  const container = new Container();
  container.label = "sold-spots-container";
  return container;
}

/**
 * Renders sold spots with images or solid colors
 */
export async function renderSoldSpots(
  container: Container,
  spots: Spot[]
): Promise<void> {
  // Clear existing sold spots
  container.removeChildren();

  for (const spot of spots) {
    // Skip spots with no visual content
    if (!spot.image_url && !spot.color_hex) continue;

    // If we have an image_url, render image
    if (spot.image_url) {
      try {
        // Load texture using Assets.load (PixiJS v8 API)
        const texture = await Assets.load<Texture>({
          src: spot.image_url,
          loadParser: "loadTextures",
          data: {
            crossOrigin: "anonymous",
          },
        });

        // Verify texture loaded successfully
        if (!texture) {
          throw new Error("Texture failed to load or is invalid");
        }

        // Create sprite from loaded texture
        const sprite = new Sprite(texture);
        sprite.x = spot.x * SPOT_SIZE;
        sprite.y = spot.y * SPOT_SIZE;
        sprite.width = spot.width * SPOT_SIZE;
        sprite.height = spot.height * SPOT_SIZE;

        // Make sprite interactive for clicking
        sprite.eventMode = "static";
        sprite.cursor = "pointer";
        sprite.on("pointerdown", () => {
          if (spot.link_url) {
            window.open(spot.link_url, "_blank");
          }
        });

        container.addChild(sprite);
      } catch (error) {
        console.error(
          `Failed to load image for spot at (${spot.x}, ${spot.y}):`,
          error
        );

        // Draw a placeholder rectangle if image fails to load
        const placeholder = new Graphics();
        placeholder.rect(
          spot.x * SPOT_SIZE,
          spot.y * SPOT_SIZE,
          spot.width * SPOT_SIZE,
          spot.height * SPOT_SIZE
        );
        placeholder.fill({ color: 0xcccccc, alpha: 0.5 });
        container.addChild(placeholder);
      }
    } else if (spot.color_hex) {
      // Render solid color block
      const colorGraphics = new Graphics();
      
      // Convert hex string to number (e.g., "#FF5733" -> 0xFF5733)
      const colorValue = parseInt(spot.color_hex.replace("#", ""), 16);
      
      colorGraphics.rect(
        spot.x * SPOT_SIZE,
        spot.y * SPOT_SIZE,
        spot.width * SPOT_SIZE,
        spot.height * SPOT_SIZE
      );
      colorGraphics.fill({ color: colorValue });

      // Make the color block interactive for clicking
      colorGraphics.eventMode = "static";
      colorGraphics.cursor = "pointer";
      colorGraphics.on("pointerdown", () => {
        if (spot.link_url) {
          window.open(spot.link_url, "_blank");
        }
      });

      container.addChild(colorGraphics);
    }
  }
}
