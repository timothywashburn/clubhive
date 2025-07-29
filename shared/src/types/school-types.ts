import { z } from 'zod';

export const schoolSchema = z.object({
    _id: z.string(),
    name: z.string(),
    location: z.string(),
});

export type SchoolData = z.infer<typeof schoolSchema>;
