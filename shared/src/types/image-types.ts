import { z } from 'zod';

export const imageSchema = z.object({
    _id: z.string(),
    imgData: z.any(), // Buffer on server, no idea what this is on the client side atm
    contentType: z.string(),
    expiresAt: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type ImageData = z.infer<typeof imageSchema>;
