import NextAuth from "next-auth";
import { env } from "@/lib/env.server";
import Discord from "next-auth/providers/discord";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Discord({
      clientId: env.CLIENT_ID,
      clientSecret: env.CLIENT_SECRET,
      issuer: "https://discord.com",
    }),
  ],
  secret: env.BETTER_AUTH_SECRET,
  trustHost: true,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.discordId = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.discordId = token.discordId as string;
      }
      return session;
    },
  },
});
