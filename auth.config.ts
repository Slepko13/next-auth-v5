import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs";

import { LoginSchema } from "@/schemas"
import { getUserByEmail } from "@/data/user";

export default {
    providers: [
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