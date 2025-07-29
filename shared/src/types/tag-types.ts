import { z } from 'zod';

export enum TagType {
    CLUB = 'club',
    EVENT = 'event',
}

export const tagSchema = z.object({
    _id: z.string(),
    type: z.enum([TagType.CLUB, TagType.EVENT]),
    text: z.string(),
});

export type TagData = z.infer<typeof tagSchema>;
