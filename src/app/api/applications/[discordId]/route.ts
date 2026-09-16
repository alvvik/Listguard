import { NextResponse } from "next/server";
import { db } from "@/db";
import { applications, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { discordId: string } },
) {
  try {
    const authHeader = request.headers.get("authorization");
    const secretKey = process.env.BOT_SECRET_KEY;

    if (!authHeader || authHeader !== `Bearer ${secretKey}`) {
      return NextResponse.json({ error: "Brak dostępu" }, { status: 403 });
    }
    const { discordId } = await params;
    const application = await db
      .select({
        id: applications.id,
        status: applications.status,
        answers: applications.answers,
        createdAt: applications.createdAt,
        discordId: users.discordId,
        username: users.username,
      })
      .from(applications)
      .leftJoin(users, eq(applications.userId, users.id))
      .where(eq(users.discordId, discordId))
      .get();

    if (!application) {
      return NextResponse.json({ message: "Brak podania" }, { status: 404 });
    }

    return NextResponse.json(application, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
