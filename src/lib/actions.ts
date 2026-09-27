"use server";

import { db } from "@/db";
import { users, applications } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";

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

  /*if () {
    return { error: "Wszystkie pola są wymagane" };
  }*/

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

    const answers = JSON.stringify({});

    await db.insert(applications).values({
      userId: user.id,
      answers,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error("Wystąpił błąd podczas wysyłania formularza:", error);
    return { error: "Wystąpił błąd podczas wysyłania formularza" };
  }
}
