import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const applications = sqliteTable("applications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  discordId: text("discord_id").unique().notNull(),
  license: text("license").notNull().unique(),
  status: text("status").default("PENDING").notNull(),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP").notNull(),
  reviewedBy: text("reviewed_by"),
  attempts: integer("attempts").default(0).notNull(),
});
