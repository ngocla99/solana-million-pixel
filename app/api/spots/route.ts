import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * GET /api/spots - Fetch all sold spots for canvas rendering
 */
export async function GET() {
  try {
    const { data: spots, error } = await supabaseAdmin
      .from("spots")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching spots:", error);
      return NextResponse.json(
        { error: "Failed to fetch spots", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ spots: spots || [] });
  } catch (error) {
    console.error("Error fetching spots:", error);
    return NextResponse.json(
      { error: "Failed to fetch spots" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/spots - Create a new spot reservation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      x,
      y,
      width,
      height,
      image_url,
      color_hex,
      link_url,
      owner_wallet,
      tx_signature,
    } = body;

    // Validate required fields
    if (
      typeof x !== "number" ||
      typeof y !== "number" ||
      typeof width !== "number" ||
      typeof height !== "number" ||
      !owner_wallet
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert spot into database
    const { data: spot, error } = await supabaseAdmin
      .from("spots")
      .insert({
        x,
        y,
        width,
        height,
        image_url,
        color_hex,
        link_url,
        owner_wallet,
        tx_signature,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating spot:", error);
      return NextResponse.json(
        { error: "Failed to create spot", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ spot }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/spots:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
