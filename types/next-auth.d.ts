import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      wishlist: string[];
    } & DefaultSession["user"]
  }
}
