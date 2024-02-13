import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs";

import { LoginSchema } from "@/schemas"
import { getUserByEmail } from "@/data/user";

export default {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Github({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
        Credentials({
            async authorize(credentials) {
                const validatedFields = LoginSchema.safeParse(credentials);

                if (validatedFields.success) {
                    const { email, password } = validatedFields.data;
                    const candidate = await getUserByEmail(email);

                    if (!candidate || !candidate.password) return null;

                    const passwordsMatch = await bcrypt.compare(
                        password,
                        candidate.password,
                    );

                    if (passwordsMatch) {
                        const { password, ...user } = candidate;
                        return candidate;
                    }
                }

                return null;
            }
        })
    ],
} satisfies NextAuthConfig