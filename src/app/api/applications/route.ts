import { db } from "@/db";
import { applications, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { isRateLimited } from "@/lib/rateLimit";
import { z } from "zod";

export const applicationItemSchema = z.object({
  id: z.number(),
  status: z.string(),
  answers: z.string().nullable(),
  createdAt: z.string(),
  discordId: z.string().nullable(),
  username: z.string().nullable(),
});

export type ApplicationItem = z.infer<typeof applicationItemSchema>;

const getApplicationsQuerySchema = z.object({
  status: z.string().optional(),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 50))
    .pipe(
      z
        .number()
        .int("Limit musi być liczbą całkowitą")
        .positive("Limit musi być dodatni")
        .max(100, "Maksymalny limit to 100")
    ),
});

const postApplicationSchema = z.object({
  discordId: z.string().min(1, "Discord ID jest wymagane"),
  username: z.string().min(1, "Nazwa użytkownika jest wymagana"),
  answers: z.record(z.string(), z.any()).optional().nullable(),
});

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const queryParse = getApplicationsQuerySchema.safeParse({
      status: searchParams.get("status") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });

    if (!queryParse.success) {
      const errorMsg = queryParse.error.issues.map((e) => e.message).join(", ");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { status, limit } = queryParse.data;

    let query = db
      .select({
        id: applications.id,
        status: applications.status,
        answers: applications.answers,
        createdAt: applications.createdAt,
        discordId: users.discordId,
        username: users.username,
      })
      .from(applications)
      .leftJoin(users, eq(applications.userId, users.id));

    if (status) {
      query = query.where(eq(applications.status, status)) as typeof query;
    }

    const response = await query.limit(limit);
    return NextResponse.json<ApplicationItem[]>(response, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Nie można obsłużyć tego żądania" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";

    if (isRateLimited(ip, 5, 60 * 1000)) {
      return NextResponse.json(
        { error: "Zbyt wiele prób wysłania podania. Odczekaj chwilę." },
        { status: 429 }
      );
    }

    const authHeader = request.headers.get("authorization");
    const secretKey = process.env.TOKEN;

    if (!authHeader || authHeader !== `Bearer ${secretKey}`) {
      return NextResponse.json({ error: "Brak dostępu" }, { status: 403 });
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

    const bodyParse = postApplicationSchema.safeParse(rawBody);
    if (!bodyParse.success) {
      const errorMsg = bodyParse.error.issues.map((e) => e.message).join(", ");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { discordId, username, answers } = bodyParse.data;

    let [user] = await db
      .select()
      .from(users)
      .where(eq(users.discordId, discordId));

    if (!user) {
      const [newUser] = await db
        .insert(users)
        .values({
          discordId,
          username,
          createdAt: new Date().toISOString(),
        })
        .returning();
      user = newUser;
    }

    const [existingPending] = await db
      .select()
      .from(applications)
      .where(
        and(
          eq(applications.userId, user.id),
          eq(applications.status, "pending")
        )
      );

    if (existingPending) {
      return NextResponse.json(
        { error: "Masz już oczekujące podanie w systemie!" },
        { status: 400 }
      );
    }

    const newApplication = await db
      .insert(applications)
      .values({
        userId: user.id,
        answers: answers ? JSON.stringify(answers) : null,
        status: "pending",
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(
      {
        message: "Podanie zostało wysłane pomyślnie",
        application: {
          ...newApplication[0],
          discordId: user.discordId,
          username: user.username,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Błąd podczas dodawania podania:", err);
    return NextResponse.json(
      { error: "Wystąpił błąd serwera" },
      { status: 500 }
    );
  }
}
