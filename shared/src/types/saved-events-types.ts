import { z } from 'zod';

export const savedEventsSchema = z.object({
    _id: z.string(),
    user: z.string(),
    event: z.string(),
    savedAt: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type SavedEventsData = z.infer<typeof savedEventsSchema>;
