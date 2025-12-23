import { checkCollision } from "@/features/pixels-grid/utils/collision";
import { NextRequest, NextResponse } from "next/server";

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

    // Check for collisions
    const { hasCollision, conflictingSpots } = await checkCollision({
      startX,
      startY,
      endX,
      endY,
    });

    return NextResponse.json({
      available: !hasCollision,
      hasCollision,
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
