const requiredEnvVars = {
  TOKEN: process.env.TOKEN,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  DISCORD_GUILD_ID: process.env.DISCORD_GUILD_ID,
} as const;

const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(", ")}`
  );
}

export const env = {
  TOKEN: process.env.TOKEN!,
  CLIENT_ID: process.env.CLIENT_ID!,
  CLIENT_SECRET: process.env.CLIENT_SECRET!,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
  DISCORD_GUILD_ID: process.env.DISCORD_GUILD_ID!,
  DATABASE_URL: process.env.DATABASE_URL || "./dev.db",
  BOT_URL: process.env.BOT_URL || "http://127.0.0.1:3001",
};
