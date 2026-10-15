import { z } from "zod";

const envSchema = z.object({
  TOKEN: z.string().min(1),
  CLIENT_ID: z.string().min(1),
  CLIENT_SECRET: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(1),
  DISCORD_GUILD_ID: z.string().min(1),
  DATABASE_URL: z.string().optional().default("./dev.db"),
});

export const env = envSchema.parse({
  TOKEN: process.env.TOKEN,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  DISCORD_GUILD_ID: process.env.DISCORD_GUILD_ID,
  DATABASE_URL: process.env.DATABASE_URL,
});
