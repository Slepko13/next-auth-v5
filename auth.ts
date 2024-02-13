import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"

import authConfig from "@/auth.config"
import { db } from '@/lib/db'
import { getUserById } from './data/user';

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut
} = NextAuth({
    callbacks: {
        async session({ token, session }) {
            console.log({ sessionToken: token })
            if (token.sub && session.user) {
                session.user.id = token.sub
            }

            if (token.role && session.user) {
                session.user.role = token.role
            }
            return session
        },
        async jwt({ token }) {
            console.log({ token })
            if (!token.sub) return token;
            const user = await getUserById(token.sub)

            if (!user) return token
            token.role = user.role

            return token
        }
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
})