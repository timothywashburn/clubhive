import { z } from 'zod';

export const authSchema = z.object({
    _id: z.string(),
    email: z.string().max(100),
    password: z.string().max(100),
    emailVerified: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type AuthData = z.infer<typeof authSchema>;
