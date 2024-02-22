import { UserRole } from '@prisma/client';
import * as zod from 'zod';

export const SettingsSchema = zod.object({
    name: zod.optional(zod.string()),
    isTwoFactorEnabled: zod.optional(zod.boolean()),
    role: zod.enum([UserRole.ADMIN, UserRole.USER]),
    email: zod.optional(zod.string().email()),
    password: zod.optional(zod.string().min(6)),
    newPassword: zod.optional(zod.string().min(6)),
})
    .refine((data) => {
        // if (data.password && !data.newPassword) {
        //     return false;
        // }

        // return true;
        return !(data.password && !data.newPassword)
    }, {
        message: "New password is required!",
        path: ["newPassword"]
    })
    .refine((data) => {
        // if (data.newPassword && !data.password) {
        //     return false;
        // }

        // return true;

        return !(data.newPassword && !data.password)
    }, {
        message: "Password is required!",
        path: ["password"]
    })

export const NewPasswordSchema = zod.object({
    password: zod.string().min(6, {
        message: 'Password should be 6 characters minimum'
    }),
});

export const ResetSchema = zod.object({
    email: zod.string().email({
        message: 'Email is required'
    }),
});

export const LoginSchema = zod.object({
    email: zod.string().email({
        message: 'Email is required'
    }),
    password: zod.string().min(1, {
        message: 'Password is required'
    }),
    code: zod.optional(zod.string())
});

export const RegisterSchema = zod.object({
    email: zod.string().email({
        message: 'Email is required'
    }),
    password: zod.string().min(6, {
        message: 'Password should be 6 characters minimum'
    }),
    name: zod.string().min(2, {
        message: 'Minimum 2 characters required'
    })
})
