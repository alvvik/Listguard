"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function checkUserInWhitelist(discordId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.discordId, discordId),
  });
  return user !== null;
}
