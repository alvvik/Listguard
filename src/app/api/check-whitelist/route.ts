import { NextRequest, NextResponse } from "next/server";
import { checkUserInWhitelist } from "@/lib/actions";
import { isRateLimited } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";

    if (isRateLimited(ip, 30, 60 * 1000)) {
      return NextResponse.json(
        { error: "Zbyt wiele zapytań. Spróbuj ponownie za chwilę." },
        { status: 429 }
      );
    }

    const authHeader = request.headers.get("authorization");
    const secretKey = process.env.TOKEN;

    if (!authHeader || authHeader !== `Bearer ${secretKey}`) {
      return NextResponse.json({ error: "Brak dostępu" }, { status: 403 });
    }
    const { discordId } = await request.json();

    if (!discordId) {
      return NextResponse.json(
        { error: "Discord ID is required" },
        { status: 400 }
      );
    }

    const isInWhitelist = await checkUserInWhitelist(discordId);

    return NextResponse.json({ isInWhitelist });
  } catch (error) {
    console.error("Error checking whitelist:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
