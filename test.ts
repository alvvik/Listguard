import { sql } from "drizzle-orm";
import { db } from "./src/db";
import { users } from "./src/db/schema";

async function main() {
  // Zapisywanie danych
  /*await db.insert(users).values({
    discordId: "123456789098765432",
    username: "AlvvTest",
  });
  console.log("Dodano użytkownika!");
*/
  // Odczytywanie danych
  const allUsers = db.select().from(users).all();
  console.log("Użytkownicy w bazie:", allUsers);

  console.log("ludzie", db.all(sql`SELECT * FROM users`));
}

main();
