import { z } from 'zod';

export const authSchema = z.object({
    _id: z.string(),
    email: z.string(),
    password: z.string(),
    emailVerified: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type AuthData = z.infer<typeof authSchema>;
