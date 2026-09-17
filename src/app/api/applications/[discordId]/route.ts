import { NextResponse } from "next/server";
import { db } from "@/db";
import { applications, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { discordId: string } },
) {
  try {
    const authHeader = request.headers.get("authorization");
    const secretKey = process.env.TOKEN;

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
export async function DELETE(
  request: Request,
  { params }: { params: { discordId: string } },
) {
  try {
    const authHeader = request.headers.get("authorization");
    const secretKey = process.env.TOKEN;

    if (!authHeader || authHeader !== `Bearer ${secretKey}`) {
      return NextResponse.json({ error: "Brak dostępu" }, { status: 403 });
    }
    const { discordId } = await params;
    await db.delete(users).where(eq(users.discordId, discordId));
    return NextResponse.json(
      { message: "Usunieto uzytkonika" },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { discordId: string } },
) {
  try {
    const authHeader = request.headers.get("authorization");
    const secretKey = process.env.TOKEN;

    if (!authHeader || authHeader !== `Bearer ${secretKey}`) {
      return NextResponse.json({ error: "Brak dostępu" }, { status: 403 });
    }
    const { discordId } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Brak statusu w żądaniu" },
        { status: 400 },
      );
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.discordId, discordId));

    if (!user) {
      return NextResponse.json(
        { error: "Nie znaleziono użytkownika" },
        { status: 404 },
      );
    }

    await db
      .update(applications)
      .set({ status: status })
      .where(eq(applications.userId, user.id));

    return NextResponse.json(
      { message: "Status podania został zaktualizowany" },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
