import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_DOMAIN: z.string().min(1),
  NEXT_PUBLIC_API_URL: z.string().min(1),
  NEXT_PUBLIC_BOT_URL: z.string().min(1).default("http://127.0.0.1:3001"),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_BOT_URL: process.env.NEXT_PUBLIC_BOT_URL,
});
