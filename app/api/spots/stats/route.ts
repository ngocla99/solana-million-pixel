import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * GET /api/spots/stats - Fetch aggregated statistics about sold spots
 */
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("spots")
      .select("width, height, owner_wallet, updated_at");

    if (error) {
      console.error("Error fetching spot statistics:", error);
      return NextResponse.json(
        { error: "Failed to fetch statistics", details: error.message },
        { status: 500 }
      );
    }

    const spots = data || [];

    // Calculate statistics
    const totalPixelsSold = spots.reduce(
      (sum, spot) => sum + spot.width * spot.height,
      0
    );
    const totalSpots = spots.length;
    const uniqueOwners = new Set(spots.map((spot) => spot.owner_wallet)).size;
    const lastUpdated =
      spots.length > 0
        ? spots.reduce((latest, spot) =>
            new Date(spot.updated_at) > new Date(latest)
              ? spot.updated_at
              : latest,
          spots[0].updated_at)
        : null;

    return NextResponse.json({
      totalPixelsSold,
      totalSpots,
      uniqueOwners,
      lastUpdated,
    });
  } catch (error) {
    console.error("Error fetching spot statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
