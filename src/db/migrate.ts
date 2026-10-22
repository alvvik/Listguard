import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import path from "path";

const dbPath = process.env.DATABASE_URL || "./dev.db";
console.log(`Running migrations on database: ${dbPath}`);

const sqlite = new Database(dbPath);
const db = drizzle(sqlite);

const migrationsFolder = path.join(process.cwd(), "src/db/migrations");

try {
  migrate(db, { migrationsFolder });
  console.log("Migrations completed successfully!");
} catch (error) {
  console.error("Migration failed:", error);
  process.exit(1);
}
