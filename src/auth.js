import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import dbConnect, { clientPromise, collections } from "./lib/dbConnect";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import getUserData from "./lib/getUserData";

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
        const user = getUserData(credentials.email);
        return user;
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
        const axistingUser = await collection.findOne(query);

        if (!axistingUser) {
          await collection.insertOne({
            userIdFromNext: user.id,
            email: user.email || null,
            name: user.name,
            profileImage: user.image,
            provider: account.provider,
            role: "user",
            createdAt: new Date(),
          })
        }else if (!axistingUser.provider){
          await collection.updateOne(query, {
            $set: {
              provider: account.provider,
            },
          });
        }else{
          await collection.updateOne(query, {
            $set: {
              lastLoggedIn: new Date(),
            },
          })
        }
        
        return true;
      } catch (error) {
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
});