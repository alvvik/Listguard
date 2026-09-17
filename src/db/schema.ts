import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  discordId: text("discord_id").notNull().unique(),
  username: text("username").notNull(),
  createdAt: text("created_at").notNull(),
});
export const applications = sqliteTable("applications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  answers: text("answers"),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull(),
});
export const usersRelations = relations(users, ({ many }) => ({
  applications: many(applications),
}));
export const applicationsRelations = relations(applications, ({ one }) => ({
  user: one(users, {
    fields: [applications.userId],
    references: [users.id],
  }),
}));
