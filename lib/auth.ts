import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { client } from "@/lib/sanity";
import { adminClient } from "@/lib/sanityAdmin";
import { resend } from "@/lib/resend";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await client.fetch(
          `*[_type == "users" && email == $email][0]`,
          { email: credentials.email }
        );

        if (!user || !user.password) {
          throw new Error("User not found or password not set");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (account.provider === "google") {
        const { email, name, image } = user;
        try {
          // Check if user exists in Sanity
          const existingUser = await client.fetch(
            `*[_type == "users" && email == $email][0]`,
            { email }
          );

          if (!existingUser) {
            // Create user in Sanity if not exists
            await adminClient.create({
              _type: "users",
              name,
              email,
              image,
              role: "customer",
              wishlist: [],
              provider: "google",
            });

            // Send Welcome Email
            try {
              if (resend) {
                const baseUrl = process.env.NEXTAUTH_URL || "https://littlelocals.com";
                await resend.emails.send({
                  from: "Little Locals <sayedewas1234@gmail.com>",
                  to: email,
                  subject: "Welcome to Little Locals! 🎉 Here is your 10% discount",
                  html: `
                    <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
                      <img src="${baseUrl}/icon.png" alt="Little Locals Logo" style="width: 100px; margin-bottom: 20px;" />
                      <h2>Welcome to the Little Locals Family, ${name.split(' ')[0]}!</h2>
                      <p>We are thrilled to have you here. To celebrate, use code <strong>WELCOME10</strong> at checkout for 10% off your first luxury piece.</p>
                      <a href="${baseUrl}/Products" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 15px;">Shop the Collection</a>
                    </div>
                  `
                });
              }
            } catch (emailError) {
              console.error("Failed to send welcome email:", emailError);
              // Don't block sign-in if email fails
            }
          }
          return true;
        } catch (error) {
          console.error("Error during sign in:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }: any) {
      if (session.user) {
        // Fetch user from Sanity to get extra fields like role, wishlist, phone, address
        const sanityUser = await client.fetch(
          `*[_type == "users" && email == $email][0]{
            _id,
            role,
            "wishlist": wishlist[]._ref,
            phone,
            address
          }`,
          { email: session.user.email }
        );

        if (sanityUser) {
          session.user.id = sanityUser._id;
          session.user.role = sanityUser.role;
          session.user.wishlist = sanityUser.wishlist || [];
          session.user.phone = sanityUser.phone || "";
          session.user.address = sanityUser.address || "";
        }
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};
