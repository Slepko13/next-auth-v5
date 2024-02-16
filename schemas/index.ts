import * as zod from 'zod';

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
    })
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
