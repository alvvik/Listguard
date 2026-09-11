import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  discordId: text("discord_id").unique().notNull(),
  username: text("username").notNull(),
  status: text("status").default("PENDING").notNull(),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP").notNull(),
});
