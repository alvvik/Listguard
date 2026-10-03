import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { config as appConfig } from "../config";
import { auth } from "@/lib/auth";
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname !== "/whitelist/manage" && pathname !== "/whitelist/admin") {
    return NextResponse.next();
  }

  const session = await auth();

  if (!session?.user?.discordId) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const userId = session.user.discordId;

  try {
    const roleResponse = await fetch(
      `${process.env.BOT_URL ?? "http://127.0.0.1:3001"}/check-role`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secretKey: process.env.TOKEN,
          userId,
          guildId: process.env.DISCORD_GUILD_ID,
          allowedRoleIds: appConfig.allowedRoleIds,
        }),
        cache: "no-store",
      },
    );

    const { hasRole } = await roleResponse.json();
    if (!roleResponse.ok || !hasRole) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
