"use server";

import { db } from "@/db";
import { users, applications } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { env } from "@/lib/env";
import { config } from "../../config";
import { z } from "zod";

export async function checkUserInWhitelist(discordId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.discordId, discordId),
  });
  return user !== null;
}

export async function checkUserPendingApplication(discordId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.discordId, discordId),
  });

  if (!user) {
    return false;
  }

  const pendingApplication = await db.query.applications.findFirst({
    where: and(
      eq(applications.userId, user.id),
      eq(applications.status, "pending"),
    ),
  });

  return pendingApplication !== null;
}

export async function checkUserHasAllowedRole(discordId: string) {
  try {
    const roleResponse = await fetch(`${env.BOT_URL}/check-role`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secretKey: process.env.TOKEN,
        userId: discordId,
        guildId: env.DISCORD_GUILD_ID,
        allowedRoleIds: config.allowedRoleIds,
      }),
      cache: "no-store",
    });

    const { hasRole } = (await roleResponse.json()) as {
      hasRole?: boolean;
    };

    return roleResponse.ok && hasRole === true;
  } catch {
    return false;
  }
}
const sanitizeAnswer = (value: string) =>
  value.replace(/<[^>]*>?/gm, "").trim();
const whitelistSchema = z.object(
  Object.fromEntries(
    config.whitelistQuestions.map((q) => {
      const key = `question-${q.id}`;
      return [
        key,
        z
          .string()
          .transform(sanitizeAnswer)
          .superRefine((value, ctx) => {
            if (q.required && value.length === 0) {
              ctx.addIssue({
                code: "custom",
                message: `Pytanie "${q.label}" jest wymagane`,
              });
              return;
            }

            if (value.length > 0 && value.length < 3) {
              ctx.addIssue({
                code: "custom",
                message: `Pytanie "${q.label}" musi mieć minimum 3 znaki`,
              });
            }

            const maximumLength = q.style === "short" ? 100 : 1000;
            if (value.length > maximumLength) {
              ctx.addIssue({
                code: "custom",
                message: `Pytanie "${q.label}" nie może przekraczać ${maximumLength} znaków`,
              });
            }
          }),
      ];
    }),
  ),
);

export async function submitWhitelistForm(formData: FormData) {
  const session = await auth();

  if (!session?.user?.discordId || !session?.user?.name) {
    return { error: "Musisz być zalogowany, aby wysłać formularz" };
  }
  const rawData: Record<string, string> = {};
  for (const question of config.whitelistQuestions) {
    const key = `question-${question.id}`;
    const value = formData.get(key);
    rawData[key] = typeof value === "string" ? value : "";
  }

  const result = whitelistSchema.safeParse(rawData);

  if (!result.success) {
    const errorMessages = result.error.issues.map((err) => err.message);
    return { error: errorMessages.join("; ") };
  }

  const answersRecord: Record<string, string> = {};

  for (const question of config.whitelistQuestions) {
    const key = `question-${question.id}`;
    const cleanedAnswer = result.data[key];

    if (cleanedAnswer) {
      answersRecord[question.id] = cleanedAnswer;
    }
  }

  try {
    const discordId = session.user.discordId;
    const username = session.user.name;

    const usersResult = await db
      .select()
      .from(users)
      .where(eq(users.discordId, discordId))
      .limit(1);
    let user = usersResult[0];

    if (!user) {
      await db
        .insert(users)
        .values({ discordId, username, createdAt: new Date().toISOString() })
        .onConflictDoNothing();
      const newUser = await db
        .select()
        .from(users)
        .where(eq(users.discordId, discordId))
        .limit(1);
      user = newUser[0];
      if (!user) {
        throw new Error("Nie udało się utworzyć ani odnaleźć użytkownika");
      }
    }

    const pending = await db
      .select()
      .from(applications)
      .where(
        and(
          eq(applications.userId, user.id),
          eq(applications.status, "pending"),
        ),
      )
      .limit(1);
    if (pending[0]) {
      return { error: "Masz już oczekujące podanie w systemie!" };
    }

    await db.insert(applications).values({
      userId: user.id,
      status: "pending",
      answers: JSON.stringify(answersRecord),
      createdAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error("Wystąpił błąd podczas wysyłania formularza:", error);
    return { error: "Wystąpił błąd podczas wysyłania formularza" };
  }
}
