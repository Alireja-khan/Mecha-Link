import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import dbConnect, { clientPromise, collections } from "./lib/dbConnect";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcrypt";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const collection = await dbConnect(collections.users);

          // Find user by email
          const user = await collection.findOne({ email: credentials.email });
          if (!user) throw new Error("No user found with this email");

          // Check password
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValid) throw new Error("Invalid password");

          // Return user object
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.profileImage || null,
          };
        } catch (err) {
          console.error("Credentials login error:", err);
          return null;
        }
      },
    }),

    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      try {
        const collection = await dbConnect(collections.users);
        let query;

        if (account.provider === "github") {
          query = { userIdFromNext: user.id };
        } else {
          query = { email: user.email };
        }

        const existingUser = await collection.findOne(query);

        if (!existingUser) {
          await collection.insertOne({
            userIdFromNext: user.id,
            email: user.email || null,
            name: user.name,
            profileImage: user.image,
            provider: account.provider,
            role: "user",
            createdAt: new Date(),
          });
        } else if (!existingUser.provider) {
          await collection.updateOne(query, {
            $set: {
              provider: account.provider,
            },
          });
        } else {
          await collection.updateOne(query, {
            $set: {
              lastLoggedIn: new Date(),
            },
          });
        }

        return true;
      } catch (error) {
        console.error("signIn callback error:", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },

    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
});
