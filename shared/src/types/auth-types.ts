import { z } from 'zod';

export const authSchema = z.object({
    _id: z.string(),
    email: z.string().max(100),
    password: z.string().max(100),
    emailVerified: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const signInRequestSchema = z.object({
    email: z.string().max(100),
    password: z.string().max(100),
});

export const createAccountRequestSchema = z.object({
    name: z.string().max(50),
    email: z.string().max(100),
    password: z.string().max(100),
    school: z.string(),
    major: z.string(),
    educationType: z.string(),
    year: z.string(),
});

export type AuthData = z.infer<typeof authSchema>;
export type SignInRequest = z.infer<typeof signInRequestSchema>;
export type createAccountRequest = z.infer<typeof createAccountRequestSchema>;
