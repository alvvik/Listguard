import { NextResponse } from "next/server";
import { db } from "@/db";
import { applications, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isRateLimited } from "@/lib/rateLimit";
import { z } from "zod";

const discordIdParamSchema = z.object({
  discordId: z.string().min(1, "Nieprawidłowy Discord ID"),
});

const patchApplicationSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"], {
    message: "Nieprawidłowy status podania",
  }),
});

async function validateParams(params: Promise<{ discordId: string }>) {
  const resolvedParams = await params;
  const parsed = discordIdParamSchema.safeParse(resolvedParams);
  if (!parsed.success) {
    return null;
  }
  return parsed.data.discordId;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ discordId: string }> }
) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    if (isRateLimited(ip, 40, 60 * 1000)) {
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

    const discordId = await validateParams(params);
    if (!discordId) {
      return NextResponse.json(
        { error: "Nieprawidłowy Discord ID" },
        { status: 400 }
      );
    }

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
  { params }: { params: Promise<{ discordId: string }> }
) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    if (isRateLimited(ip, 10, 60 * 1000)) {
      return NextResponse.json(
        { error: "Zbyt wiele operacji modyfikacji. Odczekaj chwilę." },
        { status: 429 }
      );
    }

    const authHeader = request.headers.get("authorization");
    const secretKey = process.env.TOKEN;

    if (!authHeader || authHeader !== `Bearer ${secretKey}`) {
      return NextResponse.json({ error: "Brak dostępu" }, { status: 403 });
    }

    const discordId = await validateParams(params);
    if (!discordId) {
      return NextResponse.json(
        { error: "Nieprawidłowy Discord ID" },
        { status: 400 }
      );
    }

    await db.delete(users).where(eq(users.discordId, discordId));
    return NextResponse.json(
      { message: "Usunięto użytkownika" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ discordId: string }> }
) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    if (isRateLimited(ip, 15, 60 * 1000)) {
      return NextResponse.json(
        { error: "Zbyt wiele zmian statusu. Odczekaj chwilę." },
        { status: 429 }
      );
    }

    const authHeader = request.headers.get("authorization");
    const secretKey = process.env.TOKEN;

    if (!authHeader || authHeader !== `Bearer ${secretKey}`) {
      return NextResponse.json({ error: "Brak dostępu" }, { status: 403 });
    }

    const discordId = await validateParams(params);
    if (!discordId) {
      return NextResponse.json(
        { error: "Nieprawidłowy Discord ID" },
        { status: 400 }
      );
    }

    let rawBody;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Nieprawidłowy format JSON" },
        { status: 400 }
      );
    }

    const bodyParse = patchApplicationSchema.safeParse(rawBody);
    if (!bodyParse.success) {
      const errorMsg = bodyParse.error.issues.map((e) => e.message).join(", ");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { status } = bodyParse.data;

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.discordId, discordId));

    if (!user) {
      return NextResponse.json(
        { error: "Nie znaleziono użytkownika" },
        { status: 404 }
      );
    }

    await db
      .update(applications)
      .set({ status: status })
      .where(eq(applications.userId, user.id));

    return NextResponse.json(
      { message: "Status podania został zaktualizowany" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
