import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { config as appConfig } from "../config";
import { auth } from "@/lib/auth";
import { env } from "@/lib/env";
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
    const roleResponse = await fetch(`${env.BOT_URL}/check-role`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secretKey: env.TOKEN,
        userId,
        guildId: env.DISCORD_GUILD_ID,
        allowedRoleIds: appConfig.allowedRoleIds,
      }),
      cache: "no-store",
    });

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
