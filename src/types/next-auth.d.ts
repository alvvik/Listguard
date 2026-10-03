import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    discordId?: string;
  }

  interface Session {
    user: {
      discordId?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    discordId?: string;
  }
}
