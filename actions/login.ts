"use server"

import * as zod from "zod";
import { AuthError } from "next-auth";

import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { generateVerificationToken } from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";


export const login = async (values: zod.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { email, password } = validatedFields.data;

    const candidate = await getUserByEmail(email);
    if (!candidate || !candidate.email || !candidate.password) {
        return {
            error: 'User does not exist'
        }
    }
    if (!candidate.emailVerified) {
        const verificationToken = await generateVerificationToken(
            candidate.email,
        );

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
        );

        return { success: "Confirmation email sent!" };
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        })
    } catch (error) {

        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!" }
                default:
                    return { error: "Something went wrong!" }
            }
        }
        throw error;
    }

};
