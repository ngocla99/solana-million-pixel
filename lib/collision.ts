import { supabase, type Spot } from "./supabase";
import { Selection } from "./grid-utils";

/**
 * Check if a selection overlaps with any existing sold spots
 */
export async function checkCollision(
  selection: Selection
): Promise<{ hasCollision: boolean; conflictingSpots: Spot[] }> {
  const { startX, startY, endX, endY } = selection;

  // Normalize coordinates
  const minX = Math.min(startX, endX);
  const maxX = Math.max(startX, endX);
  const minY = Math.min(startY, endY);
  const maxY = Math.max(startY, endY);

  // Query for ALL spots and filter for overlaps
  // We need to find spots where their bounding box overlaps with the selection
  // A spot at (spot.x, spot.y) with (spot.width, spot.height) overlaps with selection if:
  // NOT (spotEndX < minX OR spot.x > maxX OR spotEndY < minY OR spot.y > maxY)
  //
  // Since Supabase doesn't support computed columns in queries easily,
  // we fetch spots that COULD potentially overlap and filter in code
  const { data: spots, error } = await supabase.from("spots").select("*");

  if (error) {
    console.error("Error checking collision:", error);
    throw new Error("Failed to check spot availability");
  }

  // Filter for actual overlaps - a spot overlaps if the rectangles intersect
  const conflictingSpots = (spots || []).filter((spot) => {
    const spotEndX = spot.x + spot.width - 1;
    const spotEndY = spot.y + spot.height - 1;

    // Two rectangles overlap if they don't NOT overlap
    // They don't overlap if: one is entirely to the left, right, above, or below the other
    const noOverlap =
      spotEndX < minX || // spot is entirely to the left of selection
      spot.x > maxX || // spot is entirely to the right of selection
      spotEndY < minY || // spot is entirely above selection
      spot.y > maxY; // spot is entirely below selection

    return !noOverlap;
  });

  return {
    hasCollision: conflictingSpots.length > 0,
    conflictingSpots,
  };
}

/**
 * Get all occupied spots in a specific region
 */
export async function getOccupiedSpots(
  startX: number,
  startY: number,
  endX: number,
  endY: number
): Promise<Spot[]> {
  const { data: spots, error } = await supabase
    .from("spots")
    .select("*")
    .gte("x", startX)
    .lte("x", endX)
    .gte("y", startY)
    .lte("y", endY);

  if (error) {
    console.error("Error fetching occupied spots:", error);
    return [];
  }

  return spots || [];
}

/**
 * Get all sold spots for canvas rendering
 */
export async function getAllSoldSpots(): Promise<Spot[]> {
  const { data: spots, error } = await supabase
    .from("spots")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching all spots:", error);
    return [];
  }

  return spots || [];
}
