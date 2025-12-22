// Grid configuration constants
export const GRID_SIZE = 1000; // 1000x1000 spots
export const SPOT_SIZE = 10; // 10px per spot
export const WORLD_SIZE = GRID_SIZE * SPOT_SIZE; // 10000px total
export const CHUNK_SIZE = 100; // 100x100 spots per chunk
export const CHUNKS_PER_ROW = GRID_SIZE / CHUNK_SIZE; // 10 chunks per row

// Selection interface
export interface Selection {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

// Spot interface
export interface Spot {
  x: number;
  y: number;
  sold: boolean;
  imageUrl?: string;
  linkUrl?: string;
  owner?: string;
}

// Chunk interface for efficient rendering
export interface Chunk {
  chunkX: number;
  chunkY: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

/**
 * Convert screen coordinates to grid coordinates
 */
export function screenToGrid(
  screenX: number,
  screenY: number,
  viewportX: number,
  viewportY: number,
  scale: number
): { x: number; y: number } {
  const worldX = (screenX - viewportX) / scale;
  const worldY = (screenY - viewportY) / scale;

  const gridX = Math.floor(worldX / SPOT_SIZE);
  const gridY = Math.floor(worldY / SPOT_SIZE);

  return {
    x: Math.max(0, Math.min(GRID_SIZE - 1, gridX)),
    y: Math.max(0, Math.min(GRID_SIZE - 1, gridY)),
  };
}

/**
 * Convert grid coordinates to world pixel coordinates
 */
export function gridToWorld(
  gridX: number,
  gridY: number
): { x: number; y: number } {
  return {
    x: gridX * SPOT_SIZE,
    y: gridY * SPOT_SIZE,
  };
}

/**
 * Get chunk index from grid coordinates
 */
export function getChunkIndex(
  gridX: number,
  gridY: number
): { chunkX: number; chunkY: number } {
  return {
    chunkX: Math.floor(gridX / CHUNK_SIZE),
    chunkY: Math.floor(gridY / CHUNK_SIZE),
  };
}

/**
 * Get all visible chunks based on viewport bounds
 */
export function getVisibleChunks(
  viewportLeft: number,
  viewportTop: number,
  viewportRight: number,
  viewportBottom: number
): Chunk[] {
  const chunks: Chunk[] = [];

  // Convert viewport bounds to chunk indices
  const startChunkX = Math.max(
    0,
    Math.floor(viewportLeft / (CHUNK_SIZE * SPOT_SIZE))
  );
  const startChunkY = Math.max(
    0,
    Math.floor(viewportTop / (CHUNK_SIZE * SPOT_SIZE))
  );
  const endChunkX = Math.min(
    CHUNKS_PER_ROW - 1,
    Math.floor(viewportRight / (CHUNK_SIZE * SPOT_SIZE))
  );
  const endChunkY = Math.min(
    CHUNKS_PER_ROW - 1,
    Math.floor(viewportBottom / (CHUNK_SIZE * SPOT_SIZE))
  );

  for (let cy = startChunkY; cy <= endChunkY; cy++) {
    for (let cx = startChunkX; cx <= endChunkX; cx++) {
      chunks.push({
        chunkX: cx,
        chunkY: cy,
        startX: cx * CHUNK_SIZE,
        startY: cy * CHUNK_SIZE,
        endX: (cx + 1) * CHUNK_SIZE - 1,
        endY: (cy + 1) * CHUNK_SIZE - 1,
      });
    }
  }

  return chunks;
}

/**
 * Check if a spot is within a selection
 */
export function isSpotInSelection(
  spotX: number,
  spotY: number,
  selection: Selection
): boolean {
  const minX = Math.min(selection.startX, selection.endX);
  const maxX = Math.max(selection.startX, selection.endX);
  const minY = Math.min(selection.startY, selection.endY);
  const maxY = Math.max(selection.startY, selection.endY);

  return spotX >= minX && spotX <= maxX && spotY >= minY && spotY <= maxY;
}

/**
 * Get normalized selection bounds (ensuring start <= end)
 */
export function normalizeSelection(selection: Selection): Selection {
  return {
    startX: Math.min(selection.startX, selection.endX),
    startY: Math.min(selection.startY, selection.endY),
    endX: Math.max(selection.startX, selection.endX),
    endY: Math.max(selection.startY, selection.endY),
  };
}

/**
 * Calculate selection dimensions and spot count
 */
export function getSelectionInfo(selection: Selection): {
  width: number;
  height: number;
  totalSpots: number;
} {
  const normalized = normalizeSelection(selection);
  const width = normalized.endX - normalized.startX + 1;
  const height = normalized.endY - normalized.startY + 1;

  return {
    width,
    height,
    totalSpots: width * height,
  };
}

/**
 * Check if a value is within grid bounds
 */
export function isInBounds(x: number, y: number): boolean {
  return x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE;
}
