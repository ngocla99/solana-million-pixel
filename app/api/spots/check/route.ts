import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { Spot } from "@/features/pixels-grid/types/api";

/**
 * POST /api/spots/check - Check if spots are available (collision detection)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { startX, startY, endX, endY } = body;

    // Validate coordinates
    if (
      typeof startX !== "number" ||
      typeof startY !== "number" ||
      typeof endX !== "number" ||
      typeof endY !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid coordinates" },
        { status: 400 }
      );
    }

    // Normalize coordinates
    const minX = Math.min(startX, endX);
    const maxX = Math.max(startX, endX);
    const minY = Math.min(startY, endY);
    const maxY = Math.max(startY, endY);

    // Fetch all spots from database
    const { data: spots, error } = await supabaseAdmin
      .from("spots")
      .select("*");

    if (error) {
      console.error("Database error checking spot availability:", error);
      return NextResponse.json(
        { error: "Failed to check spot availability", details: error.message },
        { status: 500 }
      );
    }

    // Filter for actual overlaps - a spot overlaps if the rectangles intersect
    const conflictingSpots = (spots || []).filter((spot: Spot) => {
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

    return NextResponse.json({
      available: conflictingSpots.length === 0,
      hasCollision: conflictingSpots.length > 0,
      conflictingSpots,
    });
  } catch (error) {
    console.error("Error checking spot availability:", error);
    return NextResponse.json(
      { error: "Failed to check spot availability" },
      { status: 500 }
    );
  }
}
