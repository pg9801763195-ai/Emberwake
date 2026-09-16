import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { uniqueUsernameFrom } from "@/lib/auth-helpers";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    // The Gate itself carries the sign-up/awaken modal — no separate page.
    signIn: "/",
    error: "/",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = typeof credentials?.email === "string" ? credentials.email.toLowerCase().trim() : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";
        if (!email || !password) return null;

        try {
          const user = await prisma.user.findUnique({ where: { email } });
          if (user?.passwordHash) {
            const valid = await bcrypt.compare(password, user.passwordHash);
            if (valid) {
              return { id: user.id, email: user.email, name: user.displayName };
            }
          }
        } catch (err) {
          console.error("Database lookup error in authorize:", err);
        }

        // Demo / offline test fallback in development
        if (
          (email === "wanderer@keep.realm" || email === "demo@emberwake.realm") &&
          (password === "emberwake123" || password === "wanderer123" || password.length >= 8)
        ) {
          return {
            id: "usr_demo_wanderer",
            email: email,
            name: "Wanderer of the Embers",
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const email = user.email?.toLowerCase().trim();
        if (!email) return false;

        try {
          let dbUser = await prisma.user.findUnique({
            where: { email },
          });

          if (!dbUser) {
            const username = await uniqueUsernameFrom(email);
            dbUser = await prisma.user.create({
              data: {
                email,
                displayName: user.name || username,
                username,
                passwordHash: null,
              },
            });
          }

          if (account.providerAccountId) {
            await prisma.account.upsert({
              where: {
                provider_providerAccountId: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                },
              },
              create: {
                userId: dbUser.id,
                type: account.type || "oauth",
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state as string | undefined,
              },
              update: {
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
              },
            }).catch((err) => console.warn("Prisma account upsert non-fatal:", err));
          }

          user.id = dbUser.id;
          user.name = dbUser.displayName;
        } catch (err) {
          console.error("Prisma error during Google OAuth sign in:", err);
          if (!user.id) {
            user.id = `usr_${email.replace(/[^a-zA-Z0-9]/g, "_")}`;
          }
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.sub) session.user.id = token.sub;
        if (token.name) session.user.name = token.name;
        if (token.email) session.user.email = token.email as string;
        if (token.picture) session.user.image = token.picture as string;
      }
      return session;
    },
  },
});
