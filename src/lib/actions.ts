"use server";

import { db } from "@/db";
import { users, applications } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { config } from "../../config";

export async function checkUserInWhitelist(discordId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.discordId, discordId),
  });
  return user !== null;
}

export async function submitWhitelistForm(formData: FormData) {
  const session = await auth();

  if (!session?.user?.discordId || !session?.user?.name) {
    return { error: "Musisz być zalogowany, aby wysłać formularz" };
  }

  const validationErrors: string[] = [];
  const answersRecord: Record<string, string> = {}; // Obiekt na odpowiedzi

  for (const question of config.whitelistQuestions) {
    const answer = formData.get(`question-${question.id}`) as string | null;

    if (question.required && (!answer || answer.trim().length === 0)) {
      validationErrors.push(`Pytanie "${question.label}" jest wymagane`);
      continue;
    }

    if (answer) {
      const trimmedAnswer = answer.trim();

      if (trimmedAnswer.length < 3) {
        validationErrors.push(
          `Pytanie "${question.label}" musi mieć minimum 3 znaki`,
        );
        continue;
      }

      // Zapisujemy poprawną odpowiedź przypisaną do ID pytania
      answersRecord[question.id] = trimmedAnswer;
    }
  }

  if (validationErrors.length > 0) {
    return { error: validationErrors.join("; ") };
  }

  try {
    const discordId = session.user.discordId;
    const username = session.user.name;

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
          eq(applications.status, "pending"),
        ),
      );

    if (existingPending) {
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
