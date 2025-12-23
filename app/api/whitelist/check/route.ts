import { NextRequest, NextResponse } from "next/server";
import { isWhitelisted, getWhitelistAllowance } from "@/lib/whitelist";

/**
 * GET /api/whitelist/check?wallet=<address>
 * Check if a wallet address is whitelisted and get allowance
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("wallet");

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    const whitelisted = await isWhitelisted(walletAddress);
    const allowance = await getWhitelistAllowance(walletAddress);

    return NextResponse.json({
      isWhitelisted: whitelisted,
      allowance: allowance,
      walletAddress: walletAddress,
    });
  } catch (error) {
    console.error("Whitelist check error:", error);
    return NextResponse.json(
      { error: "Failed to check whitelist status" },
      { status: 500 }
    );
  }
}
