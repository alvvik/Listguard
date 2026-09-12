PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`discord_id` text NOT NULL,
	`username` text NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "discord_id", "username", "status", "created_at") SELECT "id", "discord_id", "username", "status", "created_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `users_discord_id_unique` ON `users` (`discord_id`);