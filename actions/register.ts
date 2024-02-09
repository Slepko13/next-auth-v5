"use server"

import * as zod from "zod";

import { RegisterSchema } from "@/schemas";

export const register = async (values: zod.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    return { success: "Register success" };
};
