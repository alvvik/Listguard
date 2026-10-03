import { NextRequest, NextResponse } from "next/server";
import { checkUserInWhitelist } from "@/lib/actions";

export async function POST(request: NextRequest) {
  try {
    const { discordId } = await request.json();
    
    if (!discordId) {
      return NextResponse.json({ error: "Discord ID is required" }, { status: 400 });
    }

    const isInWhitelist = await checkUserInWhitelist(discordId);
    
    return NextResponse.json({ isInWhitelist });
  } catch (error) {
    console.error("Error checking whitelist:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
