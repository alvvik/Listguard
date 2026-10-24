import { defineConfig } from "vitest/config";
import path from "path";

process.env.NEXT_PUBLIC_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "localhost:2877";
process.env.NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2877";
process.env.DATABASE_URL = process.env.DATABASE_URL || ":memory:";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
